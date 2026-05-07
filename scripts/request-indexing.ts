#!/usr/bin/env tsx

/**
 * Google Indexing API: request indexing for all important Ahorrin URLs.
 *
 * URL list is built dynamically from lib/mdx, lib/glossary, lib/authors so it
 * never goes stale as new posts and terms are added. Default quota on the
 * Indexing API is 200 URLs/day — current site ships well under that.
 *
 * Note: Google's Indexing API officially supports JobPosting and BroadcastEvent.
 * For blog/glossary/static pages the API call still succeeds, but Google may
 * not re-crawl on every call. Complement with sitemap submission and GSC URL
 * Inspection for the most important pages.
 *
 * Setup (one-time):
 * 1. Crear Service Account en Google Cloud Console
 * 2. Habilitar "Web Search Indexing API"
 * 3. Descargar JSON de credenciales (este repo lo espera en ./creds.json)
 * 4. Agregar el email del service account como owner en Search Console
 *
 * Uso:
 *   bash scripts/index-blogs.sh        # carga GOOGLE_APPLICATION_CREDENTIALS y corre el script
 *   npm run request-indexing            # asume que GOOGLE_APPLICATION_CREDENTIALS ya está seteada
 *
 * Filtros opcionales (env vars):
 *   ONLY_NEW=1            # solo glosario standalone + páginas de autor + metodología
 *   ONLY_BLOG=1           # solo posts del blog
 *   DRY_RUN=1             # imprime URLs sin llamar a la API
 */

import { google } from 'googleapis';
import { getAllPostSlugs } from '../lib/mdx';
import { getStandalonePageSlugs } from '../lib/glossary';
import { getAllAuthorSlugs } from '../lib/authors';

const SCOPES = ['https://www.googleapis.com/auth/indexing'];
const BASE_URL = 'https://www.ahorrin.app';

const ONLY_NEW = process.env.ONLY_NEW === '1';
const ONLY_BLOG = process.env.ONLY_BLOG === '1';
const DRY_RUN = process.env.DRY_RUN === '1';

const STATIC_PAGES = [
  '/',
  '/blog',
  '/herramientas',
  '/glosario',
  '/preguntas-frecuentes',
  '/bancos-uruguay',
  '/pricing',
  '/sobre-nosotros',
  '/metodologia',
  '/contacto',
  '/privacidad',
  '/terminos',
  '/herramientas/calculadora-salario-liquido',
  '/herramientas/calculadora-presupuesto',
  '/herramientas/conversor-extractos',
  '/herramientas/inflacion-real',
];

function buildUrls(): string[] {
  const blogPaths = getAllPostSlugs().map((s) => `/blog/${s}`);
  const glossaryPaths = getStandalonePageSlugs().map((s) => `/glosario/${s}`);
  const authorPaths = getAllAuthorSlugs().map((s) => `/autor/${s}`);

  let paths: string[];
  if (ONLY_BLOG) {
    paths = blogPaths;
  } else if (ONLY_NEW) {
    paths = [...glossaryPaths, ...authorPaths, '/metodologia'];
  } else {
    paths = [...STATIC_PAGES, ...blogPaths, ...glossaryPaths, ...authorPaths];
  }

  // Dedupe + absolute URLs
  const seen = new Set<string>();
  return paths
    .map((p) => `${BASE_URL}${p}`)
    .filter((url) => {
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    });
}

async function requestIndexing() {
  const urls = buildUrls();

  console.log(`📋 ${urls.length} URLs a indexar`);
  if (ONLY_NEW) console.log('   (filtro: ONLY_NEW)');
  if (ONLY_BLOG) console.log('   (filtro: ONLY_BLOG)');
  if (DRY_RUN) console.log('   (DRY_RUN — no se llamará a la API)');
  console.log('');

  if (DRY_RUN) {
    urls.forEach((u) => console.log(`  - ${u}`));
    console.log(`\nTotal: ${urls.length}`);
    return;
  }

  if (urls.length > 200) {
    console.warn(
      `⚠️  ${urls.length} URLs supera el quota diario por defecto (200). Algunas fallarán hacia el final.\n`,
    );
  }

  try {
    console.log('🚀 Iniciando solicitud de indexación...\n');

    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: SCOPES,
    });
    const authClient = await auth.getClient();
    const indexing = google.indexing({ version: 'v3', auth: authClient as never });

    let successCount = 0;
    let errorCount = 0;
    let quotaCount = 0;

    for (const url of urls) {
      try {
        process.stdout.write(`📄 ${url} ... `);
        const response = await indexing.urlNotifications.publish({
          requestBody: { url, type: 'URL_UPDATED' },
        });

        if (response.status === 200) {
          console.log('✅');
          successCount++;
        } else {
          console.log(`⚠️  status ${response.status}`);
          errorCount++;
        }

        // Pequeña pausa entre llamadas (rate limiting)
        await new Promise((resolve) => setTimeout(resolve, 800));
      } catch (error) {
        const err = error as { message?: string; code?: number };
        const msg = err.message ?? String(error);
        if (msg.includes('quota') || msg.includes('Quota') || err.code === 429) {
          console.log('🛑 quota agotado');
          quotaCount++;
          break; // quota agotado: cortar el loop
        }
        console.log(`❌ ${msg.slice(0, 80)}`);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN');
    console.log('='.repeat(60));
    console.log(`✅ Exitosas: ${successCount}`);
    console.log(`❌ Errores:  ${errorCount}`);
    if (quotaCount) console.log(`🛑 Detenido por quota tras ${successCount + errorCount} URLs`);
    console.log(`📝 Total intentadas: ${successCount + errorCount}/${urls.length}`);
    console.log('='.repeat(60) + '\n');

    if (successCount > 0) {
      console.log('🎉 URLs notificadas. Google procesa en horas/días.');
      console.log('🔍 Estado: https://search.google.com/search-console\n');
    }
  } catch (error) {
    const err = error as { message?: string };
    console.error('\n❌ ERROR FATAL:');
    if (err.message?.includes('GOOGLE_APPLICATION_CREDENTIALS')) {
      console.error('\n⚠️  No se encontraron credenciales de Google.');
      console.error('Usá: bash scripts/index-blogs.sh');
      console.error('o seteá GOOGLE_APPLICATION_CREDENTIALS apuntando a creds.json\n');
    } else {
      console.error(err.message ?? error);
    }
    process.exit(1);
  }
}

requestIndexing();
