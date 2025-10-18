'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    quote:
      'Gasty gives us the clarity that spreadsheets never could. I know exactly how every peso is working for me.',
    name: 'Jordan Kim',
    role: 'Product Manager & early adopter',
  },
  {
    quote:
      'Set the rules once, and the system learns alongside you. It has completely transformed how I budget.',
    name: 'Alexis Hernández',
    role: 'Founder, boutique agency',
  },
];

const metrics = [
  { value: '$240M', label: 'Transactions tracked and optimized' },
  { value: '32%', label: 'Average improvement in monthly savings' },
  { value: '4.8/5', label: 'Customer satisfaction from 127 reviews' },
];

const partnerLogos = ['BBVA', 'Scotia', 'Itaú', 'Santander'];

export function SocialProof() {
  return (
    <section id="social-proof" className="bg-card/30 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/80">
              Trusted results
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Built with trust at the core.
            </h2>
            <p className="mt-4 text-base ">
              From bank-grade security to advisor-level insights, thousands of teams rely on Gasty to keep their finances crystal clear and future-ready.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.1 }}
                  className="rounded-2xl border border-border/40 bg-card/80 p-6 backdrop-blur"
                >
                  <div className="text-3xl font-semibold text-foreground">
                    {metric.value}
                  </div>
                  <p className="mt-2 text-sm ">
                    {metric.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
              >
                <Card className="border-border/40 bg-card/90 backdrop-blur">
                  <CardContent className="space-y-4 p-6">
                    <Quote className="h-6 w-6 text-primary" aria-hidden="true" />
                    <p className="text-base leading-relaxed text-foreground">
                      “{testimonial.quote}”
                    </p>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-xs uppercase tracking-[0.2em] ">
                        {testimonial.role}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-warning">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star
                          key={`${testimonial.name}-star-${starIndex}`}
                          className="h-4 w-4 fill-warning text-warning"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border/40 bg-card/70 px-6 py-4 text-xs font-medium uppercase tracking-[0.3em] ">
              {partnerLogos.map((logo) => (
                <span key={logo} className="flex h-10 w-20 items-center justify-center rounded-full bg-card text-[0.75rem] ">
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
