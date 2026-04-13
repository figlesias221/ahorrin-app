#!/usr/bin/env tsx

/**
 * Google Indexing API Script
 *
 * Este script solicita la indexación de URLs en Google Search Console
 * usando la Google Indexing API.
 *
 * Setup:
 * 1. Crear un Service Account en Google Cloud Console
 * 2. Habilitar "Web Search Indexing API"
 * 3. Descargar el JSON de credenciales
 * 4. Agregar el email del service account como owner en Search Console
 * 5. Guardar las credenciales en GOOGLE_APPLICATION_CREDENTIALS o .env
 *
 * Uso:
 * npm run request-indexing
 */

import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/indexing'];
const BASE_URL = 'https://www.ahorrin.app';

// URLs de blogs para indexar
const BLOG_URLS = [
  '/blog/afap-uruguay-2025-cual-elegir-rendimiento-comisiones',
  '/blog/aguinaldo-uruguay-2025-cuando-se-cobra-como-calcularlo',
  '/blog/alquiler-uruguay-2025-todo-lo-que-nadie-te-cuenta-antes-de-firmar',
  '/blog/devolucion-irpf-uruguay-2025-como-saber-cuanto-cobrar',
  '/blog/dolar-estrategia-uruguay-2025-cuando-comprar-ui-vs-dolares',
  '/blog/monotributo-uruguay-2025-guia-completa-requisitos-costos',
  '/blog/prestamos-personales-uruguay-2025-tasas-reales-comparativa',
  '/blog/salario-liquido-uruguay-2025-cuanto-te-queda-realmente',
  '/blog/gastos-hormiga-uruguay-como-100-pesos-se-vuelven-3600-al-ano',
  '/blog/invertir-desde-500-pesos-uruguay-guia-principiantes',
  '/blog/prestamos-hipotecarios-uruguay-2025-guia-completa',
  '/blog/calendario-vencimientos-impuestos-uruguay-2025',
  '/blog/organizar-finanzas-personales-uruguay-2025',
  '/blog/analisis-tarjetas-que-mas-rinden-uruguay-2025',
];

async function requestIndexing() {
  try {
    console.log('🚀 Iniciando solicitud de indexación...\n');

    // Autenticación con service account
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: SCOPES,
    });

    const authClient = await auth.getClient();
    const indexing = google.indexing({ version: 'v3', auth: authClient as any });

    let successCount = 0;
    let errorCount = 0;

    // Solicitar indexación para cada URL
    for (const path of BLOG_URLS) {
      const url = `${BASE_URL}${path}`;

      try {
        console.log(`📄 Solicitando indexación: ${url}`);

        const response = await indexing.urlNotifications.publish({
          requestBody: {
            url: url,
            type: 'URL_UPDATED',
          },
        });

        if (response.status === 200) {
          console.log(`✅ Éxito: ${url}\n`);
          successCount++;
        } else {
          console.log(`⚠️  Status ${response.status}: ${url}\n`);
          errorCount++;
        }

        // Delay para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error: any) {
        console.error(`❌ Error en ${url}:`);
        console.error(`   ${error.message}\n`);
        errorCount++;
      }
    }

    // Resumen
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE INDEXACIÓN');
    console.log('='.repeat(60));
    console.log(`✅ Exitosas: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log(`📝 Total: ${BLOG_URLS.length}`);
    console.log('='.repeat(60) + '\n');

    if (successCount > 0) {
      console.log('🎉 Solicitudes enviadas exitosamente!');
      console.log('⏱️  Google procesará las URLs en las próximas horas/días.');
      console.log('🔍 Verifica el estado en: https://search.google.com/search-console\n');
    }

  } catch (error: any) {
    console.error('\n❌ ERROR FATAL:');

    if (error.message.includes('GOOGLE_APPLICATION_CREDENTIALS')) {
      console.error('\n⚠️  No se encontraron credenciales de Google.');
      console.error('\n📖 PASOS PARA CONFIGURAR:\n');
      console.error('1. Ir a https://console.cloud.google.com/');
      console.error('2. Crear un Service Account');
      console.error('3. Habilitar "Web Search Indexing API"');
      console.error('4. Descargar el JSON de credenciales');
      console.error('5. Ejecutar:');
      console.error('   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json"');
      console.error('   O agregar a .env.local:\n');
      console.error('   GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json\n');
    } else {
      console.error(error.message);
      console.error('\n💡 Si el error es sobre permisos:');
      console.error('   - Verifica que el email del service account esté agregado');
      console.error('     como owner en Google Search Console');
      console.error('   - URL: https://search.google.com/search-console\n');
    }

    process.exit(1);
  }
}

// Ejecutar
requestIndexing();
