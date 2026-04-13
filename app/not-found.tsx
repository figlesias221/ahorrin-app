import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Pagina no encontrada</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        La pagina que buscas no existe o fue movida.
      </p>
      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Ir al Dashboard
        </Link>
        <Link
          href="/"
          className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
        >
          Ir al Inicio
        </Link>
      </div>
    </div>
  );
}
