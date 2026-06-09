import { categoryToSlug } from './mdx';

export interface CategoryProfile {
  name: string;
  slug: string;
  description: string;
  intro: string;
}

const PROFILES: Record<string, Omit<CategoryProfile, 'name' | 'slug'>> = {
  impuestos: {
    description:
      'Guías sobre impuestos en Uruguay: IRPF, IRAE, IVA, monotributo, calendario de vencimientos y cómo declarar.',
    intro:
      'Acá está todo lo que necesitás saber sobre impuestos uruguayos: tramos del IRPF, deducciones legales, cómo distinguir IRPF de IRAE, qué se grava con IVA, cuándo conviene monotributo, calendario de vencimientos DGI y guías paso a paso para presentar declaraciones jurídicas. Cada artículo se contrasta contra DGI, MEF y BPS antes de publicarse.',
  },
  'salarios-y-beneficios': {
    description:
      'Cómo se compone tu sueldo en Uruguay: liquidación, aguinaldo, salario vacacional, FONASA y descuentos.',
    intro:
      'Tu recibo de sueldo en detalle: qué es nominal vs líquido, cómo se calcula el aguinaldo y el salario vacacional, qué te descuentan BPS, FONASA e IRPF y por qué algunos meses te queda menos plata aunque "ganes lo mismo". Si nunca terminás de entender la liquidación que te manda RRHH, este es el lugar.',
  },
  inversiones: {
    description:
      'Cómo invertir desde Uruguay: brokers, ETFs, plazos fijos, UI, dólares, inmuebles y letras de regulación monetaria.',
    intro:
      'Inversión desde Uruguay sin marketing: qué bróker conviene (incluido IBKR), cómo abrir cuenta paso a paso, qué ETFs y fondos son accesibles, cuándo conviene UI vs dólares vs pesos, plazos fijos comparados, letras de regulación monetaria del BCU y rentabilidad real (con números) de comprar inmuebles para alquilar.',
  },
  'jubilacion-y-ahorro': {
    description:
      'Jubilación en Uruguay: AFAP, sistema mixto BPS, comisiones, rendimientos y cómo elegir.',
    intro:
      'Sobre tu jubilación futura, sin mística: cómo funciona el sistema mixto uruguayo (BPS + AFAP), qué AFAP rinde más históricamente, cuánto cobran de comisión, cómo cambiar de AFAP y qué pasa con tu plata si cambia el régimen. Datos del BCU y BPS, no proyecciones marketineras.',
  },
  'educacion-financiera': {
    description:
      'Conceptos financieros explicados para Uruguay: interés compuesto, CFT, inflación, instrumentos y términos.',
    intro:
      'Conceptos financieros explicados con ejemplos uruguayos: qué es realmente el CFT que aparece en los préstamos, cómo afecta la inflación a tu sueldo y a tus ahorros, qué significan UI, BPC, UR y por qué importan, y por qué el interés compuesto cambia las decisiones de ahorro a 5 y 10 años.',
  },
  'bancos-y-tarjetas': {
    description:
      'Bancos uruguayos comparados: BBVA, Itaú, Scotia, BROU, Santander, Heritage, prepagas y tarjetas.',
    intro:
      'Comparativas honestas de los bancos y tarjetas en Uruguay: qué banco conviene según uso, cómo se diferencian las tarjetas de crédito en CFT real (no la "tasa" que muestran), cashback efectivo de OCA Blue, Prex, MiDinero y otras prepagas, y cuándo conviene cambiar de banco.',
  },
  'vivienda-y-creditos': {
    description:
      'Comprar y alquilar vivienda en Uruguay: hipotecarios, alquileres, gastos comunes y costos reales.',
    intro:
      'Acceso a la vivienda en Uruguay: cómo funcionan los créditos hipotecarios (BHU, banca privada), cuánta cuota inicial necesitás, qué pasa con la cuota cuando sube la UI, qué gastos comunes y de mantenimiento sumar al alquiler o a la compra, y cuándo conviene alquilar versus comprar con los precios actuales.',
  },
  emprendimiento: {
    description:
      'Emprender en Uruguay: monotributo, unipersonal, SAS, IRAE, contabilidad y costos reales.',
    intro:
      'Si estás pensando en facturar por tu cuenta, esta es la categoría: cuándo conviene monotributo, cuándo SAS, cuándo unipersonal, qué impuestos vas a pagar (IRAE vs IRPF), cuánto cuesta un contador, cómo facturar al exterior si trabajás como freelancer IT y los pasos para crear una SAS desde cero.',
  },
  'tecnologia-y-producto': {
    description:
      'Detrás de Ahorrin: decisiones de producto, ingeniería de parsers bancarios, normalización de comercios y transparencia técnica.',
    intro:
      'Cómo construimos Ahorrin por dentro: por qué tomamos las decisiones de producto que tomamos, cómo procesamos extractos de los bancos uruguayos, cómo agrupamos comercios con nombres distintos, qué problemas técnicos resolvemos en una economía bimonetaria. Posts honestos sobre el costado de ingeniería del producto, para quien le interese ver el motor por dentro.',
  },
};

export function getCategoryProfile(slug: string): CategoryProfile | null {
  const profile = PROFILES[slug];
  if (!profile) return null;
  // Find the canonical name from any matching category
  const name = Object.keys(PROFILES).find((k) => k === slug);
  return {
    name: name ?? slug,
    slug,
    ...profile,
  };
}

export function getCategoryProfileByName(name: string): CategoryProfile | null {
  const slug = categoryToSlug(name);
  const profile = PROFILES[slug];
  if (!profile) return null;
  return { name, slug, ...profile };
}
