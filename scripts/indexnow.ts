#!/usr/bin/env tsx

/**
 * IndexNow: ping Bing / Yandex / DuckDuckGo / Seznam with the full Ahorrin
 * URL list. Free, no auth. Bing actually re-crawls on these submissions
 * (unlike Google's Indexing API for non-Job/Event content).
 *
 * Setup (one-time):
 * - Key file at https://www.ahorrin.app/732db647ba2f796fc9bddc821296f76c.txt
 *   must be reachable in production (committed to /public/).
 *
 * Usage:
 *   npm run request-indexnow
 *   ONLY_NEW=1 npm run request-indexnow   # solo glosario + autores + metodologia
 *   ONLY_BLOG=1 npm run request-indexnow  # solo posts del blog
 *   DRY_RUN=1 npm run request-indexnow    # imprime URLs y payload sin enviar
 */

import { getAllPostSlugs } from '../lib/mdx';
import { getStandalonePageSlugs } from '../lib/glossary';
import { getAllAuthorSlugs } from '../lib/authors';

const HOST = 'www.ahorrin.app';
const BASE_URL = `https://${HOST}`;
const KEY = '732db647ba2f796fc9bddc821296f76c';
const KEY_LOCATION = `${BASE_URL}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

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

  const seen = new Set<string>();
  return paths
    .map((p) => `${BASE_URL}${p}`)
    .filter((url) => {
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    });
}

async function pingIndexNow() {
  const urlList = buildUrls();

  console.log(`📋 ${urlList.length} URLs para IndexNow`);
  if (ONLY_NEW) console.log('   (filtro: ONLY_NEW)');
  if (ONLY_BLOG) console.log('   (filtro: ONLY_BLOG)');
  if (DRY_RUN) console.log('   (DRY_RUN — no se enviará el payload)');
  console.log(`   Key file: ${KEY_LOCATION}\n`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  if (DRY_RUN) {
    urlList.forEach((u) => console.log(`  - ${u}`));
    console.log(`\nPayload (sin enviar):`);
    console.log(JSON.stringify(payload, null, 2).slice(0, 600) + '...');
    return;
  }

  // Verifica que el key file esté servido en producción antes de pinguear.
  console.log(`🔑 Verificando key file accesible en ${KEY_LOCATION} ...`);
  const keyCheck = await fetch(KEY_LOCATION);
  const keyBody = (await keyCheck.text()).trim();
  if (!keyCheck.ok || keyBody !== KEY) {
    console.error(`❌ Key file no accesible o contenido inesperado.`);
    console.error(`   status: ${keyCheck.status}`);
    console.error(`   contenido recibido: "${keyBody.slice(0, 64)}"`);
    console.error(`   esperado: "${KEY}"`);
    console.error(`\n💡 Esperá a que termine el deploy en Vercel y volvé a correr.`);
    process.exit(1);
  }
  console.log(`✅ Key file servido correctamente\n`);

  console.log(`🚀 Enviando ${urlList.length} URLs a IndexNow ...`);
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  console.log(`\n📊 Respuesta: HTTP ${response.status} ${response.statusText}`);

  // 200/202 = aceptado. 422 = lista inválida. 4xx = key/host issues. 5xx = retry.
  if (response.status === 200 || response.status === 202) {
    console.log(`✅ IndexNow aceptó las ${urlList.length} URLs.`);
    console.log(`🔍 Bing/DuckDuckGo/Yandex re-crawlean en horas.`);
    console.log(`   GSC: https://search.google.com/search-console`);
    console.log(`   Bing: https://www.bing.com/webmasters`);
    return;
  }

  const body = await response.text();
  console.error(`⚠️  IndexNow devolvió un código no esperado.`);
  console.error(`   body: ${body.slice(0, 400)}`);

  if (response.status === 422) {
    console.error(`\n💡 422 suele indicar URLs malformadas o fuera del host declarado.`);
  } else if (response.status === 403) {
    console.error(`\n💡 403 = key file no coincide con la key del payload.`);
  } else if (response.status === 429) {
    console.error(`\n💡 429 = rate limit. Esperá unos minutos y reintentá.`);
  }
  process.exit(1);
}

pingIndexNow().catch((error) => {
  console.error('\n❌ ERROR FATAL:');
  console.error((error as Error).message ?? error);
  process.exit(1);
});
