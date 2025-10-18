/**
 * Category Suggestions and Color Palette System
 * Provides predefined category templates and automatic color assignment
 */

// Carefully curated color palette - visually distinct and accessible
export const COLOR_PALETTE = [
  '#ff6b35', // Coral - Warm & Energetic
  '#4361ee', // Blue - Professional
  '#06ffa5', // Mint - Fresh
  '#f72585', // Hot Pink - Bold
  '#ffbe0b', // Golden - Bright
  '#3a86ff', // Bright Blue - Trust
  '#8338ec', // Purple - Creative
  '#fb5607', // Orange - Active
  '#00f5ff', // Cyan - Cool
  '#ff006e', // Magenta - Dynamic
  '#38b000', // Green - Natural
  '#ffb700', // Amber - Warm
  '#7209b7', // Deep Purple - Royal
  '#00b4d8', // Ocean Blue - Calm
  '#ff4365', // Watermelon - Fun
  '#2a9d8f', // Teal - Balance
  '#e63946', // Red - Alert
  '#fca311', // Yellow Orange - Sunny
  '#457b9d', // Steel Blue - Stable
  '#1d3557', // Navy - Serious
];

export interface CategorySuggestion {
  name: string;
  type: 'expense' | 'income';
  icon?: string;
  description?: string;
  subcategories?: CategorySuggestion[]; // Optional subcategories
}

// Common expense categories in Spanish with hierarchical structure
export const EXPENSE_SUGGESTIONS: CategorySuggestion[] = [
  {
    name: 'Alimentación',
    type: 'expense',
    description: 'Gastos relacionados con comida y bebida',
    subcategories: [
      { name: 'Supermercado', type: 'expense', description: 'Compras de alimentos y artículos del hogar' },
      { name: 'Restaurantes', type: 'expense', description: 'Comidas fuera de casa' },
      { name: 'Delivery', type: 'expense', description: 'Pedidos a domicilio' },
      { name: 'Cafetería', type: 'expense', description: 'Café, té, snacks' },
    ]
  },
  {
    name: 'Transporte',
    type: 'expense',
    description: 'Gastos de movilidad y transporte',
    subcategories: [
      { name: 'Combustible', type: 'expense', description: 'Gasolina y diésel' },
      { name: 'Transporte Público', type: 'expense', description: 'Ómnibus, STM' },
      { name: 'Uber/Taxi', type: 'expense', description: 'Servicios de taxi y ride-sharing' },
      { name: 'Estacionamiento', type: 'expense', description: 'Parquímetros y garajes' },
      { name: 'Mantenimiento', type: 'expense', description: 'Reparaciones y servicio' },
    ]
  },
  {
    name: 'Vivienda',
    type: 'expense',
    description: 'Gastos relacionados con el hogar',
    subcategories: [
      { name: 'Alquiler', type: 'expense', description: 'Renta mensual' },
      { name: 'Luz', type: 'expense', description: 'Factura de electricidad' },
      { name: 'Agua', type: 'expense', description: 'Factura de OSE' },
      { name: 'Gas', type: 'expense', description: 'Supergas o gas natural' },
      { name: 'Internet', type: 'expense', description: 'Servicio de internet' },
      { name: 'Teléfono', type: 'expense', description: 'Línea fija y móvil' },
      { name: 'Mantenimiento', type: 'expense', description: 'Reparaciones del hogar' },
    ]
  },
  {
    name: 'Salud',
    type: 'expense',
    description: 'Gastos médicos y de bienestar',
    subcategories: [
      { name: 'Farmacia', type: 'expense', description: 'Medicamentos' },
      { name: 'Consultas', type: 'expense', description: 'Visitas médicas' },
      { name: 'Análisis', type: 'expense', description: 'Estudios y laboratorio' },
      { name: 'Odontología', type: 'expense', description: 'Dentista' },
      { name: 'Óptica', type: 'expense', description: 'Lentes y exámenes visuales' },
    ]
  },
  {
    name: 'Entretenimiento',
    type: 'expense',
    description: 'Ocio y diversión',
    subcategories: [
      { name: 'Streaming', type: 'expense', description: 'Netflix, Spotify, etc.' },
      { name: 'Cine', type: 'expense', description: 'Entradas de cine' },
      { name: 'Eventos', type: 'expense', description: 'Conciertos, teatro, deportes' },
      { name: 'Hobbies', type: 'expense', description: 'Pasatiempos y aficiones' },
      { name: 'Libros', type: 'expense', description: 'Libros y revistas' },
    ]
  },
  {
    name: 'Educación',
    type: 'expense',
    description: 'Gastos educativos',
    subcategories: [
      { name: 'Cursos', type: 'expense', description: 'Formación y capacitación' },
      { name: 'Útiles', type: 'expense', description: 'Material escolar' },
      { name: 'Libros', type: 'expense', description: 'Textos educativos' },
      { name: 'Online', type: 'expense', description: 'Udemy, Coursera, etc.' },
    ]
  },
  { name: 'Ropa', type: 'expense', description: 'Vestimenta y calzado' },
  { name: 'Tecnología', type: 'expense', description: 'Dispositivos, software, gadgets' },
  { name: 'Gimnasio', type: 'expense', description: 'Membresías deportivas y fitness' },
  { name: 'Mascotas', type: 'expense', description: 'Alimento, veterinario, accesorios' },
  { name: 'Seguros', type: 'expense', description: 'Seguros de salud, auto, vida, hogar' },
  { name: 'Viajes', type: 'expense', description: 'Vacaciones, pasajes, alojamiento' },
  { name: 'Impuestos', type: 'expense', description: 'Contribuciones e impuestos' },
  { name: 'Regalos', type: 'expense', description: 'Obsequios y celebraciones' },
  { name: 'Belleza', type: 'expense', description: 'Peluquería, cosméticos, cuidado personal' },
  { name: 'Otros Gastos', type: 'expense', description: 'Gastos misceláneos' },
];

// Common income categories in Spanish with hierarchical structure
export const INCOME_SUGGESTIONS: CategorySuggestion[] = [
  {
    name: 'Salario',
    type: 'income',
    description: 'Ingresos laborales',
    subcategories: [
      { name: 'Sueldo Base', type: 'income', description: 'Salario mensual fijo' },
      { name: 'Aguinaldo', type: 'income', description: 'Bonificación anual' },
      { name: 'Bonos', type: 'income', description: 'Bonificaciones y premios' },
      { name: 'Horas Extra', type: 'income', description: 'Pago por horas adicionales' },
    ]
  },
  {
    name: 'Trabajo Independiente',
    type: 'income',
    description: 'Ingresos por cuenta propia',
    subcategories: [
      { name: 'Freelance', type: 'income', description: 'Proyectos independientes' },
      { name: 'Consultoría', type: 'income', description: 'Servicios de consultoría' },
      { name: 'Ventas', type: 'income', description: 'Ventas de productos o servicios' },
    ]
  },
  {
    name: 'Inversiones',
    type: 'income',
    description: 'Rendimientos financieros',
    subcategories: [
      { name: 'Dividendos', type: 'income', description: 'Ganancias de acciones' },
      { name: 'Intereses', type: 'income', description: 'Intereses bancarios' },
      { name: 'Criptomonedas', type: 'income', description: 'Ganancias crypto' },
    ]
  },
  { name: 'Alquiler', type: 'income', description: 'Ingresos por propiedades en alquiler' },
  { name: 'Reembolsos', type: 'income', description: 'Devoluciones y reintegros' },
  { name: 'Otros Ingresos', type: 'income', description: 'Ingresos diversos' },
];

/**
 * Get the next available color from the palette
 * If all colors are used, it will cycle back to the start
 * @param usedColors - Array of colors already in use
 * @returns Next available color from the palette
 */
export function getNextAvailableColor(usedColors: string[]): string {
  // Normalize colors to lowercase for comparison
  const normalizedUsed = usedColors.map(c => c.toLowerCase());

  // Find first unused color
  const availableColor = COLOR_PALETTE.find(
    color => !normalizedUsed.includes(color.toLowerCase())
  );

  // If all colors are used, use round-robin based on count
  if (!availableColor) {
    const index = usedColors.length % COLOR_PALETTE.length;
    return COLOR_PALETTE[index];
  }

  return availableColor;
}

/**
 * Get category suggestions based on type
 * @param type - 'expense' or 'income'
 * @returns Array of category suggestions
 */
export function getCategorySuggestions(type: 'expense' | 'income'): CategorySuggestion[] {
  return type === 'expense' ? EXPENSE_SUGGESTIONS : INCOME_SUGGESTIONS;
}

/**
 * Get all category suggestions
 * @returns Object with expense and income suggestions
 */
export function getAllCategorySuggestions() {
  return {
    expense: EXPENSE_SUGGESTIONS,
    income: INCOME_SUGGESTIONS,
  };
}

/**
 * Flatten category suggestions to include both parents and subcategories
 * Useful for displaying all options in a flat list
 * @param suggestions - Array of category suggestions (may include subcategories)
 * @returns Flattened array with all categories
 */
export function flattenCategorySuggestions(suggestions: CategorySuggestion[]): CategorySuggestion[] {
  const flattened: CategorySuggestion[] = [];

  suggestions.forEach(category => {
    // Add parent category
    flattened.push({
      name: category.name,
      type: category.type,
      icon: category.icon,
      description: category.description,
    });

    // Add subcategories if they exist
    if (category.subcategories) {
      flattened.push(...category.subcategories);
    }
  });

  return flattened;
}
