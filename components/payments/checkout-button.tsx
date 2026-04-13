'use client';

import { useState } from 'react';
import { Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CheckoutButtonProps {
  planId: string;
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function CheckoutButton({ planId, className, children, variant = 'default', size = 'md' }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();

      if (data.error) {
        if (data.error === 'No autenticado') {
          window.location.href = '/login?redirect=/pricing';
          return;
        }
        alert(data.error);
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error al iniciar el pago. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      className={`font-semibold ${sizeClasses[size]} ${className || ''}`}
      variant={variant}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : (
        <Zap className="w-4 h-4 mr-2" />
      )}
      {children || 'Pasate a Pro'}
    </Button>
  );
}
