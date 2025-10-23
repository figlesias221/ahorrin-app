#!/bin/bash

# Ahorrin SEO Indexing Checker
# Verifica qué páginas están indexadas en Google

echo "🔍 Verificando Indexación de Ahorrin en Google"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URLs clave para verificar
declare -A urls=(
  ["Homepage"]="ahorrin.app"
  ["Blog"]="ahorrin.app/blog"
  ["BROU"]="ahorrin.app/brou"
  ["Itaú"]="ahorrin.app/itau"
  ["Santander"]="ahorrin.app/santander"
  ["BBVA"]="ahorrin.app/bbva"
  ["Scotiabank"]="ahorrin.app/scotiabank"
  ["Heritage"]="ahorrin.app/heritage"
  ["Herramientas"]="ahorrin.app/herramientas"
  ["Calculadora"]="ahorrin.app/herramientas/calculadora-presupuesto"
)

indexed_count=0
not_indexed_count=0

# Función para verificar indexación
check_url() {
  local name=$1
  local url=$2

  # Buscar en Google usando site: operator
  result=$(curl -s -A "Mozilla/5.0" "https://www.google.com/search?q=site:${url}" | grep -o "did not match any documents")

  if [ -z "$result" ]; then
    echo -e "${GREEN}✅ $name${NC} - https://www.${url}"
    ((indexed_count++))
    return 0
  else
    echo -e "${RED}❌ $name${NC} - https://www.${url}"
    ((not_indexed_count++))
    return 1
  fi
}

# Verificar cada URL
for name in "${!urls[@]}"; do
  url="${urls[$name]}"
  check_url "$name" "$url"
  sleep 1  # Para no sobrecargar Google
done

echo ""
echo "=============================================="
echo -e "${GREEN}Indexadas:${NC} $indexed_count / ${#urls[@]}"
echo -e "${RED}No indexadas:${NC} $not_indexed_count / ${#urls[@]}"

# Calcular porcentaje
percentage=$((indexed_count * 100 / ${#urls[@]}))
echo ""

if [ $percentage -eq 100 ]; then
  echo -e "${GREEN}🎉 Todas las páginas están indexadas!${NC}"
elif [ $percentage -ge 70 ]; then
  echo -e "${YELLOW}⚠️  La mayoría están indexadas. Forzá las faltantes en Search Console.${NC}"
else
  echo -e "${RED}🚨 Pocas páginas indexadas. Verificá:${NC}"
  echo "   1. Sitemap submitido en Search Console"
  echo "   2. Robots.txt permite crawling"
  echo "   3. No hay errores en Search Console"
fi

echo ""
echo "💡 Próximos pasos:"
echo "   - Submitir sitemap en Google Search Console"
echo "   - Solicitar indexación manual de URLs no indexadas"
echo "   - Revisar 'Coverage' en Search Console para ver errores"
echo ""
