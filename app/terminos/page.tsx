import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Ahorrin',
  description: 'Términos y condiciones de uso de Ahorrin - Plataforma de gestión de finanzas personales',
  robots: 'noindex, nofollow',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pt-28 sm:pt-36 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-2">Términos y Condiciones</h1>
          <p className="text-muted-foreground">Última actualización: Octubre 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <p className="text-base leading-relaxed mb-0">
              Bienvenido a Ahorrin. Al usar nuestra plataforma, aceptás los siguientes términos y condiciones.
              Por favor, leélos cuidadosamente antes de crear una cuenta.
            </p>
          </div>

          {/* Sección 1: Aceptación de Términos */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Aceptación de Términos</h2>
            <p className="text-muted-foreground mb-4">
              Al acceder y usar Ahorrin, confirmás que:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-6">
              <li>Sos mayor de 18 años o tenés el consentimiento de un tutor legal</li>
              <li>Aceptás estos términos y condiciones en su totalidad</li>
              <li>Cumplirás con todas las leyes aplicables en Uruguay</li>
            </ul>
          </section>

          {/* Sección 2: Descargo de Responsabilidad Financiera */}
          <section className="mb-8 bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-yellow-500 p-6 rounded-r-lg">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              2. Descargo de Responsabilidad - No es Asesoramiento Financiero
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p className="font-semibold text-foreground">
                ⚠️ IMPORTANTE: Ahorrin NO es una plataforma de asesoramiento financiero, inversiones ni servicios bancarios.
              </p>
              <p>
                <strong>Ahorrin es una herramienta de organización personal.</strong> Toda la información, análisis,
                gráficos, reportes y sugerencias generados por la plataforma tienen únicamente fines informativos
                y educativos.
              </p>
              <p>
                <strong>No brindamos:</strong>
              </p>
              <ul className="ml-6 space-y-1">
                <li>Consejos de inversión personalizados</li>
                <li>Recomendaciones de compra o venta de activos financieros</li>
                <li>Asesoramiento sobre productos bancarios</li>
                <li>Planificación financiera profesional</li>
                <li>Servicios de contabilidad o auditoría</li>
              </ul>
              <p>
                <strong>Antes de tomar cualquier decisión financiera importante, consultá con un asesor financiero
                profesional licenciado.</strong> Ahorrin no se hace responsable por decisiones de inversión,
                pérdidas financieras o consecuencias derivadas del uso de la información provista en la plataforma.
              </p>
            </div>
          </section>

          {/* Sección 3: Uso de Extractos Bancarios */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              3. Extractos Bancarios y Datos Sensibles
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong>3.1 Responsabilidad del Usuario</strong>
              </p>
              <p>
                Al subir extractos bancarios o ingresar datos financieros en Ahorrin, vos sos el único responsable de:
              </p>
              <ul className="ml-6 space-y-1">
                <li>La veracidad y exactitud de los datos ingresados</li>
                <li>Mantener la confidencialidad de tus credenciales de acceso</li>
                <li>Asegurarte de cumplir con los términos de servicio de tu banco</li>
                <li>No compartir información sensible como PINs, contraseñas o datos de tarjetas completos</li>
              </ul>

              <p className="mt-4">
                <strong>3.2 Procesamiento de Datos</strong>
              </p>
              <p>
                Los extractos bancarios que subís son procesados automáticamente para:
              </p>
              <ul className="ml-6 space-y-1">
                <li>Extraer transacciones y categorizarlas</li>
                <li>Generar estadísticas y gráficos de tus gastos</li>
                <li>Proveer análisis mediante inteligencia artificial</li>
              </ul>

              <p className="mt-4">
                <strong>3.3 Seguridad</strong>
              </p>
              <p>
                Implementamos medidas de seguridad estándar de la industria, pero ningún sistema es 100% seguro.
                <strong> Nunca guardes datos extremadamente sensibles</strong> como números completos de tarjetas
                de crédito o PINs en la plataforma.
              </p>

              <p className="mt-4">
                <strong>3.4 No Somos un Banco</strong>
              </p>
              <p>
                Ahorrin no es una institución financiera. No tenemos acceso directo a tus cuentas bancarias,
                no podemos realizar transacciones en tu nombre, ni almacenamos tus credenciales bancarias.
              </p>
            </div>
          </section>

          {/* Sección 4: Privacidad y Datos */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Privacidad y Protección de Datos</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong>4.1 Recopilación de Datos</strong>
              </p>
              <p>Recopilamos únicamente los datos necesarios para el funcionamiento de la plataforma:</p>
              <ul className="ml-6 space-y-1">
                <li>Información de cuenta (nombre, email)</li>
                <li>Transacciones financieras ingresadas manualmente o por extracto</li>
                <li>Categorías y reglas de clasificación que creés</li>
                <li>Datos de uso de la plataforma (analytics anónimos)</li>
              </ul>

              <p className="mt-4">
                <strong>4.2 Uso de Datos</strong>
              </p>
              <p>Tus datos se usan exclusivamente para:</p>
              <ul className="ml-6 space-y-1">
                <li>Proveer y mejorar el servicio</li>
                <li>Generar análisis personalizados</li>
                <li>Soporte técnico cuando lo solicités</li>
              </ul>

              <p className="mt-4">
                <strong>4.3 No Vendemos tus Datos</strong>
              </p>
              <p>
                Nunca vendemos, alquilamos ni compartimos tus datos personales con terceros para marketing o publicidad.
              </p>

              <p className="mt-4">
                <strong>4.4 Eliminación de Datos</strong>
              </p>
              <p>
                Podés solicitar la eliminación completa de tu cuenta y todos tus datos en cualquier momento
                desde la sección de configuración.
              </p>
            </div>
          </section>

          {/* Sección 5: Uso Aceptable */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Uso Aceptable de la Plataforma</h2>
            <p className="text-muted-foreground mb-4">
              Al usar Ahorrin, te comprometés a NO:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-6">
              <li>Usar la plataforma para actividades ilegales o fraudulentas</li>
              <li>Intentar acceder sin autorización a otras cuentas o sistemas</li>
              <li>Subir malware, virus o código malicioso</li>
              <li>Automatizar accesos de forma masiva o hacer scraping sin permiso</li>
              <li>Revender o redistribuir el servicio sin autorización</li>
              <li>Suplantar la identidad de otra persona</li>
            </ul>
          </section>

          {/* Sección 6: Disponibilidad del Servicio */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Disponibilidad y Mantenimiento</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                Nos esforzamos por mantener Ahorrin disponible 24/7, pero no garantizamos disponibilidad ininterrumpida.
                Podemos realizar mantenimiento, actualizaciones o suspender temporalmente el servicio sin previo aviso.
              </p>
              <p>
                No nos hacemos responsables por pérdidas o daños causados por interrupciones del servicio.
              </p>
            </div>
          </section>

          {/* Sección 7: Limitación de Responsabilidad */}
          <section className="mb-8 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 p-6 rounded-r-lg">
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Limitación de Responsabilidad</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong>Ahorrin se provee "TAL CUAL" sin garantías de ningún tipo.</strong>
              </p>
              <p>
                En la medida máxima permitida por la ley, Ahorrin no será responsable por:
              </p>
              <ul className="ml-6 space-y-1">
                <li>Pérdidas financieras directas o indirectas</li>
                <li>Errores en la categorización automática de transacciones</li>
                <li>Inexactitudes en análisis o proyecciones generadas por IA</li>
                <li>Pérdida de datos por fallas técnicas</li>
                <li>Decisiones financieras tomadas basándose en la información de la plataforma</li>
                <li>Accesos no autorizados a tu cuenta por negligencia en el manejo de contraseñas</li>
              </ul>
            </div>
          </section>

          {/* Sección 8: Propiedad Intelectual */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Propiedad Intelectual</h2>
            <p className="text-muted-foreground">
              Todo el contenido de Ahorrin (diseño, código, logos, textos) es propiedad de Ahorrin o sus licenciantes.
              Tus datos personales y transacciones te pertenecen a vos, y podés exportarlos o eliminarlos cuando quieras.
            </p>
          </section>

          {/* Sección 9: Modificaciones */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Modificaciones de los Términos</h2>
            <p className="text-muted-foreground">
              Nos reservamos el derecho de modificar estos términos en cualquier momento.
              Los cambios importantes serán notificados por email o mediante un aviso en la plataforma.
              El uso continuo de Ahorrin después de los cambios constituye tu aceptación de los nuevos términos.
            </p>
          </section>

          {/* Sección 10: Ley Aplicable */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Jurisdicción y Ley Aplicable</h2>
            <p className="text-muted-foreground">
              Estos términos se rigen por las leyes de la República Oriental del Uruguay.
              Cualquier disputa será resuelta en los tribunales competentes de Montevideo, Uruguay.
            </p>
          </section>

          {/* Sección 11: Contacto */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">11. Contacto</h2>
            <p className="text-muted-foreground">
              Si tenés preguntas sobre estos términos, podés contactarnos en:{' '}
              <a href="mailto:soporte@ahorrin.app" className="text-primary hover:underline">
                soporte@ahorrin.app
              </a>
            </p>
          </section>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              Al hacer clic en "Crear Cuenta" o "Continuar con Google", confirmás que has leído y aceptado estos términos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
