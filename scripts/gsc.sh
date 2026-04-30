#!/bin/bash
# Helper para correr el script de Google Search Console con las credenciales correctas.
export GOOGLE_APPLICATION_CREDENTIALS="/Users/federicoiglesias/apps/ahorrin-app/creds.json"
npx tsx scripts/gsc.ts "$@"
