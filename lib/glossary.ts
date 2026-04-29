export interface GlossaryFAQ {
  q: string;
  a: string;
}

export interface GlossaryTerm {
  slug: string;
  term: string;
  abbr?: string;
  definition: string;
  example?: string;
  related?: { label: string; href: string }[];

  // Optional rich content. If `intro` is present, the term gets a standalone page at /glosario/{slug}.
  metaDescription?: string;
  keywords?: string[];
  intro?: string;
  howCalculated?: string;
  commonMistakes?: string[];
  faq?: GlossaryFAQ[];
  relatedPostSlugs?: string[];
  relatedTool?: { label: string; href: string };
  lastReviewed?: string;
}

export function slugifyTerm(term: string): string {
  return term
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const RAW_TERMS: Omit<GlossaryTerm, 'slug'>[] = [
  {
    term: 'AFAP',
    abbr: 'Administradora de Fondos de Ahorro Previsional',
    definition:
      'Empresas que administran el ahorro jubilatorio individual del régimen mixto uruguayo. En Uruguay operan República AFAP (estatal), Sura AFAP, Unión Capital AFAP e Integración AFAP. Todo trabajador en relación de dependencia que supere cierto umbral de ingresos aporta obligatoriamente a una AFAP.',
    example:
      'Si ganás más de aproximadamente $80.000 nominales, parte de tu aporte BPS va al BPS solidario y otra parte a una AFAP que vos elegís.',
    related: [
      { label: 'BPS', href: 'bps' },
      { label: 'Jubilación', href: 'jubilacion' },
    ],
    metaDescription:
      'Qué es una AFAP, cómo funciona el sistema mixto uruguayo, las cuatro AFAPs (República, Sura, Unión Capital, Integración), comisiones y rendimiento.',
    keywords: [
      'que es afap',
      'afap uruguay',
      'comisiones afap',
      'rendimiento afap',
      'republica afap',
      'cambiar afap',
    ],
    intro:
      'AFAP significa Administradora de Fondos de Ahorro Previsional. Las AFAPs son las empresas que administran tu cuenta individual de ahorro jubilatorio dentro del sistema mixto uruguayo. Fueron creadas por la Ley 16.713 de 1995, que estableció el sistema previsional actual: parte solidario (BPS) y parte de capitalización individual (AFAP).\n\nEn Uruguay hay cuatro AFAPs operativas: República AFAP (la única estatal, propiedad de BROU, BPS y la Bolsa de Valores), AFAP Sura, Unión Capital AFAP e Integración AFAP. Todas hacen lo mismo (administrar tu plata de jubilación), pero cobran comisiones distintas y tienen historiales de rendimiento distintos. Por eso elegir bien tu AFAP, y revisar la elección cada algunos años, importa.\n\nDel 15% que aportás a BPS por mes, una parte va al régimen solidario (financia las jubilaciones actuales) y otra parte va a tu cuenta individual en la AFAP que elegiste. La proporción depende de tu nivel de ingresos: para sueldos bajos, todo va al solidario; para sueldos medios y altos, hasta 7,5% de tu sueldo nominal puede acumularse en tu cuenta personal de AFAP.\n\nEsa plata acumulada en la AFAP no se queda quieta: se invierte (en bonos uruguayos, bonos del exterior, acciones, depósitos) y va generando rendimiento. Cuando te jubilás, ese capital acumulado más sus intereses se convierte en una renta vitalicia que se suma a la jubilación que paga el BPS.',
    howCalculated:
      'Tu aporte a AFAP no se calcula aparte: es una porción del 15% que aportás a BPS sobre el salario nominal. La distribución entre BPS solidario y AFAP depende de tu ingreso medido en BPC (Base de Prestaciones y Contribuciones, ≈ $6.500 en 2026).\n\nReglas simplificadas: si tu sueldo es bajo (no supera cierto umbral), todo el 15% va al BPS solidario. Si supera el umbral, una parte va al solidario hasta cierto tope, y lo que aportás por encima de ese tope va a tu cuenta individual en la AFAP. En la práctica, para un sueldo de $80.000 nominal, alrededor del 50% del aporte (≈ $6.000) puede ir a tu cuenta de AFAP.\n\nLa AFAP cobra una comisión sobre cada aporte que entra a tu cuenta. En 2025-2026, las comisiones aproximadas son: República AFAP 4,10% (la más baja del sistema), Unión Capital ~5,90%, Sura ~5,90%, Integración ~5,80%. Si aportás $6.000 mensuales y la comisión es 4,10%, entran $5.754 efectivos a tu cuenta; con comisión 5,90% entran $5.646. La diferencia parece chica pero sobre 30 años de aportes son varios miles de dólares menos en tu jubilación.\n\nEl rendimiento del fondo depende de cómo invierte la AFAP. La rentabilidad neta agregada de los últimos años promedia entre 2% y 3% real anual (por encima de la inflación uruguaya, medido en Unidades Reajustables). República AFAP suele liderar el ranking de rentabilidad reciente.',
    commonMistakes: [
      'No saber en qué AFAP estás. Si nunca elegiste, el sistema te asignó una al azar. Podés consultar y cambiar gratis en bps.gub.uy.',
      'Quedarse en una AFAP cara solo por inercia. La diferencia entre 4,10% y 5,90% de comisión, sobre 30 años de aportes, son decenas de miles de dólares menos.',
      'Ignorar el subfondo. Las AFAPs ofrecen subfondos con distintas estrategias (más conservador, más agresivo). Si te quedan muchos años para jubilarte, un subfondo más agresivo puede rendir más.',
      'Pensar que la AFAP es una "comisión que se pierde". No: es plata que se acumula a tu nombre, se invierte, y vuelve a vos como renta vitalicia cuando te jubilás. Si sumás bien, es un activo real.',
    ],
    faq: [
      {
        q: '¿Cuál es la mejor AFAP en Uruguay?',
        a: 'En el ranking de rentabilidad neta agregada y comisiones, República AFAP suele aparecer primera por combinar la comisión más baja (4,10%) con un rendimiento competitivo. Sin embargo, conviene revisar el ranking actualizado cada año en el Banco Central del Uruguay antes de decidir.',
      },
      {
        q: '¿Cómo cambio de AFAP?',
        a: 'Podés cambiar dos veces al año: del 1 de abril al 30 de junio y del 1 de octubre al 31 de diciembre. El trámite se hace en bps.gub.uy con tu usuario gub.uy o presencialmente en una sucursal. Es gratis.',
      },
      {
        q: '¿Qué pasa con mi plata si la AFAP quiebra?',
        a: 'Tu plata no es de la AFAP: es tuya y está en una cuenta individual a tu nombre. Si la AFAP quiebra, los activos se transfieren a otra AFAP y tu cuenta sigue intacta. El sistema está supervisado por el Banco Central del Uruguay.',
      },
      {
        q: '¿Puedo retirar plata de mi AFAP antes de jubilarme?',
        a: 'No. La plata de la AFAP solo se accede al jubilarse. Hay excepciones muy puntuales (invalidez total y permanente, fallecimiento del titular —en cuyo caso pasa a herederos—). No es un fondo líquido al que puedas acceder cuando quieras.',
      },
    ],
    relatedPostSlugs: [
      'afap-uruguay-2025-cual-elegir-rendimiento-comisiones',
      'salario-liquido-uruguay-2025-cuanto-te-queda-realmente',
    ],
    lastReviewed: '2026-04-29',
  },
  {
    term: 'Aguinaldo',
    abbr: 'Sueldo Anual Complementario (SAC)',
    definition:
      'Pago semestral obligatorio en Uruguay equivalente a la doceava parte del total de remuneraciones cobradas en el período. Se paga en junio (por enero-junio) y diciembre (por julio-diciembre).',
    example:
      'Si ganaste $60.000 mensuales durante todo el primer semestre, tu aguinaldo de junio será aproximadamente $30.000 (12 sueldos / 24 = medio sueldo por semestre, antes de descuentos).',
    metaDescription:
      'Qué es el aguinaldo en Uruguay, cuándo se cobra (junio y diciembre), cómo se calcula con un ejemplo real y qué descuentos se le aplican.',
    keywords: [
      'aguinaldo uruguay',
      'cuando se cobra aguinaldo',
      'como calcular aguinaldo',
      'aguinaldo junio',
      'aguinaldo diciembre',
      'descuentos aguinaldo',
    ],
    intro:
      'El aguinaldo, también llamado Sueldo Anual Complementario (SAC), es un pago obligatorio que reciben todos los trabajadores en relación de dependencia en Uruguay. Está regulado por la Ley 12.840 de 1960 y equivale a la doceava parte (1/12) del total de remuneraciones cobradas en el semestre.\n\nSe paga en dos partes: la primera tiene como tope el 30 de junio (cubre lo cobrado entre el 1 de diciembre del año anterior y el 31 de mayo del año en curso), y la segunda tiene como tope el 20 de diciembre (cubre del 1 de junio al 30 de noviembre). En el sector público suele cobrarse unos días antes.\n\nEl aguinaldo no es una "gratificación" del empleador: es un derecho laboral inalienable. Aunque trabajes solo unas semanas, te corresponde la parte proporcional. Y aunque renuncies o te despidan, el empleador debe liquidarte la parte del semestre que ya trabajaste.',
    howCalculated:
      'La fórmula es simple: aguinaldo = (sumatoria de remuneraciones del semestre) / 12.\n\nEntra en la cuenta todo lo que cobraste en concepto de salario nominal, horas extras y comisiones del semestre. No entran los tickets de alimentación, partidas en especie ni viáticos no remunerativos.\n\nEjemplo: ganás $60.000 nominales por mes y trabajaste los 6 meses completos. El total del semestre es $360.000. El aguinaldo nominal es $360.000 / 12 = $30.000.\n\nSobre ese aguinaldo nominal te descuentan los mismos aportes que sobre el sueldo: BPS 15% ($4.500), FONASA según tu tramo (típicamente entre 0% y 8%), FRL 0,1% ($30) e IRPF si corresponde. El IRPF en el aguinaldo se calcula con tratamiento especial: durante el año te retienen un porcentaje extra para cubrirlo, y en junio o diciembre se ajusta según tu tasa marginal del año.\n\nPara un aguinaldo nominal de $30.000 con descuentos típicos de un trabajador soltero sin hijos, te quedan aproximadamente $22.000-24.000 líquidos.',
    commonMistakes: [
      'Pensar que el aguinaldo es "plata extra" del empleador. No: es plata tuya, generada con tu trabajo, que se acumula durante el semestre y se paga concentrada.',
      'Esperar el aguinaldo entero "neto". Tiene los mismos descuentos que el sueldo (BPS, FONASA, FRL, IRPF), por lo que el líquido siempre es entre 70% y 80% del nominal.',
      'No reclamar el proporcional cuando dejaste un trabajo a mitad del semestre. Aunque hayas trabajado solo 2 meses, esos 2 meses generan aguinaldo proporcional y el empleador debe liquidarlo en el recibo final.',
      'Asumir que los tickets alimentación y otras partidas en especie suman al aguinaldo. No suman: solo entra la remuneración monetaria.',
    ],
    faq: [
      {
        q: '¿Cuándo se cobra el aguinaldo en Uruguay?',
        a: 'En el sector privado, el aguinaldo de junio se paga hasta el 30 de junio y el de diciembre hasta el 20 de diciembre. El sector público suele pagarlo unos días antes (generalmente alrededor del 18 de junio y 18 de diciembre).',
      },
      {
        q: '¿Cómo calcular el aguinaldo si no trabajé el semestre completo?',
        a: 'Sumás lo que cobraste por los meses efectivamente trabajados y lo dividís entre 12. Si trabajaste 3 meses y cobraste $50.000 mensuales, el aguinaldo proporcional es $150.000 / 12 = $12.500 nominales.',
      },
      {
        q: '¿Al aguinaldo le descuentan IRPF?',
        a: 'Sí, si tus ingresos están dentro de los tramos imponibles de IRPF. La forma de calcular el IRPF sobre el aguinaldo es especial: durante el año te van reteniendo un porcentaje adicional, y en junio o diciembre se ajusta para que la retención del aguinaldo coincida con tu tasa marginal del año.',
      },
      {
        q: '¿Si soy monotributista o unipersonal, cobro aguinaldo?',
        a: 'No. El aguinaldo es un derecho de los trabajadores en relación de dependencia. Si facturás por monotributo o unipersonal, podés "auto-asignarte" un aguinaldo separando una parte de tu facturación, pero no es un derecho legal: es una práctica de buena administración personal.',
      },
    ],
    relatedPostSlugs: [
      'aguinaldo-uruguay-2025-cuando-se-cobra-como-calcularlo',
      'salario-liquido-uruguay-2025-cuanto-te-queda-realmente',
    ],
    relatedTool: {
      label: 'Calculadora de Salario Líquido',
      href: '/herramientas/calculadora-salario-liquido',
    },
    lastReviewed: '2026-04-29',
  },
  {
    term: 'BCU',
    abbr: 'Banco Central del Uruguay',
    definition:
      'Autoridad monetaria del país. Regula el sistema financiero, emite moneda, fija tasas de referencia y publica indicadores económicos como inflación, tipo de cambio y reservas internacionales.',
  },
  {
    term: 'BHU',
    abbr: 'Banco Hipotecario del Uruguay',
    definition:
      'Banco estatal especializado en créditos hipotecarios para vivienda. Suele ofrecer mejores condiciones que la banca privada para perfiles de ingresos medios y bajos, pero con procesos más lentos.',
  },
  {
    term: 'BPC',
    abbr: 'Base de Prestaciones y Contribuciones',
    definition:
      'Unidad de cuenta uruguaya que se ajusta anualmente y se usa como referencia para múltiples prestaciones, multas, montos mínimos no imponibles y franjas tributarias. La fija el Poder Ejecutivo.',
    example:
      'Las franjas del IRPF están expresadas en BPC. Si la BPC vale $6.500, una franja de "10 BPC" equivale a $65.000.',
  },
  {
    term: 'BPS',
    abbr: 'Banco de Previsión Social',
    definition:
      'Organismo estatal encargado de la seguridad social en Uruguay. Administra jubilaciones, pensiones, asignaciones familiares y los aportes obligatorios al sistema previsional. Los empleados aportan 15% de su sueldo nominal.',
    example:
      'En tu recibo de sueldo, "Aporte Jubilatorio 15%" es BPS. De un nominal de $50.000, $7.500 van a BPS.',
    related: [
      { label: 'AFAP', href: 'afap' },
      { label: 'FONASA', href: 'fonasa' },
    ],
    metaDescription:
      'Qué es el BPS, qué administra y cuánto se aporta. Aporte jubilatorio del 15%, FONASA, FRL y cómo se distribuye el aporte entre BPS solidario y AFAP.',
    keywords: [
      'que es bps',
      'aporte bps uruguay',
      'aporte jubilatorio 15',
      'bps fonasa',
      'banco prevision social',
    ],
    intro:
      'El BPS es el Banco de Previsión Social, el organismo estatal que administra el sistema de seguridad social en Uruguay. No es un banco en el sentido tradicional: no recibe depósitos ni otorga créditos. Es la institución que recauda los aportes previsionales de los trabajadores y empleadores, y a cambio paga jubilaciones, pensiones, asignaciones familiares y subsidios por enfermedad o desempleo.\n\nTodo trabajador en relación de dependencia en Uruguay aporta a BPS por ley. El aporte personal jubilatorio es del 15% del salario nominal y se descuenta automáticamente del recibo de sueldo. A eso se suman FONASA (entre 3% y 8% según ingresos y composición familiar) y FRL (Fondo de Reconversión Laboral, 0,1%).\n\nEl sistema uruguayo es mixto: el aporte del 15% se reparte entre el BPS (régimen solidario, donde los trabajadores activos pagan las jubilaciones de los pasivos) y una AFAP (cuenta individual de capitalización, donde tu plata se invierte y se acumula para tu propia jubilación). El umbral exacto de cuánto va a cada uno depende de tu nivel de ingresos.',
    howCalculated:
      'El cálculo del aporte BPS es directo: 15% sobre el salario nominal mensual.\n\nEjemplo: salario nominal de $80.000. Aporte BPS = $80.000 × 15% = $12.000 mensuales. Esos $12.000 se descuentan en el recibo y figuran como "Aporte Jubilatorio 15%".\n\nDel total que aporta una persona con ingresos medios, una parte va al BPS solidario (financia las jubilaciones actuales) y otra parte va a la AFAP que el trabajador eligió (se acumula en una cuenta individual a su nombre, invertida por la AFAP). Para ingresos bajos, todo va al BPS solidario; para ingresos altos, una parte mayor va a la AFAP.\n\nEl aporte patronal jubilatorio adicional lo hace el empleador (7,5%) y no se descuenta del recibo del trabajador.\n\nLos monotributistas y unipersonales aportan distinto: tienen una cuota fija mensual (en el caso del monotributo) o aportan según su categoría sobre los honorarios facturados (en el caso de la unipersonal).',
    commonMistakes: [
      'Creer que el aporte BPS "se pierde". No se pierde: se acumula como años de aportes, lo cual te da derecho a jubilarte. Una parte va a tu cuenta individual en la AFAP.',
      'Pensar que se puede recuperar antes de jubilarse. No se puede retirar el aporte BPS antes de cumplir las condiciones jubilatorias (salvo casos muy específicos).',
      'Confundir el aporte BPS (15% personal) con la cuota mutual de FONASA. Son dos descuentos distintos: BPS financia jubilación, FONASA financia salud.',
      'Asumir que si nunca aportaste no tenés cobertura de salud. La cobertura FONASA depende del aporte vigente. Si dejás de aportar, perdés la cobertura del sistema.',
    ],
    faq: [
      {
        q: '¿Cuánto se aporta al BPS en Uruguay?',
        a: 'El aporte personal jubilatorio es del 15% del salario nominal. A eso se suma el aporte personal a FONASA (3% a 8% según ingresos y cargas familiares) y el FRL (0,1%). Total descuentos vinculados a BPS: entre 18,1% y 23,1% del salario nominal.',
      },
      {
        q: '¿Puedo elegir mi AFAP?',
        a: 'Sí. Cuando empezás a aportar, el sistema te asigna una AFAP automáticamente, pero podés cambiarla en cualquier momento. Las cuatro AFAP son República (estatal), Sura, Itaú e Integración (privadas). Conviene comparar comisiones y rendimiento histórico.',
      },
      {
        q: '¿Qué pasa con mis aportes si me voy a vivir al exterior?',
        a: 'Tus años de aporte quedan registrados. Uruguay tiene convenios bilaterales con varios países (España, Italia, Brasil, etc.) para sumar años de aporte entre sistemas. Si te jubilás afuera, podés computar tus años uruguayos.',
      },
      {
        q: '¿El monotributo aporta a BPS?',
        a: 'Sí. El monotributo es justamente un régimen del BPS: cuota fija mensual que cubre aportes jubilatorios y FONASA. Los monotributistas también acumulan años de aporte y tienen cobertura de salud, aunque la base de cálculo de su jubilación futura es distinta.',
      },
    ],
    relatedPostSlugs: [
      'salario-liquido-uruguay-2025-cuanto-te-queda-realmente',
      'monotributo-uruguay-2025-guia-completa-requisitos-costos',
      'afap-uruguay-2025-cual-elegir-rendimiento-comisiones',
    ],
    relatedTool: {
      label: 'Calculadora de Salario Líquido',
      href: '/herramientas/calculadora-salario-liquido',
    },
    lastReviewed: '2026-04-29',
  },
  {
    term: 'BROU',
    abbr: 'Banco República Oriental del Uruguay',
    definition:
      'Banco estatal y el más grande del país. Tiene la red más extensa de sucursales y cajeros, y es donde se acreditan la mayoría de sueldos públicos y jubilaciones.',
    related: [{ label: 'Bancos en Uruguay', href: '/bancos-uruguay' }],
  },
  {
    term: 'CFT',
    abbr: 'Costo Financiero Total',
    definition:
      'Indicador que muestra el costo verdadero de un préstamo o crédito, incluyendo no solo la tasa de interés sino también seguros obligatorios, comisiones, gastos administrativos e impuestos. Siempre es mayor que la tasa nominal.',
    example:
      'Un préstamo con tasa nominal anual de 25% puede tener un CFT de 38% una vez que sumás seguro de vida obligatorio, comisión de apertura e IVA sobre intereses.',
  },
  {
    term: 'DGI',
    abbr: 'Dirección General Impositiva',
    definition:
      'Organismo estatal recaudador de impuestos en Uruguay. Administra IRPF, IVA, IRAE, IMESI y otros tributos nacionales.',
  },
  {
    term: 'ETF',
    abbr: 'Exchange-Traded Fund',
    definition:
      'Fondo cotizado en bolsa que replica un índice (ej. S&P 500) o sector. Se compra y vende como una acción, pero internamente diversifica entre cientos de activos. Costos bajos y alta liquidez. En Uruguay se accede principalmente a través de brokers internacionales como Interactive Brokers (IBKR).',
    example:
      'VOO es un ETF que replica el índice S&P 500: con una sola compra, exponés tu plata a las 500 empresas más grandes de EE.UU.',
  },
  {
    term: 'Fondo de Emergencia',
    definition:
      'Reserva de dinero líquido (en caja de ahorro o instrumento de muy bajo riesgo) destinada a cubrir gastos imprevistos sin tener que endeudarse. Se recomienda que cubra entre 3 y 6 meses de gastos básicos.',
  },
  {
    term: 'FONASA',
    abbr: 'Fondo Nacional de Salud',
    definition:
      'Sistema que financia la cobertura de salud de los trabajadores formales en Uruguay. Aportan el empleado (3% a 8% según cargas familiares) y el empleador. Permite elegir entre prestadores integrales (mutualistas o ASSE).',
    example:
      'Una persona soltera sin hijos aporta 3% si gana hasta cierto umbral, y 4,5% si lo supera. Con dos hijos el aporte sube a 6,5% u 8%.',
    related: [{ label: 'BPS', href: 'bps' }],
    metaDescription:
      'Qué es FONASA en Uruguay, cuánto se aporta según tu situación familiar (3%, 4,5%, 6%, 6,5% u 8%) y cómo funciona la devolución anual.',
    keywords: [
      'fonasa uruguay',
      'aporte fonasa',
      'devolucion fonasa',
      'cuanto aporto fonasa',
      'fonasa hijos a cargo',
    ],
    intro:
      'FONASA es el Fondo Nacional de Salud. Es el sistema que financia la cobertura de salud de los trabajadores formales en Uruguay y de sus familiares a cargo. Fue creado por la Ley 18.211 en 2007 como parte de la reforma del sistema de salud (SNIS) y es administrado por el BPS.\n\nFunciona como un seguro solidario: todos los trabajadores formales aportan un porcentaje de su salario, los empleadores aportan otra parte, y con eso se financia la cobertura integral de salud para el aportante y su familia. El monto que aportás depende de tu salario y de tu composición familiar (si tenés cónyuge a cargo, hijos menores, hijos con discapacidad).\n\nA cambio del aporte, podés elegir un prestador integral (mutualista privada como CASMU, Asociación Española, Hospital Británico, o el sistema público ASSE). El FONASA paga directamente a esa institución una cuota mensual por cada afiliado, llamada "cuota salud", y cubre además medicamentos en el FTM y procedimientos en el Fondo Nacional de Recursos.',
    howCalculated:
      'El porcentaje de aporte FONASA depende de tres cosas: tu nivel de ingresos (medido en BPC, donde la BPC 2026 vale aproximadamente $6.500), si tenés cónyuge a cargo, y si tenés hijos menores de 18 años (o con discapacidad sin límite de edad).\n\nFranjas FONASA simplificadas (vigentes en 2026):\n\n- Si tu sueldo no supera 2,5 BPC (aproximadamente $16.250) y no tenés hijos menores: podés estar exento o aportar 3%.\n- Si tu sueldo está entre 2,5 y 8 BPC y no tenés hijos menores: aportás 4,5%.\n- Si tu sueldo supera 8 BPC (aproximadamente $52.000) y no tenés cónyuge ni hijos a cargo: aportás 6%.\n- Si tu sueldo supera 8 BPC y tenés cónyuge a cargo (que no aporta a FONASA): aportás 6,5%.\n- Si tu sueldo supera 8 BPC y tenés tres o más hijos menores: podés llegar a aportar 8%.\n\nEjemplo: salario nominal de $80.000, soltero, sin hijos. Está por encima de 8 BPC, tramo 6%. Aporte FONASA = $80.000 × 6% = $4.800 por mes.\n\nDevolución FONASA anual: si tu aporte total del año supera la cuota salud que correspondió pagar por vos y tu familia, el BPS te devuelve la diferencia entre febrero y abril del año siguiente. Es un dinero que mucha gente no sabe que le corresponde.',
    commonMistakes: [
      'Creer que FONASA cubre todo gratis. No: cubre la cuota mensual del prestador, pero los tickets de medicamentos, órdenes y consultas particulares se siguen pagando aparte.',
      'No reclamar la devolución FONASA. Si aportaste de más durante el año, el BPS te devuelve. Tenés que verificar el cálculo en bps.gub.uy entre febrero y abril.',
      'Asumir que los descuentos de FONASA son los mismos en todos los recibos. Cambian cuando cambia tu situación familiar (si tenés un hijo, si te casás, si tu pareja empieza a aportar también).',
      'Pensar que se puede salir de FONASA y elegir un seguro privado externo en su lugar. No: el aporte es obligatorio para trabajadores formales. Sí podés contratar un seguro privado complementario aparte.',
    ],
    faq: [
      {
        q: '¿Cuánto se aporta a FONASA en Uruguay?',
        a: 'Entre 0% y 8% del salario nominal, según ingresos y composición familiar. Solteros sin hijos con sueldo medio aportan típicamente entre 4,5% y 6%; con cónyuge a cargo, 6,5%; con varios hijos menores, hasta 8%.',
      },
      {
        q: '¿Cuándo se cobra la devolución FONASA?',
        a: 'La devolución FONASA, cuando corresponde, se paga entre febrero y abril del año siguiente al cierre. Tenés que ingresar a bps.gub.uy con tu usuario para ver el monto y la fecha exacta de cobro.',
      },
      {
        q: '¿Mis hijos están cubiertos por FONASA?',
        a: 'Sí. Tus hijos menores de 18 años (o con discapacidad, sin límite de edad) están cubiertos a través de tu aporte. Pueden tener el mismo prestador que vos o uno distinto.',
      },
      {
        q: '¿Si tengo cónyuge que también aporta, ambos pagamos FONASA?',
        a: 'Sí, cada uno aporta sobre su propio salario, sin tramo de "cónyuge a cargo". El tramo de "cónyuge a cargo" (6,5%) aplica solo cuando uno de los dos no aporta a FONASA.',
      },
    ],
    relatedPostSlugs: [
      'salario-liquido-uruguay-2025-cuanto-te-queda-realmente',
      'irpf-uruguay-2026-guia-completa-tramos-deducciones',
    ],
    relatedTool: {
      label: 'Calculadora de Salario Líquido',
      href: '/herramientas/calculadora-salario-liquido',
    },
    lastReviewed: '2026-04-29',
  },
  {
    term: 'IBKR',
    abbr: 'Interactive Brokers',
    definition:
      'Broker internacional muy usado por uruguayos para invertir en acciones, ETFs y bonos del exterior. Tiene comisiones bajas y aceptan transferencias internacionales desde Uruguay.',
  },
  {
    term: 'INE',
    abbr: 'Instituto Nacional de Estadística',
    definition:
      'Organismo estatal que produce las estadísticas oficiales del país. Publica el IPC (índice de precios al consumo), datos de empleo, cuentas nacionales y censo.',
  },
  {
    term: 'IPC',
    abbr: 'Índice de Precios al Consumo',
    definition:
      'Mide la variación promedio de precios de una canasta representativa de bienes y servicios en Uruguay. Lo publica el INE mensualmente y es la medida oficial de inflación. Se usa también para ajustar UI, alquileres y obligaciones contractuales.',
    related: [
      { label: 'UI', href: 'ui' },
      {
        label: 'Calculadora de inflación real',
        href: '/herramientas/inflacion-real',
      },
    ],
  },
  {
    term: 'IRAE',
    abbr: 'Impuesto a las Rentas de Actividades Económicas',
    definition:
      'Impuesto del 25% sobre la utilidad neta de empresas (S.A., SAS, SRL, sucursales). Sustituye al IRPF cuando se trabaja a través de una sociedad. Permite deducir gastos relacionados con la actividad.',
    related: [
      { label: 'IRPF', href: 'irpf' },
      { label: 'SAS', href: 'sas' },
      { label: 'IVA', href: 'iva' },
    ],
    metaDescription:
      'Qué es el IRAE en Uruguay, tasa del 25% sobre utilidad neta, cómo se calcula con un ejemplo, deducciones y diferencia con IRPF para socios de SA y SAS.',
    keywords: [
      'irae uruguay',
      'que es irae',
      'irae 25 por ciento',
      'irae sas',
      'irae deducciones',
      'irae minimo',
    ],
    intro:
      'El IRAE es el Impuesto a las Rentas de Actividades Económicas, el impuesto a la renta empresarial en Uruguay. Aplica a las sociedades (Sociedades Anónimas, SAS, SRL, sociedades de hecho de cierta entidad), a las sucursales de empresas extranjeras y, en algunos casos, a las empresas unipersonales que superan ciertos topes. Fue introducido por la reforma tributaria de 2007 (Ley 18.083) y reemplazó al antiguo Impuesto a la Renta de la Industria y el Comercio (IRIC).\n\nLa tasa es del 25% sobre la utilidad neta fiscal — es decir, sobre los ingresos menos los gastos deducibles relacionados con la actividad. A diferencia del IRPF, que es progresivo por franjas, el IRAE tiene una tasa plana: ganes una utilidad chica o grande, la tasa siempre es 25% sobre el resultado fiscal.\n\nLa diferencia clave con el IRPF es que el IRAE permite deducir gastos. Una empresa puede restar de sus ingresos todos los costos vinculados a la actividad (sueldos, alquileres, servicios, amortización de equipos, etc.) y solo paga IRAE sobre lo que sobra. Por eso, para una persona que tiene gastos elevados vinculados a su actividad (oficina, equipos, empleados), trabajar a través de una sociedad puede resultar más eficiente fiscalmente que tributar IRPF Cat. II.\n\nAhora bien: la utilidad que sobra después de pagar IRAE no es directa para los dueños. Cuando los socios retiran ese dinero como dividendos, ese retiro paga IRPF Categoría I a una tasa adicional (típicamente 7%). Por eso, el "costo total" de operar bajo una sociedad termina rondando un 30-32% combinado entre IRAE + IRPF a dividendos, y el ahorro real frente al IRPF Cat. II depende mucho del nivel de ingresos y de los gastos deducibles disponibles.',
    howCalculated:
      'El IRAE se calcula sobre el resultado fiscal anual:\n\n1. Ingresos: total facturado durante el ejercicio fiscal (que para la mayoría de empresas coincide con el año calendario, aunque algunas tienen ejercicio cerrando en otro mes).\n2. Gastos deducibles: sueldos del personal, aportes patronales, alquileres, servicios, materiales, amortización de bienes de uso, gastos financieros, depreciación, etc., siempre que estén documentados con facturas formales.\n3. Resultado fiscal = ingresos - gastos deducibles.\n4. IRAE a pagar = resultado fiscal × 25%.\n\nEjemplo: una SAS factura $5.000.000 en el año. Sus gastos deducibles (sueldos, alquiler, servicios, etc.) suman $3.500.000. Resultado fiscal = $1.500.000. IRAE a pagar = $1.500.000 × 25% = $375.000.\n\nEsa utilidad neta después de impuestos (= $1.125.000) puede quedar en la empresa (capitalización) o repartirse entre los socios como dividendos. Al repartir dividendos, los socios pagan adicionalmente 7% de IRPF Cat. I sobre el dividendo retirado, lo cual lleva el costo fiscal total a aproximadamente 30,25% sobre la utilidad original (= 25% + 7% × 75%).\n\nLa empresa hace anticipos mensuales o bimestrales durante el año (basados en la utilidad del año anterior) y al cierre presenta la declaración jurada anual de IRAE en DGI, donde se ajusta lo pagado contra lo efectivamente debido. Existe además un IRAE Mínimo: una cuota fija anual que se debe pagar aunque no haya utilidad, para asegurar que toda empresa registrada contribuye un mínimo al sistema.',
    commonMistakes: [
      'Asumir que IRAE 25% es siempre más caro que IRPF Cat. II. No: cuando hay gastos deducibles relevantes y volumen alto, la sociedad puede ser más eficiente fiscalmente que tributar IRPF como persona física.',
      'Olvidar el IRPF Cat. I sobre dividendos. Si la utilidad se queda en la empresa, solo paga IRAE. Si se reparte, suma un 7% adicional. Hay que mirar el costo total, no solo el IRAE.',
      'No documentar gastos. Sin facturas formales a nombre de la empresa, los gastos no son deducibles. Operar "en negro" anula la principal ventaja del régimen IRAE.',
      'Crear una SAS solo "porque suena profesional". El IRAE tiene costos de cumplimiento (contador, balance anual, anticipos, declaración jurada). Para volúmenes bajos suele convenir más monotributo o Literal E.',
    ],
    faq: [
      {
        q: '¿Cuál es la tasa de IRAE en Uruguay?',
        a: 'La tasa es del 25% sobre la utilidad neta fiscal (ingresos menos gastos deducibles). Es una tasa plana, no progresiva por franjas como el IRPF.',
      },
      {
        q: '¿Cuándo conviene IRAE en lugar de IRPF?',
        a: 'En general, cuando tu actividad genera ingresos altos y tenés gastos relevantes vinculados a la actividad (sueldos, alquileres, equipos), una sociedad bajo IRAE puede ser más eficiente fiscalmente que tributar IRPF Cat. II como persona física. El umbral exacto depende de cada caso y conviene calcularlo con un contador.',
      },
      {
        q: '¿Qué empresas tributan IRAE?',
        a: 'Sociedades Anónimas (SA), SAS, SRL, sociedades en comandita, sucursales de empresas extranjeras y empresas unipersonales que superen ciertos topes de facturación o tengan empleados en relación de dependencia. Las pequeñas unipersonales suelen tributar IRPF en lugar de IRAE.',
      },
      {
        q: '¿Tengo que pagar IRAE aunque no haya tenido ganancia?',
        a: 'Sí, existe un IRAE Mínimo: una cuota fija anual que debés pagar aunque la empresa haya tenido pérdida en el ejercicio. El monto del IRAE Mínimo se actualiza periódicamente. Las pérdidas fiscales se pueden compensar contra utilidades de ejercicios futuros.',
      },
    ],
    relatedPostSlugs: [
      'monotributo-vs-unipersonal-vs-sas-uruguay-2026',
      'como-crear-sas-uruguay-paso-a-paso-costos',
      'impuestos-freelancers-uruguay-guia-2026',
    ],
    lastReviewed: '2026-04-29',
  },
  {
    term: 'IRPF',
    abbr: 'Impuesto a la Renta de las Personas Físicas',
    definition:
      'Impuesto sobre los ingresos personales en Uruguay. Tiene dos categorías: Cat. I (rentas de capital, alquileres, intereses, dividendos) y Cat. II (rentas del trabajo en relación de dependencia o servicios personales). Cat. II es progresivo, con franjas que van de 0% a 36%.',
    example:
      'Si ganás $100.000 nominales en relación de dependencia, no pagás 24% sobre todo. Pagás 0% en la primera franja, luego 10%, luego 15%, etc., hasta el último peso ganado.',
    metaDescription:
      'IRPF Uruguay 2026: definición, tramos actualizados (BPC $6.500), cómo se calcula con ejemplo real y deducciones permitidas (alquiler, hijos, BPS).',
    keywords: [
      'irpf uruguay',
      'tramos irpf 2026',
      'que es irpf',
      'como se calcula irpf',
      'deducciones irpf',
      'minimo no imponible irpf',
    ],
    intro:
      'El IRPF es el Impuesto a la Renta de las Personas Físicas en Uruguay. Es el impuesto que grava los ingresos de las personas: el sueldo de los trabajadores, los honorarios de los profesionales independientes, los alquileres recibidos, los intereses bancarios, los dividendos. Fue creado por la Ley 18.083 de 2007 como parte de la reforma tributaria y reemplazó a varios impuestos parciales que existían antes.\n\nEl IRPF tiene dos categorías. Categoría I grava las rentas de capital: alquileres, intereses, dividendos, ganancias de capital. Suele tener tasas planas (12% es la más común). Categoría II grava las rentas del trabajo: sueldos en relación de dependencia y honorarios de servicios personales. Es progresiva por franjas, con tasas que van del 0% al 36%.\n\nLo crítico para entender el IRPF es que es progresivo por franjas: cada porción de tu ingreso paga la tasa de su franja, no toda tu plata paga la tasa máxima. Si tu ingreso "cae" en la franja del 24%, eso no significa que pagues 24% de todo lo que ganás. Pagás 0% sobre la primera franja, 10% sobre la segunda, y así sucesivamente, hasta llegar al último peso que ganaste.\n\nAdemás, antes de aplicar las franjas, se descuentan los aportes obligatorios (BPS, FONASA, FRL) y ciertas deducciones permitidas (parte del alquiler, hijos a cargo, cónyuge sin ingresos, aportes personales adicionales).',
    howCalculated:
      'El cálculo del IRPF Cat. II en relación de dependencia tiene cinco pasos:\n\n1. Calcular el ingreso nominal del mes (sueldo + horas extras + comisiones, sin tickets ni viáticos).\n2. Restar los aportes obligatorios: BPS 15%, FONASA (entre 3% y 8% según situación), FRL 0,1%.\n3. Sobre el resultado (la base imponible), aplicar las franjas del IRPF, empezando por la primera y subiendo.\n4. Restar las deducciones permitidas (multiplicadas por la tasa de la franja correspondiente).\n5. El número final es la retención mensual del IRPF que aparece en tu recibo.\n\nTramos IRPF 2026 (con BPC ≈ $6.500):\n\n- Hasta 7 BPC ($45.500): 0%\n- De 7 a 10 BPC ($45.500 a $65.000): 10%\n- De 10 a 15 BPC ($65.000 a $97.500): 15%\n- De 15 a 20 BPC ($97.500 a $130.000): 24%\n- De 20 a 50 BPC ($130.000 a $325.000): 25%\n- De 50 a 100 BPC ($325.000 a $650.000): 27%\n- Más de 100 BPC: 36%\n\nEjemplo: salario nominal de $100.000, soltero, sin hijos.\n\n- BPS 15% = $15.000\n- FONASA 6% = $6.000\n- FRL 0,1% = $100\n- Base imponible = $100.000 - $15.000 - $6.000 - $100 = $78.900\n- IRPF: 0% sobre los primeros $45.500 ($0) + 10% sobre los siguientes $19.500 ($1.950) + 15% sobre los últimos $13.900 ($2.085) = $4.035.\n\nIRPF mensual aproximado: $4.035. Tasa efectiva: 4,03% del nominal. Mucho menos que la tasa marginal de 15%.',
    commonMistakes: [
      'Creer que pagás la tasa máxima sobre todo el sueldo. No: solo sobre la porción de ingreso que cae en esa franja. La tasa efectiva (lo que realmente pagás dividido tu nominal) suele ser bastante menor.',
      'No declarar el alquiler para deducir IRPF. Si pagás alquiler de tu vivienda principal y declarás el contrato en DGI, podés deducir el 6% del alquiler anual como crédito fiscal contra tu IRPF.',
      'Olvidar deducciones por hijos. Cada hijo menor de 18 años da derecho a deducir 20 BPC anuales, lo cual se traduce en IRPF más bajo.',
      'No hacer la declaración jurada cuando corresponde. Si tenés más de un empleo, ingresos por servicios personales y dependientes a la vez, o si querés reclamar deducciones, tenés que presentar DJ ante DGI entre marzo y mayo del año siguiente.',
    ],
    faq: [
      {
        q: '¿A partir de qué sueldo se paga IRPF en Uruguay?',
        a: 'En 2026, con la BPC en $6.500, el mínimo no imponible es de 7 BPC mensuales después de aportes (≈ $45.500). En términos de sueldo nominal, eso equivale a aproximadamente $55.500 mensuales para una persona soltera sin hijos.',
      },
      {
        q: '¿Qué se puede deducir del IRPF?',
        a: 'Aportes BPS, FONASA y FRL ya se descuentan antes de calcular IRPF. Sobre la base imponible podés restar: 6% del alquiler de vivienda principal (si está declarado), 20 BPC anuales por hijo menor o cónyuge sin ingresos, 40 BPC por hijo con discapacidad, parte de los aportes a Caja de Profesionales o Notarial, y aportes a fondos jubilatorios voluntarios.',
      },
      {
        q: '¿Cuál es la tasa máxima de IRPF en Uruguay?',
        a: '36% para ingresos superiores a 100 BPC mensuales (≈ $650.000 mensuales en 2026). Por debajo de eso las tasas son más bajas y aplican solo a la porción del ingreso que cae en cada franja.',
      },
      {
        q: '¿Cuándo se hace la declaración jurada de IRPF?',
        a: 'La declaración jurada anual de IRPF se presenta ante DGI entre marzo y mayo del año siguiente. Si tenés un solo empleo en relación de dependencia y no querés reclamar deducciones, generalmente no necesitás presentarla porque la retención mensual ya cubre el impuesto del año.',
      },
    ],
    relatedPostSlugs: [
      'irpf-uruguay-2026-guia-completa-tramos-deducciones',
      'deducciones-irpf-2026-descontar-legalmente',
      'salario-liquido-uruguay-2025-cuanto-te-queda-realmente',
    ],
    relatedTool: {
      label: 'Calculadora de Salario Líquido',
      href: '/herramientas/calculadora-salario-liquido',
    },
    lastReviewed: '2026-04-29',
  },
  {
    term: 'ISR',
    abbr: 'Incremental Static Regeneration',
    definition:
      'Término técnico de desarrollo web sin relación con tributos uruguayos. No confundir con "ISR" del impuesto sobre la renta de otros países (en Uruguay es IRPF).',
  },
  {
    term: 'IVA',
    abbr: 'Impuesto al Valor Agregado',
    definition:
      'Impuesto al consumo aplicado a casi todas las operaciones de compra-venta de bienes y servicios en Uruguay. Tasa básica: 22%. Tasa mínima: 10% (alimentos, medicamentos). Algunos servicios están exentos.',
    related: [
      { label: 'IRAE', href: 'irae' },
      { label: 'DGI', href: 'dgi' },
      { label: 'Literal E', href: 'literal-e' },
    ],
    metaDescription:
      'Qué es el IVA en Uruguay, sus tasas (22% básica, 10% mínima), bienes y servicios exentos, cómo funciona el crédito fiscal y las formas de liquidación.',
    keywords: [
      'iva uruguay',
      'tasa iva',
      'iva basico 22',
      'iva minimo 10',
      'iva exento',
      'credito fiscal iva',
    ],
    intro:
      'El IVA es el Impuesto al Valor Agregado, el principal impuesto al consumo en Uruguay. Grava la circulación interna de bienes y servicios: cada vez que comprás algo en un comercio formal, una parte del precio (el IVA) se va al Estado. Para vos como consumidor final, el IVA está incluido en el precio que pagás; el comerciante lo cobra y se lo entrega a DGI a través de declaraciones mensuales o bimestrales. Está regulado por el Título 10 del Texto Ordenado tributario y por sucesivas leyes desde 1972.\n\nUruguay tiene tres regímenes principales para el IVA. La tasa básica es del 22%, que aplica a la mayoría de bienes y servicios (electrodomésticos, ropa, restoranes, servicios profesionales, etc.). La tasa mínima es del 10%, que aplica a productos esenciales: alimentos básicos (carne, pan, leche), medicamentos, transporte de pasajeros, servicios de hotelería para extranjeros, entre otros. Y existe un régimen de exención para algunas operaciones: servicios financieros, salud, educación, alquileres residenciales, exportaciones, libros y diarios.\n\nUn detalle clave es la mecánica del crédito fiscal. Cuando una empresa registrada en DGI compra insumos, el IVA que pagó por esas compras (IVA compras) se descuenta del IVA que cobró a sus clientes (IVA ventas). Solo paga la diferencia. Por eso, en la práctica, el IVA recae sobre el consumidor final, no sobre los eslabones intermedios de la cadena productiva. Los monotributistas son la excepción: no facturan con IVA y, por lo tanto, tampoco descuentan el IVA de sus compras.',
    howCalculated:
      'Para una empresa registrada (régimen general o Literal E):\n\n1. IVA ventas: por cada venta gravada, se calcula el IVA aplicable (22% o 10% según el bien/servicio) y se cobra al cliente sumado al precio neto.\n2. IVA compras: por cada compra de insumos gravados, el IVA pagado al proveedor se registra como crédito fiscal.\n3. Saldo del período: IVA ventas - IVA compras. Si es positivo, se paga a DGI. Si es negativo, queda como saldo a favor para el próximo período.\n\nEjemplo: una empresa de software factura $100.000 + IVA en el mes. IVA ventas = $22.000. Ese mes compra licencias de software por $20.000 + IVA = $4.400 de IVA compras. Saldo a pagar a DGI = $22.000 - $4.400 = $17.600.\n\nLas tasas básicas y mínima:\n\n- 22% (tasa básica): mayoría de bienes y servicios.\n- 10% (tasa mínima): pan, carne, pescado, frutas, verduras, leche, medicamentos, transporte público de pasajeros, hotelería para no residentes.\n- 0% (exentos): exportaciones, servicios financieros, salud, educación formal, alquileres de vivienda, libros, periódicos, espectáculos en vivo.\n\nEl régimen Literal E paga un IVA Mínimo: una cuota fija mensual que ronda los $1.500-$2.500 (variable según actividad y año), en lugar de calcular IVA ventas / compras. Es una simplificación para empresas chicas.',
    commonMistakes: [
      'Asumir que todo lo que vende una empresa lleva el 22%. Hay productos a tasa mínima (10%) y servicios exentos. Identificar mal la tasa termina en multas o pago de más al Estado.',
      'No conservar facturas de compra. Sin facturas formales, no podés computar crédito fiscal y terminás pagando IVA sobre el bruto en lugar de sobre el valor agregado.',
      'Confundir IVA con IRAE. El IVA es impuesto al consumo (lo paga el consumidor final). El IRAE es impuesto a la renta empresarial (sobre la utilidad neta). Son dos impuestos distintos que pueden coexistir.',
      'Pensar que monotributo te permite descontar IVA. No: monotributo no factura con IVA y no tiene crédito fiscal por las compras. Si tu negocio compra mucho insumo gravado, el régimen general puede convenirte más.',
    ],
    faq: [
      {
        q: '¿Cuál es la tasa de IVA en Uruguay?',
        a: 'La tasa básica es 22% y aplica a la mayoría de bienes y servicios. Existe una tasa mínima de 10% para productos esenciales (alimentos básicos, medicamentos, transporte de pasajeros). Algunos servicios están exentos (salud, educación, alquileres residenciales, servicios financieros).',
      },
      {
        q: '¿Qué productos están exentos de IVA en Uruguay?',
        a: 'Servicios financieros y de seguros, salud y educación formal, alquileres de vivienda, libros y diarios, exportaciones de bienes y servicios, espectáculos en vivo y otros casos puntuales fijados por ley. La lista completa está en el Título 10 del Texto Ordenado y se actualiza periódicamente.',
      },
      {
        q: '¿Cómo se descuenta el IVA?',
        a: 'Las empresas registradas en DGI restan el IVA pagado en compras (crédito fiscal) del IVA cobrado en ventas. Solo pagan la diferencia. Para que un IVA compras sea descontable, la factura debe estar a nombre de la empresa y la compra debe estar vinculada a la actividad gravada.',
      },
      {
        q: '¿Los monotributistas pagan IVA?',
        a: 'No. El monotributo es un régimen simplificado que no factura con IVA y, por contrapartida, no descuenta el IVA de las compras. Esa es una de las diferencias clave con Literal E o régimen general, donde sí se factura con IVA y se descuenta crédito fiscal.',
      },
    ],
    relatedPostSlugs: [
      'impuestos-freelancers-uruguay-guia-2026',
      'monotributo-vs-unipersonal-vs-sas-uruguay-2026',
    ],
    lastReviewed: '2026-04-29',
  },
  {
    term: 'Jubilación',
    definition:
      'Beneficio mensual vitalicio al que se accede al cumplir la edad mínima (60 años con 30 años de aportes; o 65 años con menos años) y haber aportado al sistema. En Uruguay el cálculo combina BPS y AFAP.',
    related: [
      { label: 'AFAP', href: 'afap' },
      { label: 'BPS', href: 'bps' },
    ],
  },
  {
    term: 'Letra de Regulación Monetaria',
    abbr: 'LRM',
    definition:
      'Instrumento de deuda emitido por el BCU para regular la cantidad de dinero en circulación. Las personas pueden invertir en LRM a través de algunos bancos o corredores; ofrece rendimientos por encima de la inflación con bajo riesgo (riesgo país soberano uruguayo).',
  },
  {
    term: 'Literal E',
    definition:
      'Régimen tributario simplificado para pequeñas empresas (Literal E del IVA) en Uruguay. Tiene un tope de facturación anual y simplifica el pago de impuestos a una cuota fija mensual.',
    related: [
      { label: 'Monotributo', href: 'monotributo' },
      { label: 'IRAE', href: 'irae' },
    ],
  },
  {
    term: 'Monotributo',
    definition:
      'Régimen simplificado del BPS para profesionales y microempresarios con baja facturación. Pagás una cuota fija mensual que cubre tributos previsionales y de salud, sin necesidad de hacer declaraciones de IRPF/IRAE.',
    related: [
      { label: 'Literal E', href: 'literal-e' },
      { label: 'IRAE', href: 'irae' },
      { label: 'Unipersonal', href: 'unipersonal' },
    ],
    metaDescription:
      'Qué es el monotributo en Uruguay, cuánto cuesta ($2.800/mes), límites de facturación (183.000 UI/año) y cuándo conviene vs Literal E o régimen general.',
    keywords: [
      'monotributo uruguay',
      'cuanto cuesta monotributo',
      'limite monotributo',
      'monotributo vs literal e',
      'monotributo social mides',
      'inscribirse monotributo',
    ],
    intro:
      'El monotributo es un régimen tributario simplificado de Uruguay, pensado para emprendimientos chicos. En vez de pagar cada impuesto por separado (IRPF, IRAE, IVA, aportes BPS) y de presentar declaraciones juradas mensuales, pagás una cuota fija mensual que junta todo: aportes previsionales (BPS), Fondo de Reconversión Laboral (FRL) e impuestos a DGI. Está regulado principalmente por las leyes 18.083 y 18.874.\n\nEl monotributo está pensado para actividades de pequeña escala: el freelancer que hace páginas web, la persona que vende manualidades, el repartidor independiente, el que arregla aires acondicionados, la persona que vende por MercadoLibre desde su casa. Podés ser una empresa unipersonal o, en algunos casos, una sociedad de hecho de hasta dos personas. Como máximo, podés tener un empleado en relación de dependencia (si sos unipersonal); las sociedades de hecho en monotributo no pueden tener empleados.\n\nEl beneficio principal es la simplicidad: cuota fija conocida, sin contador obligatorio, inscripción 100% online en el portal del BPS. La contracara es que tenés límites estrictos de facturación, activo y empleados; si los superás, te tenés que pasar a Literal E o al régimen general.',
    howCalculated:
      'La cuota mensual del monotributo en 2025-2026 está alrededor de $2.800 (cifra actualizada periódicamente por BPS). Esa cuota incluye los aportes jubilatorios al BPS y los impuestos correspondientes a DGI. El pago vence el día 25 de cada mes y se puede hacer en RedPagos, Abitab, débito automático o desde el portal del BPS con tarjeta.\n\nLa cobertura de salud (FONASA) es opcional para monotributistas. Si la querés activar, pagás un adicional de aproximadamente $2.600 mensuales (calculado sobre 6,5 BPC). Con cobertura de salud incluida, el costo total queda en torno a los $5.400 por mes.\n\nLímites para mantenerte dentro del régimen (vigentes en 2025):\n\n- Facturación anual: hasta 183.000 UI (≈ $1.190.000 a precios de 2026, equivalentes aproximados a $99.000 mensuales).\n- Activo total: hasta 152.500 UI (≈ $990.000), incluyendo equipos, mercadería y dinero en cuentas de la empresa.\n- Empleados: máximo uno (solo si sos unipersonal).\n- Actividad: solo a consumidores finales o empresas que no necesiten descontar IVA. No podés emitir facturas con IVA.\n\nPara empresas que se inscribieron a partir del 1 de enero de 2021 existe un régimen gradual: los primeros años pagás una cuota más baja que va subiendo hasta llegar al monto completo. Sirve para arrancar sin que la cuota completa pese desde el primer día.',
    commonMistakes: [
      'Quedarse en monotributo una vez que superaste el tope de facturación. Cuando pasás los 183.000 UI anuales, tenés que avisar a DGI y migrar a Literal E o régimen general; si no, hay multas.',
      'Asumir que podés facturar a empresas grandes con monotributo. Si quien te contrata necesita IVA en la factura para descontar, no le sirve tu factura de monotributo. Para esos clientes hay que estar en Literal E o régimen general.',
      'No pagar la cuota a tiempo. El vencimiento es el 25 de cada mes. Atrasarse genera multas y, si dejás de pagar varios meses, podés perder los aportes BPS y la cobertura de salud (si la tenés contratada).',
      'Olvidar la opción Monotributo Social MIDES. Si estás en situación de vulnerabilidad económica, MIDES puede subsidiar gran parte de la cuota. Conviene consultar antes de inscribirse al monotributo común.',
    ],
    faq: [
      {
        q: '¿Cuánto cuesta el monotributo en Uruguay?',
        a: 'La cuota base ronda los $2.800 por mes en 2025-2026 (sin cobertura de salud). Si querés cobertura FONASA, sumás otros ~$2.600. Total con salud incluida: aproximadamente $5.400 mensuales.',
      },
      {
        q: '¿Cuál es el límite de facturación del monotributo?',
        a: 'En 2025, el tope es de 183.000 UI por año, equivalente aproximadamente a $1.190.000. Si superás ese monto, tenés que migrar a Literal E o al régimen general.',
      },
      {
        q: '¿El monotributo cubre jubilación?',
        a: 'Sí. La cuota incluye aportes jubilatorios al BPS, lo cual te da años de aporte que cuentan para tu futura jubilación. Sin embargo, la base sobre la que se calcula tu jubilación es relativamente baja, así que si proyectás trabajar muchos años bajo este régimen, tu jubilación BPS será modesta.',
      },
      {
        q: '¿Puedo facturar al exterior con monotributo?',
        a: 'Sí, pero con cuidado. Las exportaciones de servicios desde monotributo están permitidas, pero tienen reglas específicas (la facturación se cuenta dentro del tope de 183.000 UI; no genera IVA porque la prestación se considera fuera del territorio). Si tu volumen exterior es alto, conviene revisar si Literal E o régimen general te resulta más conveniente.',
      },
    ],
    relatedPostSlugs: [
      'monotributo-uruguay-2025-guia-completa-requisitos-costos',
      'monotributo-vs-unipersonal-vs-sas-uruguay-2026',
      'impuestos-freelancers-uruguay-guia-2026',
    ],
    lastReviewed: '2026-04-29',
  },
  {
    term: 'Plazo Fijo',
    definition:
      'Depósito bancario por un plazo determinado (30, 60, 90 días, 1 año) a una tasa de interés acordada. En Uruguay se pueden hacer en pesos, UI o dólares. Suelen requerir un mínimo de USD 1.000 o equivalente.',
    related: [
      { label: 'UI', href: 'ui' },
      { label: 'BROU', href: 'brou' },
    ],
    metaDescription:
      'Qué es un plazo fijo, cómo funciona en Uruguay, tasas 2026 en pesos (5,5-6,5%), dólares (2,5-2,8%) y UI (1,5% real), y cuándo conviene cada moneda.',
    keywords: [
      'plazo fijo uruguay',
      'tasas plazo fijo 2026',
      'plazo fijo brou',
      'plazo fijo pesos',
      'plazo fijo dolares',
      'plazo fijo ui',
    ],
    intro:
      'Un plazo fijo es un depósito bancario en el que entregás una suma de dinero al banco por un plazo determinado (30, 60, 90, 180 o 365 días son los más comunes), y a cambio el banco te paga una tasa de interés conocida desde el momento de la operación. Es la inversión más popular en Uruguay porque combina simplicidad, previsibilidad y bajo riesgo: la plata está respaldada por la solvencia del banco y, hasta cierto monto, por el seguro estatal de depósitos.\n\nEn Uruguay podés hacer plazos fijos en tres monedas: pesos uruguayos (UYU), dólares (USD) y Unidades Indexadas (UI). Cada moneda tiene rendimientos muy diferentes y conviene para situaciones distintas. Las tasas en pesos son las más altas en términos nominales (porque también incorporan la expectativa de inflación), las tasas en dólares son las más bajas, y las tasas en UI son rendimientos "reales" por encima de la inflación.\n\nLos plazos fijos se constituyen presencialmente en la sucursal o, cada vez más, online desde la app del banco (BROU lo hace por e-BROU, Itaú por Itaú Online, BBVA por BBVA Net). Una vez constituido, el plazo fijo no se puede romper: si retirás antes del vencimiento, perdés todos o parte de los intereses (cancelación anticipada). Por eso conviene calcular bien el plazo: no podés "rescatar" la plata si surge un imprevisto sin pagar el costo.',
    howCalculated:
      'El interés de un plazo fijo se calcula sobre el capital depositado, según la Tasa Efectiva Anual (TEA) acordada y el plazo de la operación.\n\nFórmula simplificada: interés = capital × TEA × (días / 365).\n\nEjemplo: depositás $500.000 a 365 días en un plazo fijo en pesos al 6% TEA. Al vencimiento cobrás $500.000 × 6% × 1 = $30.000 de interés. Total al final: $530.000.\n\nTasas referenciales en Uruguay (abril 2026, plazo 365 días):\n\n- En pesos: BROU ~6,0%, Itaú ~6,5%, Heritage ~6,5%, BBVA ~5,5%. La diferencia entre el mejor y el peor sobre $500.000 a un año es de aproximadamente $5.000.\n- En dólares: BROU ~2,3%, Itaú ~2,5%, Heritage ~2,8% (con USD 5.000 mínimo). Las tasas en dólares son bajas porque reflejan tasas internacionales y la prima de Uruguay.\n- En UI: BROU y Scotiabank ~1,5% real, Itaú ~1,3% real. Si la inflación es 4,5%, un plazo fijo en UI al 1,5% real rinde aproximadamente 6,07% nominal en pesos.\n\nMontos mínimos: BROU acepta desde $10.000 (el más bajo), Itaú y BBVA suelen pedir desde $50.000 en pesos. En dólares, los mínimos van de USD 1.000 a USD 5.000. En UI, los mínimos suelen rondar las 5.000-10.000 UI (entre $32.500 y $65.000 a precios actuales).',
    commonMistakes: [
      'Comparar solo la TNA en vez de la TEA. La Tasa Nominal Anual no incluye el efecto de la capitalización; la Tasa Efectiva Anual sí. Comparar TNA contra TEA te lleva a elegir mal.',
      'Hacer un plazo fijo largo cuando podrías necesitar la plata. Si rompés el plazo antes de tiempo, perdés todos o casi todos los intereses. Para fondos de emergencia, conviene caja de ahorro o plazos fijos cortos renovables.',
      'Asumir que dólares = seguridad. En dólares las tasas son tan bajas (2-3%) que después de la inflación del dólar (~3% anual en EE.UU. en años recientes), tu rendimiento real puede ser cero o negativo. Para preservar valor frente a inflación local, la UI suele ser más eficiente.',
      'No comparar entre bancos. La diferencia de un punto entre el mejor y el peor banco, sobre un capital grande y varios años, son miles de pesos o dólares perdidos por inercia.',
    ],
    faq: [
      {
        q: '¿Cuál es el banco con mejor tasa de plazo fijo en Uruguay?',
        a: 'Varía según moneda y plazo. En 2026 a 365 días, en pesos lideran Itaú y Heritage con ~6,5% TEA. En dólares, Heritage con ~2,8%. En UI, BROU y Scotiabank con ~1,5% real. Conviene revisar tasas vigentes el día que vas a hacer el depósito porque cambian.',
      },
      {
        q: '¿Puedo romper un plazo fijo antes de tiempo?',
        a: 'Sí, pero pagás un costo. Si rompés antes del vencimiento, el banco aplica una "tasa de cancelación anticipada" que normalmente es muy inferior a la pactada (a veces 0%). En la práctica, perdés todos o casi todos los intereses. Por eso conviene hacer plazos cortos renovables si hay incertidumbre.',
      },
      {
        q: '¿Conviene plazo fijo en pesos o en UI?',
        a: 'Si tus gastos futuros son en pesos uruguayos (vivís acá, todos tus consumos son en pesos), la UI te protege contra inflación local con rendimiento real positivo. Si la tasa en pesos supera notablemente la inflación esperada + el premio de la UI, los pesos pueden rendir más, pero el riesgo de que la inflación se acelere lo asume vos. Diversificar entre ambas es lo más prudente.',
      },
      {
        q: '¿Hay seguro de depósitos en Uruguay?',
        a: 'Sí. La Corporación de Protección del Ahorro Bancario (COPAB) garantiza los depósitos en bancos uruguayos hasta cierto monto por persona y por banco. Si el banco quiebra, COPAB cubre los depósitos hasta el tope. Los detalles del tope se actualizan periódicamente en copab.com.uy.',
      },
    ],
    relatedPostSlugs: [
      'plazo-fijo-uruguay-2026-tasas-comparativa',
      'unidades-indexadas-ui-2026-como-comprar-rinden',
    ],
    lastReviewed: '2026-04-29',
  },
  {
    term: 'PYME',
    abbr: 'Pequeña y Mediana Empresa',
    definition:
      'Categorización empresarial según facturación y cantidad de empleados. En Uruguay, la mayoría de las empresas son PYMES y tienen acceso a regímenes y créditos diferenciados.',
  },
  {
    term: 'SAS',
    abbr: 'Sociedad por Acciones Simplificada',
    definition:
      'Tipo societario flexible y de bajo costo de creación, ideal para startups y pequeños emprendimientos. Se constituye en pocos días y permite un único accionista. Tributa IRAE.',
  },
  {
    term: 'Tasa Nominal Anual',
    abbr: 'TNA',
    definition:
      'Tasa de interés anual sin capitalización. Usada en publicidad bancaria. Generalmente es menor que la tasa efectiva (TEA) que sí incluye el efecto de la capitalización.',
  },
  {
    term: 'UI',
    abbr: 'Unidad Indexada',
    definition:
      'Unidad de cuenta uruguaya cuyo valor se ajusta diariamente según el IPC. Sirve para mantener el poder adquisitivo en contratos de largo plazo (alquileres, hipotecas, préstamos). El BCU publica el valor diario.',
    example:
      'Un préstamo hipotecario de 1.000.000 UI a 20 años: la deuda en pesos sube todos los meses, pero su valor real (en términos de poder adquisitivo) se mantiene.',
    related: [{ label: 'IPC', href: 'ipc' }],
    metaDescription:
      'Qué es la Unidad Indexada (UI) en Uruguay, cómo se calcula su valor diario contra el IPC, valor actual ($6.50) y cuándo conviene usarla para ahorrar.',
    keywords: [
      'unidad indexada',
      'ui uruguay',
      'valor ui hoy',
      'que es ui',
      'plazo fijo ui',
      'ui vs dolar',
    ],
    intro:
      'La Unidad Indexada (UI) es una unidad de cuenta uruguaya cuyo valor se ajusta diariamente según la inflación. No es una moneda física: no la podés llevar en el bolsillo ni pagar con ella en el supermercado. Es una unidad de medida que permite expresar contratos, deudas e inversiones en términos que mantengan el poder adquisitivo a lo largo del tiempo.\n\nFue creada en junio de 2002 por la Ley 17.761, en plena crisis financiera uruguaya. El primer día valía exactamente $1 peso uruguayo. Hoy, en 2026, vale aproximadamente $6,50 — eso quiere decir que los precios en Uruguay se multiplicaron por 6,5 desde 2002.\n\nLa UI se usa principalmente en cuatro situaciones: alquileres a largo plazo (la mayoría de los contratos de vivienda están en UI), préstamos hipotecarios (BHU y mucha banca privada usan UI), bonos de deuda emitidos por el Estado, y plazos fijos en UI ofrecidos por los bancos. Hay también algunas inversiones en fondos que toman UI como referencia.\n\nLa ventaja principal de la UI es la previsibilidad real: si pactás algo en UI, sabés que el poder adquisitivo de esa cifra se mantiene a lo largo del tiempo, sin importar lo que haga la inflación o el dólar. La desventaja es que la UI nunca rinde "más" que la inflación uruguaya: solo te protege, no te hace ganar plata en términos reales (a menos que el instrumento que la use además pague intereses por encima).',
    howCalculated:
      'El BCU publica el valor de la UI todos los días en su página oficial. La fórmula es: valor de la UI de hoy = valor de la UI de ayer × factor diario de inflación.\n\nEl factor diario sale del IPC mensual publicado por el INE. Si la inflación de un mes fue 0,4%, ese 0,4% se distribuye en el mes siguiente repartido en los días calendario. El INE publica el IPC alrededor del 5 de cada mes; con ese dato, el BCU calcula los factores diarios para el mes siguiente.\n\nEjemplo histórico: el 20 de junio de 2002 (primer día de existencia de la UI), su valor era exactamente $1. El 31 de diciembre de 2025, vale aproximadamente $6,40. En abril de 2026 ronda los $6,50. Eso significa que un peso de 2002 hoy compra aproximadamente lo mismo que $6,50 hoy: la inflación acumulada de Uruguay en ese período fue ~550%.\n\nComparación con el dólar en el mismo período: el dólar en junio de 2002 estaba a unos $22 y hoy ronda los $42-43. Multiplicó por ~1,9x. La UI multiplicó por ~6,5x. Por eso la UI es un mejor protector contra la inflación local que el dólar — el dólar no está atado a precios uruguayos.',
    commonMistakes: [
      'Creer que la UI te hace ganar plata. No: solo te empata con la inflación. Si tu plazo fijo en UI paga 1% sobre la UI, ganás inflación + 1%. La UI sola no es un instrumento de ganancia, es de protección.',
      'Pensar que la UI baja cuando baja el dólar. No tienen nada que ver: la UI sigue al IPC uruguayo, no al tipo de cambio. Pueden moverse en direcciones distintas.',
      'Confundir UI con UR. La UI se ajusta por IPC (inflación general). La UR se ajusta por el Índice Medio de Salarios (IMS) y se usa principalmente en alquileres viejos y algunas obligaciones laborales.',
      'Tomar un préstamo en UI sin entender el riesgo. Si tu sueldo no se ajusta por inflación al mismo ritmo que la UI, el préstamo en UI puede crecer más rápido que tu capacidad de pago.',
    ],
    faq: [
      {
        q: '¿Cuál es el valor de la UI hoy?',
        a: 'En abril de 2026, la UI vale aproximadamente $6,50. El valor exacto se publica diariamente en la página del BCU (bcu.gub.uy), en la sección de Indicadores Económicos.',
      },
      {
        q: '¿Cómo comprar UI en Uruguay?',
        a: 'No se "compra" la UI directamente como una moneda. Se invierte en instrumentos denominados en UI: plazos fijos en UI (BROU, BHU y banca privada los ofrecen), bonos del gobierno en UI (a través de corredores), o fondos de inversión en UI. La conversión de pesos a UI se hace al valor del día.',
      },
      {
        q: '¿Es mejor ahorrar en UI o en dólares?',
        a: 'Depende de para qué. Si tus gastos futuros son en pesos (vivís en Uruguay, comprás acá, vas a pagar deudas en pesos), la UI te protege mejor del costo de vida local. Si tus gastos futuros son en dólares (vas a viajar al exterior, comprar algo importado), el dólar tiene más sentido. Muchos uruguayos diversifican: parte en UI, parte en dólares.',
      },
      {
        q: '¿La UI puede bajar de valor?',
        a: 'En teoría sí, si hay deflación (caída sostenida de precios). En la práctica, Uruguay no ha tenido deflación significativa desde 2002, así que la UI siempre subió. Los días de variación negativa son extremadamente raros y compensados por subas en otros días.',
      },
    ],
    relatedPostSlugs: [
      'unidades-indexadas-ui-2026-como-comprar-rinden',
      'plazo-fijo-uruguay-2026-tasas-comparativa',
    ],
    relatedTool: {
      label: 'Calculadora de Inflación Real',
      href: '/herramientas/inflacion-real',
    },
    lastReviewed: '2026-04-29',
  },
  {
    term: 'Unipersonal',
    definition:
      'Empresa con un único titular, persona física. En Uruguay se inscribe en BPS y DGI, factura a su nombre y tributa IRPF Cat. I/II o IRAE según ingresos. Sin separación patrimonial entre la empresa y la persona.',
  },
  {
    term: 'Zona Franca',
    definition:
      'Áreas geográficas dentro de Uruguay con beneficios fiscales especiales. Las empresas instaladas en zona franca quedan exentas de la mayoría de impuestos, pero deben cumplir requisitos de actividad y empleo.',
  },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = RAW_TERMS.map((t) => ({
  ...t,
  slug: slugifyTerm(t.term),
}));

export function getAllTerms(): GlossaryTerm[] {
  return GLOSSARY_TERMS;
}

export function getTermBySlug(slug: string): GlossaryTerm | null {
  return GLOSSARY_TERMS.find((t) => t.slug === slug) ?? null;
}

export function getStandalonePageTerms(): GlossaryTerm[] {
  return GLOSSARY_TERMS.filter((t) => !!t.intro);
}

export function getStandalonePageSlugs(): string[] {
  return getStandalonePageTerms().map((t) => t.slug);
}

export function hasStandalonePage(slug: string): boolean {
  return !!getTermBySlug(slug)?.intro;
}

/**
 * Resolve an internal href for a related-term link.
 * If the related target is a glossary term slug with a standalone page → /glosario/{slug}.
 * If it's a path starting with /, return as-is.
 * Otherwise, treat it as a glossary anchor → /glosario#{slug}.
 */
export function resolveRelatedHref(href: string): string {
  if (href.startsWith('/')) return href;
  if (hasStandalonePage(href)) return `/glosario/${href}`;
  return `/glosario#${href}`;
}
