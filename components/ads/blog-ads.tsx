import { AdSense } from './adsense';

// Ad slots - AdSense auto-creates these when you enable "Auto ads"
// Or create manual ad units at: https://www.google.com/adsense → Ads → By ad unit
// For now, using a single auto slot works fine - AdSense handles sizing
const AD_SLOT = process.env.NEXT_PUBLIC_ADSENSE_AD_SLOT || '1234567890';

export function BlogAdTop() {
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
  return (
    <AdSense
      slot={AD_SLOT}
      format="rectangle"
      className="w-full min-h-[250px]"
    />
  );
}

export function BlogAdInContent() {
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
