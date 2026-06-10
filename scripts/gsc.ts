#!/usr/bin/env tsx

/**
 * Google Search Console API:
 *   - Lista las propiedades accesibles al service account
 *   - Submit/resubmit del sitemap.xml
 *   - URL Inspection (read-only) sobre las páginas nuevas
 *
 * El service account de creds.json tiene que estar agregado como owner
 * (o usuario con permisos completos) en la propiedad de GSC.
 *
 * Setup:
 *   - Habilitar "Search Console API" en Google Cloud Console
 *   - Agregar el email del service account en GSC → Settings → Users and permissions
 *
 * Uso:
 *   bash scripts/gsc.sh                           # full run (sites + sitemap + inspect 12 URLs)
 *   bash scripts/gsc.sh --inspect-all             # inspect todas las URLs (cuidado con quota)
 *   bash scripts/gsc.sh --only-sitemap            # solo submit sitemap, sin inspecciones
 */

import { google } from 'googleapis';
import { getStandalonePageSlugs } from '../lib/glossary';
import { getAllAuthorSlugs } from '../lib/authors';
import { getAllPostSlugs } from '../lib/mdx';

const SCOPES = ['https://www.googleapis.com/auth/webmasters'];
const HOST = 'www.ahorrin.app';
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;

const ARGS = process.argv.slice(2);
const ONLY_SITEMAP = ARGS.includes('--only-sitemap');
const INSPECT_ALL = ARGS.includes('--inspect-all');
// INSPECT_URLS="https://...,https://..." inspecciona solo esas URLs
const INSPECT_URLS = process.env.INSPECT_URLS?.split(',').map((u) => u.trim()).filter(Boolean);

function newUrls(): string[] {
  // Las 12 páginas más nuevas a verificar manualmente.
  const glossary = getStandalonePageSlugs().map((s) => `https://${HOST}/glosario/${s}`);
  const authors = getAllAuthorSlugs().map((s) => `https://${HOST}/autor/${s}`);
  return [...glossary, ...authors, `https://${HOST}/metodologia`];
}

function allUrls(): string[] {
  const glossary = getStandalonePageSlugs().map((s) => `https://${HOST}/glosario/${s}`);
  const authors = getAllAuthorSlugs().map((s) => `https://${HOST}/autor/${s}`);
  const blog = getAllPostSlugs().map((s) => `https://${HOST}/blog/${s}`);
  return [`https://${HOST}/`, `https://${HOST}/metodologia`, ...glossary, ...authors, ...blog];
}

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: SCOPES,
  });
  const authClient = await auth.getClient();
  const sc = google.searchconsole({ version: 'v1', auth: authClient as never });

  // --- 1. Sites accesibles -----------------------------------------------
  console.log('🔍 Listando propiedades accesibles al service account...\n');
  const sitesResp = await sc.sites.list();
  const sites = sitesResp.data.siteEntry ?? [];
  if (sites.length === 0) {
    console.error('❌ El service account no tiene acceso a ninguna propiedad de GSC.');
    console.error('   Agregalo en: GSC → Settings → Users and permissions → Add user');
    process.exit(1);
  }
  for (const s of sites) {
    console.log(`   ${s.permissionLevel?.padEnd(20)} ${s.siteUrl}`);
  }

  const ahorrinSite = sites.find(
    (s) =>
      s.siteUrl &&
      (s.siteUrl.includes('ahorrin.app') || s.siteUrl === `sc-domain:ahorrin.app`) &&
      (s.permissionLevel === 'siteOwner' || s.permissionLevel === 'siteFullUser'),
  );

  if (!ahorrinSite || !ahorrinSite.siteUrl) {
    console.error('\n❌ No se encontró ahorrin.app con permisos suficientes.');
    console.error('   Necesitás permisos siteOwner o siteFullUser para enviar sitemap.');
    process.exit(1);
  }

  const siteUrl = ahorrinSite.siteUrl;
  console.log(`\n✅ Usando propiedad: ${siteUrl} (${ahorrinSite.permissionLevel})\n`);

  // --- 2. Submit sitemap -------------------------------------------------
  console.log(`📤 Enviando sitemap: ${SITEMAP_URL}`);
  await sc.sitemaps.submit({ siteUrl, feedpath: SITEMAP_URL });
  console.log('✅ Sitemap submit OK');

  const sitemapInfo = await sc.sitemaps.get({ siteUrl, feedpath: SITEMAP_URL });
  const sm = sitemapInfo.data;
  console.log('\n📋 Estado del sitemap:');
  console.log(`   Path:           ${sm.path}`);
  console.log(`   Last submitted: ${sm.lastSubmitted}`);
  console.log(`   Last downloaded:${sm.lastDownloaded}`);
  console.log(`   Errors:         ${sm.errors ?? 0}`);
  console.log(`   Warnings:       ${sm.warnings ?? 0}`);
  console.log(`   Is pending:     ${sm.isPending}`);
  console.log(`   Is sitemaps idx:${sm.isSitemapsIndex}`);
  if (sm.contents && sm.contents.length > 0) {
    for (const c of sm.contents) {
      console.log(`   ${c.type?.padEnd(6)} submitted=${c.submitted} indexed=${c.indexed}`);
    }
  }

  if (ONLY_SITEMAP) return;

  // --- 3. URL Inspection -------------------------------------------------
  const targets = INSPECT_URLS?.length ? INSPECT_URLS : INSPECT_ALL ? allUrls() : newUrls();
  console.log(`\n🔬 Inspeccionando ${targets.length} URLs (read-only) ...\n`);

  const results: Array<{ url: string; verdict: string; coverage: string; lastCrawl: string }> = [];
  let errorCount = 0;

  for (const inspectionUrl of targets) {
    try {
      const resp = await sc.urlInspection.index.inspect({
        requestBody: { siteUrl, inspectionUrl, languageCode: 'es-UY' },
      });
      const r = resp.data.inspectionResult;
      const ix = r?.indexStatusResult;
      const verdict = ix?.verdict ?? 'UNKNOWN';
      const coverage = ix?.coverageState ?? '-';
      const lastCrawl = ix?.lastCrawlTime ?? '-';
      results.push({ url: inspectionUrl, verdict, coverage, lastCrawl });
      const tag =
        verdict === 'PASS' ? '✅' : verdict === 'NEUTRAL' ? '⚪' : verdict === 'FAIL' ? '❌' : '❓';
      console.log(`${tag} ${inspectionUrl}`);
      console.log(`   verdict: ${verdict} | coverage: ${coverage} | last crawl: ${lastCrawl}`);
      await new Promise((r) => setTimeout(r, 600));
    } catch (error) {
      errorCount++;
      const msg = (error as Error).message ?? String(error);
      console.log(`❌ ${inspectionUrl}`);
      console.log(`   error: ${msg.slice(0, 120)}`);
    }
  }

  // --- 4. Resumen --------------------------------------------------------
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN URL INSPECTION');
  console.log('='.repeat(60));
  const counts = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.verdict] = (acc[r.verdict] ?? 0) + 1;
    return acc;
  }, {});
  for (const [verdict, n] of Object.entries(counts)) {
    console.log(`   ${verdict}: ${n}`);
  }
  if (errorCount) console.log(`   ERROR (API call failed): ${errorCount}`);

  const notIndexed = results.filter((r) => r.verdict !== 'PASS');
  if (notIndexed.length > 0) {
    console.log('\n⚠️  URLs que aún no están indexadas:');
    for (const r of notIndexed) {
      console.log(`   ${r.url}`);
      console.log(`     coverage: ${r.coverage}`);
    }
    console.log('\n💡 Para forzar indexación rápida, abrí cada una en GSC → URL Inspection');
    console.log('   y tocá "Request Indexing" (no hay equivalente API para esto).');
  }
}

main().catch((error) => {
  console.error('\n❌ ERROR FATAL:');
  const err = error as { message?: string; code?: number };
  if (err.message?.includes('GOOGLE_APPLICATION_CREDENTIALS')) {
    console.error('Falta GOOGLE_APPLICATION_CREDENTIALS. Usá: bash scripts/gsc.sh');
  } else if (err.code === 403 || err.message?.includes('403')) {
    console.error('403 — el service account no tiene permisos en la propiedad de GSC.');
    console.error('Agregalo en GSC → Settings → Users and permissions.');
  } else if (err.code === 404 || err.message?.includes('404')) {
    console.error('404 — la propiedad o el sitemap no existe.');
  } else if (err.message?.includes('403') || err.message?.includes('access')) {
    console.error('Falta habilitar "Google Search Console API" en Cloud Console.');
  } else {
    console.error(err.message ?? error);
  }
  process.exit(1);
});
