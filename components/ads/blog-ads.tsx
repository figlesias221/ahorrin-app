import { AdSense } from './adsense';

// Sin un slot real configurado no renderizamos nada: un <ins> vacío reserva
// espacio muerto arriba del artículo y sirve un slot inexistente al crawler.
const AD_SLOT = process.env.NEXT_PUBLIC_ADSENSE_AD_SLOT;

export function BlogAdTop() {
  if (!AD_SLOT) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
      <AdSense
        slot={AD_SLOT}
        format="horizontal"
        className="w-full min-h-[90px]"
      />
    </div>
  );
}

export function BlogAdSidebar() {
  if (!AD_SLOT) return null;

  return (
    <AdSense
      slot={AD_SLOT}
      format="rectangle"
      className="w-full min-h-[250px]"
    />
  );
}

export function BlogAdInContent() {
  if (!AD_SLOT) return null;

  return (
    <div className="my-8">
      <AdSense
        slot={AD_SLOT}
        format="auto"
        className="w-full min-h-[250px]"
      />
    </div>
  );
}

export function BlogAdBottom() {
  if (!AD_SLOT) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-6">
      <AdSense
        slot={AD_SLOT}
        format="horizontal"
        className="w-full min-h-[90px]"
      />
    </div>
  );
}
