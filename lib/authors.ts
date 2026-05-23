export interface Author {
  slug: string;
  name: string;
  displayName: string;
  role: string;
  bio: string;
  longBio: string;
  credentials: string[];
  avatar: string;
  email?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  url: string;
}

const AUTHORS: Record<string, Author> = {
  'federico': {
    slug: 'federico',
    name: 'Federico',
    displayName: 'Federico',
    role: 'Fundador y editor de Ahorrin',
    bio: 'Desarrollador full-stack uruguayo. Fundador de Ahorrin. Escribe sobre finanzas personales, impuestos uruguayos e inversiones desde la perspectiva de quien convive con el sistema todos los días.',
    longBio:
      'Federico es desarrollador full-stack con más de 10 años trabajando en startups SaaS, basado en Montevideo. Fundó Ahorrin en 2025 con una idea simple: hacer una herramienta de finanzas personales que entendiera cómo funciona realmente el sistema uruguayo — IRPF, BPS, FONASA, UI, doble moneda — sin pedirte tus claves bancarias y sin venderte productos. Investiga y escribe el contenido del blog y la base de cálculo de las herramientas. Cuando una guía toca temas técnicos (IRPF, FONASA, IRAE, monotributo), contrasta los datos contra la página oficial de DGI, BPS, BCU y MEF antes de publicarla.',
    credentials: [
      'Más de 10 años de experiencia en desarrollo de productos SaaS',
      'Reside en Montevideo, Uruguay desde hace más de 30 años',
      'Estudió Ingeniería en Sistemas',
      'Convive con IRPF, BPS, FONASA y monotributo en su propio recibo de sueldo cada mes',
    ],
    avatar: '/logo.svg',
    email: 'hola@ahorrin.app',
    url: 'https://www.ahorrin.app/autor/federico',
  },
  'equipo-ahorrin': {
    slug: 'equipo-ahorrin',
    name: 'Equipo Ahorrin',
    displayName: 'Equipo Ahorrin',
    role: 'Equipo editorial',
    bio: 'El equipo editorial de Ahorrin investiga y escribe contenido sobre finanzas personales en Uruguay. Liderado por Federico, fundador de Ahorrin.',
    longBio:
      'El equipo editorial de Ahorrin investiga, escribe y actualiza el contenido del blog, el glosario y las herramientas. El equipo está liderado por Federico, desarrollador full-stack y fundador de Ahorrin. Cada artículo se contrasta contra fuentes oficiales (DGI, BPS, BCU, MEF) antes de publicarse, y se revisa al menos cada 90 días para mantener la información actualizada con la normativa vigente.',
    credentials: [
      'Equipo editorial basado en Montevideo, Uruguay',
      'Fuentes oficiales contrastadas: DGI, BPS, BCU, MEF',
      'Revisión periódica de contenido cada 90 días',
      'Sin patrocinadores que influyan sobre las recomendaciones',
    ],
    avatar: '/logo.svg',
    email: 'hola@ahorrin.app',
    url: 'https://www.ahorrin.app/autor/equipo-ahorrin',
  },
};

export function authorSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function getAuthor(slug: string): Author | null {
  return AUTHORS[slug] ?? null;
}

export function getAuthorByName(name: string): Author {
  const slug = authorSlug(name);
  return AUTHORS[slug] ?? AUTHORS['equipo-ahorrin'];
}

export function getAllAuthorSlugs(): string[] {
  return Object.keys(AUTHORS);
}

export function getAllAuthors(): Author[] {
  return Object.values(AUTHORS);
}
