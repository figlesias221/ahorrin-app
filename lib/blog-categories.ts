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
  'impuestos-y-tramites': {
    description:
      'Trámites tributarios en Uruguay: declaraciones juradas, devoluciones, formularios, FONASA y trámites BPS.',
    intro:
      'Trámites tributarios concretos: cómo presentar la declaración jurada de IRPF online, cómo pedir devolución de IRPF y FONASA, qué formularios usás cuando, qué papelitos te pide BPS para registrar cargas familiares. Sin verseo: pasos reales, capturas, plazos.',
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
  'inversion-y-ahorro': {
    description:
      'Inversión y ahorro para uruguayos: instrumentos accesibles, estrategias defensivas y errores comunes.',
    intro:
      'Cómo construir un colchón de ahorro y empezar a invertir desde Uruguay sin perder plata por desconocimiento. Fondo de emergencia, plazo fijo en UI, dólares, ETFs, brokers internacionales y errores típicos que hace la mayoría cuando pone los primeros pesos en algo que no sea la caja de ahorro.',
  },
  'ahorro-y-presupuesto': {
    description:
      'Presupuesto mensual y ahorro en Uruguay: regla 50/30/20, gastos hormiga, planificación con doble moneda.',
    intro:
      'Cómo armar un presupuesto que de verdad uses: la regla 50/30/20 adaptada a la realidad uruguaya, gastos hormiga que se vuelven miles de pesos al año, qué hacer cuando ganás en pesos pero pensás en dólares, y cómo planificar a 6 y 12 meses sin que la inflación te deje sin margen.',
  },
  'jubilacion-y-ahorro': {
    description:
      'Jubilación en Uruguay: AFAP, sistema mixto BPS, comisiones, rendimientos y cómo elegir.',
    intro:
      'Sobre tu jubilación futura, sin mística: cómo funciona el sistema mixto uruguayo (BPS + AFAP), qué AFAP rinde más históricamente, cuánto cobran de comisión, cómo cambiar de AFAP y qué pasa con tu plata si cambia el régimen. Datos del BCU y BPS, no proyecciones marketineras.',
  },
  'finanzas-personales': {
    description:
      'Finanzas personales en Uruguay: organización, deuda, bancos, herramientas y decisiones cotidianas.',
    intro:
      'Lo que la educación formal en Uruguay no te enseña sobre tu plata: cómo organizar tus finanzas, cuándo pedir un préstamo y cuándo no, cómo elegir banco, qué herramientas usar y cómo no caer en las trampas más comunes (cuotas eternas en tarjeta, préstamos con CFT alto, gastos hormiga).',
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
  'tarjetas-de-credito': {
    description:
      'Tarjetas de crédito en Uruguay: comparativas, cashback, CFT real, prepagas y trampas a evitar.',
    intro:
      'Las tarjetas de crédito en Uruguay tienen las tasas más altas de la región y los marketing más confusos. Acá tenés comparativas con CFT real (no la nominal), cuáles devuelven cashback que vale la pena, cuándo una prepaga te conviene más que una tarjeta tradicional y la trampa de las cuotas con financiación.',
  },
  'creditos-y-prestamos': {
    description:
      'Préstamos personales e hipotecarios en Uruguay: tasas reales, CFT, comparativas y cuándo conviene.',
    intro:
      'Antes de firmar un préstamo en Uruguay, necesitás entender el CFT real (no la tasa nominal que te tiran) y comparar entre bancos y financieras. Acá tenés tasas vigentes, cuándo conviene un préstamo personal, cuándo un hipotecario en UI o UR, y qué cláusulas leer antes de aceptar.',
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
