#!/bin/bash

# Script helper para ejecutar la indexación de blogs con las credenciales correctas

export GOOGLE_APPLICATION_CREDENTIALS="/Users/federicoiglesias/apps/ahorrin-app/creds.json"
npm run request-indexing
