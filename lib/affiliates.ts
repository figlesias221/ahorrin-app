/**
 * Registro de programas de afiliados.
 *
 * Cada programa tiene una `url` pública (sin tracking) y una `refUrl` opcional
 * que sale de una variable de entorno. Si la refUrl no está configurada, el link
 * cae a la URL pública: el artículo nunca queda roto ni con un link muerto
 * mientras se aprueba el alta en el programa.
 *
 * La env guarda la URL de referido COMPLETA, no solo el código: cada programa
 * usa un formato distinto (Wise es /invite/dic/{user}, IBKR otro) y armarlas a
 * mano se presta a errores silenciosos.
 *
 * Los links de referido son públicos por diseño (van en el href), por eso usan
 * el prefijo NEXT_PUBLIC_.
 */

export interface AffiliateProgram {
  /** Nombre visible del proveedor. */
  name: string;
  /** URL pública, sin tracking. Fallback si no hay refUrl configurada. */
  url: string;
  /** URL de referido completa, desde env. `undefined` hasta configurarla. */
  refUrl?: string;
}

// process.env se inlinea en build time: hay que leer cada clave literalmente,
// no se puede indexar dinámicamente.
export const AFFILIATE_PROGRAMS = {
  ibkr: {
    name: 'Interactive Brokers',
    url: 'https://www.interactivebrokers.com/en/general/education/open-account.php',
    refUrl: process.env.NEXT_PUBLIC_AFF_IBKR,
  },
  wise: {
    name: 'Wise',
    url: 'https://wise.com/',
    refUrl: process.env.NEXT_PUBLIC_AFF_WISE,
  },
  payoneer: {
    name: 'Payoneer',
    url: 'https://www.payoneer.com/',
    refUrl: process.env.NEXT_PUBLIC_AFF_PAYONEER,
  },
} satisfies Record<string, AffiliateProgram>;

export type AffiliateId = keyof typeof AFFILIATE_PROGRAMS;

/** URL final para un programa: con tracking si está configurada, pública si no. */
export function affiliateUrl(id: AffiliateId): string {
  const program = AFFILIATE_PROGRAMS[id];
  return program.refUrl || program.url;
}

/** True si el link va a generar comisión (hay refUrl configurada). */
export function isTracked(id: AffiliateId): boolean {
  return Boolean(AFFILIATE_PROGRAMS[id].refUrl);
}
