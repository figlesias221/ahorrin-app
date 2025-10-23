#!/bin/bash

# Ahorrin SEO Health Checker
# Verifica que sitemap y robots estén funcionando

echo "🏥 Verificando Salud SEO de Ahorrin"
echo "===================================="
echo ""

BASE_URL="https://www.ahorrin.app"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Check Sitemap
echo -e "${BLUE}📄 Verificando Sitemap...${NC}"
sitemap_status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/sitemap.xml")

if [ "$sitemap_status" == "200" ]; then
  echo -e "${GREEN}✅ Sitemap accesible${NC} (${sitemap_status})"

  # Count URLs in sitemap
  url_count=$(curl -s "${BASE_URL}/sitemap.xml" | grep -o "<loc>" | wc -l)
  echo -e "   📊 URLs en sitemap: ${url_count}"
else
  echo -e "${RED}❌ Sitemap no accesible${NC} (${sitemap_status})"
fi

echo ""

# 2. Check Robots.txt
echo -e "${BLUE}🤖 Verificando Robots.txt...${NC}"
robots_status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/robots.txt")

if [ "$robots_status" == "200" ]; then
  echo -e "${GREEN}✅ Robots.txt accesible${NC} (${robots_status})"

  # Check if sitemap is referenced
  if curl -s "${BASE_URL}/robots.txt" | grep -q "Sitemap:"; then
    echo -e "${GREEN}   ✅ Sitemap referenciado en robots.txt${NC}"
  else
    echo -e "${YELLOW}   ⚠️  Sitemap NO referenciado en robots.txt${NC}"
  fi
else
  echo -e "${RED}❌ Robots.txt no accesible${NC} (${robots_status})"
fi

echo ""

# 3. Check critical pages
echo -e "${BLUE}🌐 Verificando Páginas Críticas...${NC}"

pages=(
  "/"
  "/blog"
  "/brou"
  "/itau"
  "/santander"
)

for page in "${pages[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${page}")

  if [ "$status" == "200" ]; then
    echo -e "${GREEN}✅${NC} ${page} (${status})"
  else
    echo -e "${RED}❌${NC} ${page} (${status})"
  fi
done

echo ""

# 4. Check meta tags on homepage
echo -e "${BLUE}🏷️  Verificando Meta Tags (Homepage)...${NC}"

homepage_html=$(curl -s "${BASE_URL}/")

# Check for essential meta tags
if echo "$homepage_html" | grep -q "<title>"; then
  echo -e "${GREEN}✅ Tiene <title>${NC}"
else
  echo -e "${RED}❌ Falta <title>${NC}"
fi

if echo "$homepage_html" | grep -q "description"; then
  echo -e "${GREEN}✅ Tiene meta description${NC}"
else
  echo -e "${RED}❌ Falta meta description${NC}"
fi

if echo "$homepage_html" | grep -q "og:title"; then
  echo -e "${GREEN}✅ Tiene OpenGraph${NC}"
else
  echo -e "${YELLOW}⚠️  Falta OpenGraph${NC}"
fi

if echo "$homepage_html" | grep -q "application/ld+json"; then
  echo -e "${GREEN}✅ Tiene Schema.org${NC}"
else
  echo -e "${YELLOW}⚠️  Falta Schema.org${NC}"
fi

echo ""
echo "===================================="
echo -e "${GREEN}✅ Health check completo${NC}"
echo ""
echo "📌 Próximos pasos si hay errores:"
echo "   1. Verificar deployment en Vercel"
echo "   2. Submitir sitemap en Google Search Console"
echo "   3. Verificar DNS y SSL"
