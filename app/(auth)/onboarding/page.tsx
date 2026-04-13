'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Sparkles, ArrowRight, X, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TemplatePackage {
  id: string;
  name: string;
  description: string;
  icon: string;
  author: string;
  rule_count: number;
}

interface TemplateSummary {
  total_rules: number;
  rules_by_category: Record<string, { count: number; type: string }>;
}

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [packages, setPackages] = useState<TemplatePackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [packageSummaries, setPackageSummaries] = useState<Record<string, TemplateSummary>>({});
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoadingPackages(true);

      // Load available packages
      const { data: packagesData, error: packagesError } = await supabase.rpc('get_template_packages');

      if (packagesError) {
        console.warn('Template packages function not found. Using defaults:', packagesError);
        // Set default packages
        setPackages([
          {
            id: 'default',
            name: 'Paquete Base Uruguay',
            description: 'Reglas predefinidas para lugares comunes en Uruguay',
            icon: '🇺🇾',
            author: 'Ahorrin',
            rule_count: 22
          }
        ]);
        setSelectedPackage('default');
      } else if (packagesData && packagesData.length > 0) {
        setPackages(packagesData);
        setSelectedPackage(packagesData[0].id);

        // Load summary for each package
        for (const pkg of packagesData) {
          loadPackageSummary(pkg.id);
        }
      }
    } catch (err) {
      console.error('Error loading packages:', err);
    } finally {
      setLoadingPackages(false);
    }
  };

  const loadPackageSummary = async (packageId: string) => {
    try {
      const { data, error } = await supabase.rpc('get_template_rules_summary', {
        p_package_id: packageId
      });

      if (!error && data && data.length > 0) {
        setPackageSummaries(prev => ({
          ...prev,
          [packageId]: data[0]
        }));
      }
    } catch (err) {
      console.error(`Error loading summary for package ${packageId}:`, err);
    }
  };

  const handleCopyRules = async (packageId: string) => {
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No hay usuario autenticado');

      // Ensure user has "Sin categorizar" category first
      try {
        await supabase.rpc('ensure_uncategorized_category', { p_user_id: user.id });
      } catch (uncatError) {
        console.warn('Could not ensure uncategorized category:', uncatError);
        // Continue anyway - this is not critical
      }

      // Call the function to copy template rules with selected package
      const { data, error: copyError } = await supabase.rpc('copy_template_rules_to_user', {
        p_user_id: user.id,
        p_package_id: packageId
      });

      if (copyError) {
        console.error('Error copying rules:', copyError);

        // If function doesn't exist, show helpful error
        if (copyError.message?.includes('function') || copyError.code === '42883') {
          setError('⚠️ La función de copiar reglas no está disponible. Por favor ejecuta las migraciones SQL primero (ver START_HERE.md en supabase/migrations).');
          setLoading(false);
          return;
        }

        throw copyError;
      }

      if (data && data.length > 0) {
        const result = data[0];
        console.log('Rules copied:', result);
      }

      // Redirect to dashboard
      router.push('/upload');
    } catch (err: any) {
      setError(err.message || 'Error al copiar reglas');
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Ensure user has "Sin categorizar" category
        try {
          await supabase.rpc('ensure_uncategorized_category', { p_user_id: user.id });
        } catch (uncatError) {
          console.warn('Could not ensure uncategorized category:', uncatError);
          // Continue anyway - this is not critical
        }
      }

      router.push('/upload');
    } catch (err) {
      console.error('Error during skip:', err);
      router.push('/upload'); // Continue anyway
    }
  };

  if (loadingPackages) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-success/10 p-4">
        <div className="w-full max-w-4xl">
          <Card className="p-8">
            {/* Skeleton Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div className="h-8 bg-muted animate-pulse rounded-lg w-64 mx-auto mb-2" />
              <div className="h-4 bg-muted animate-pulse rounded-lg w-48 mx-auto" />
            </div>

            {/* Skeleton Package Cards */}
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              {[1, 2].map((i) => (
                <Card key={i} className="p-6 border-2 border-border">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-muted animate-pulse rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-muted animate-pulse rounded w-3/4" />
                      <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-4 bg-muted animate-pulse rounded mb-4" />
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                    <div className="h-2 bg-muted animate-pulse rounded" />
                    <div className="h-2 bg-muted animate-pulse rounded" />
                  </div>
                </Card>
              ))}
            </div>

            {/* Skeleton Buttons */}
            <div className="flex gap-4">
              <div className="flex-1 h-10 bg-muted animate-pulse rounded-lg" />
              <div className="w-48 h-10 bg-muted animate-pulse rounded-lg" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-success/10 p-4">
      <div className="w-full max-w-4xl">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              ¡Bienvenido a Ahorrin! 👋
            </h1>
            <p className="text-muted-foreground">
              Elige un paquete de reglas para empezar rápidamente
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-3 rounded-lg bg-error/10 border border-error text-error text-sm flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

        <div className="space-y-6">
          {/* Package Options */}
          <div className="grid gap-4 md:grid-cols-2">
            {packages.map((pkg, index) => {
              const summary = packageSummaries[pkg.id];
              const isSelected = selectedPackage === pkg.id;

              return (
                <div key={pkg.id}>
                  <Card
                    className={`p-6 cursor-pointer transition-all h-full ${
                      isSelected
                        ? 'border-2 border-primary ring-2 ring-primary/20'
                        : 'border-2 border-border hover:border-primary/40'
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="text-3xl">{pkg.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        {pkg.name}
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        por {pkg.author}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {pkg.description}
                  </p>

                  {summary ? (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs font-medium text-foreground mb-2">
                        📋 {summary.total_rules} reglas incluidas:
                      </p>
                      <div className="grid grid-cols-2 gap-1">
                        {Object.entries(summary.rules_by_category || {})
                          .slice(0, 6)
                          .map(([category, info]) => (
                            <div
                              key={category}
                              className="text-xs text-muted-foreground flex items-center gap-1"
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  info.type === 'expense' ? 'bg-error' : 'bg-success'
                                }`}
                              />
                              {category} ({info.count})
                            </div>
                          ))}
                      </div>
                      {Object.keys(summary.rules_by_category || {}).length > 6 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          ... y {Object.keys(summary.rules_by_category || {}).length - 6} más
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">
                        {pkg.rule_count} reglas de auto-categorización
                      </p>
                    </div>
                  )}
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => selectedPackage && handleCopyRules(selectedPackage)}
              disabled={loading || !selectedPackage}
              className="flex-1"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Configurando...
                </>
              ) : (
                <>
                  Usar Paquete Seleccionado
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleSkip}
              disabled={loading}
              size="lg"
            >
              Empezar desde Cero
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            💡 Tip: Puedes modificar o eliminar las reglas en cualquier momento desde Configuración
          </p>
        </div>
      </Card>
      </div>
    </div>
  );
}
