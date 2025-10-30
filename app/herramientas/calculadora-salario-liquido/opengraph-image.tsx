import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Calculadora de Salario Líquido Uruguay 2025 - IRPF, BPS, Fonasa';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)',
          position: 'relative',
        }}
      >
        {/* Grid pattern background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `repeating-linear-gradient(0deg, rgba(16, 185, 129, 0.05) 0px, transparent 1px, transparent 40px),
                              repeating-linear-gradient(90deg, rgba(16, 185, 129, 0.05) 0px, transparent 1px, transparent 40px)`,
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 60px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              padding: '12px 24px',
              borderRadius: '999px',
              marginBottom: '32px',
            }}
          >
            <span
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#065f46',
                letterSpacing: '0.5px',
              }}
            >
              ✅ ACTUALIZADO 2025
            </span>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 900,
              color: '#111827',
              textAlign: 'center',
              lineHeight: 1.2,
              margin: '0 0 24px 0',
              maxWidth: '1000px',
            }}
          >
            ¿Cuánto te queda después de impuestos?
          </h1>

          {/* Subtitle with gradient */}
          <div
            style={{
              fontSize: '48px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              textAlign: 'center',
              margin: '0 0 40px 0',
            }}
          >
            Calculá tu salario líquido
          </div>

          {/* Example calculation card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'white',
              padding: '32px 48px',
              borderRadius: '24px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
              width: '900px',
              marginBottom: '40px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '20px',
                  color: '#6b7280',
                  marginBottom: '8px',
                }}
              >
                Salario Nominal
              </span>
              <span
                style={{
                  fontSize: '56px',
                  fontWeight: 900,
                  color: '#111827',
                }}
              >
                $80,000
              </span>
            </div>

            <div
              style={{
                fontSize: '64px',
                color: '#10b981',
                fontWeight: 700,
              }}
            >
              →
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '20px',
                  color: '#6b7280',
                  marginBottom: '8px',
                }}
              >
                Salario Líquido
              </span>
              <span
                style={{
                  fontSize: '56px',
                  fontWeight: 900,
                  color: '#10b981',
                }}
              >
                $65,100
              </span>
            </div>
          </div>

          {/* Features badges */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            {['IRPF 2025', 'BPS 15%', 'Fonasa 3-6%'].map((feature) => (
              <div
                key={feature}
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#065f46',
                }}
              >
                {feature}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                fontWeight: 800,
                color: '#10b981',
              }}
            >
              Ahorrin
            </div>
            <div
              style={{
                fontSize: '24px',
                color: '#6b7280',
              }}
            >
              • www.ahorrin.app
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(20, 184, 166, 0.3))',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.3), rgba(16, 185, 129, 0.3))',
            filter: 'blur(60px)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
