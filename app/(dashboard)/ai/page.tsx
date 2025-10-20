'use client';

import { useChat, type UIMessage } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  Loader2,
  Menu,
  Download,
  Zap,
  Brain,
  GitMerge
} from 'lucide-react';
import { typography } from '@/lib/design-tokens';
import { createClient } from '@/lib/supabase/client';
import { ChatSidebar } from '@/components/ai/chat-sidebar';
import { SuggestedPrompts } from '@/components/ai/suggested-prompts';
import { ToolCallIndicator } from '@/components/ai/tool-call-indicator';
import { InlineChart } from '@/components/ai/inline-chart';
import { ExportDialog } from '@/components/ai/export-dialog';

type ChatMode = 'quick' | 'deep' | 'adaptive';

// Simple markdown renderer for bold text
function MarkdownText({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.slice(2, -2);
          return <strong key={idx} className="font-semibold text-foreground">{boldText}</strong>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </>
  );
}

// Render auto-summary with better UX
function AutoSummaryRenderer({ summary }: { summary: string }) {
  const lines = summary.split('\n');

  return (
    <div className="space-y-2 text-sm">
      {lines.map((line, idx) => {
        // Headers (lines starting with emojis and **)
        if (line.match(/^.*[📊📈💡✨🔄📅📁🏪💰⚖️🏦🔍].*/)) {
          return (
            <div key={idx} className="pt-2 first:pt-0">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <MarkdownText text={line} />
              </h3>
            </div>
          );
        }

        // Bullet points
        if (line.trim().startsWith('•')) {
          return (
            <div key={idx} className="flex gap-2 pl-2">
              <span className="text-primary shrink-0 text-xs">•</span>
              <div className="flex-1 text-sm">
                <MarkdownText text={line.replace('•', '').trim()} />
              </div>
            </div>
          );
        }

        // Numbered lists
        if (line.match(/^\d+\./)) {
          return (
            <div key={idx} className="flex gap-2 pl-2">
              <span className="text-primary font-semibold shrink-0 text-sm">
                {line.match(/^\d+/)?.[0]}.
              </span>
              <div className="flex-1 text-sm">
                <MarkdownText text={line.replace(/^\d+\./, '').trim()} />
              </div>
            </div>
          );
        }

        // Indented content (month details)
        if (line.startsWith('  ')) {
          return (
            <div key={idx} className="pl-4 text-xs text-muted-foreground">
              <MarkdownText text={line.trim()} />
            </div>
          );
        }

        // Regular paragraphs
        if (line.trim()) {
          return (
            <div key={idx} className="text-sm text-foreground/90 leading-relaxed">
              <MarkdownText text={line} />
            </div>
          );
        }

        // Empty lines (spacing)
        return <div key={idx} className="h-1" />;
      })}
    </div>
  );
}

export default function AIPage() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [mode, setMode] = useState<ChatMode>('adaptive');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [conversationTitle, setConversationTitle] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(() => new DefaultChatTransport({
    api: '/api/chat',
    body: { conversationId, mode },
  }), [conversationId, mode]);

  const { messages, status, error, sendMessage } = useChat({
    transport,
    onError: (error) => {
      console.error('Chat error:', error);
    },
    onFinish: ({ response }: any) => {
      // Get conversation ID from response headers if available
      if (response?.headers) {
        const convId = response.headers.get?.('X-Conversation-Id');
        if (convId && !conversationId) {
          setConversationId(convId);
          loadConversationTitle(convId);
        }
      }
    },
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (conversationId) {
      loadConversationTitle(conversationId);
      loadMessages(conversationId);
    }
  }, [conversationId]);

  async function loadConversationTitle(convId: string) {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('chat_conversations')
        .select('title')
        .eq('id', convId)
        .single();

      if (data?.title) {
        setConversationTitle(data.title);
      }
    } catch (error) {
      console.error('Error loading title:', error);
    }
  }

  async function loadMessages(convId: string) {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      // Note: In a full implementation, you'd populate the messages array here
      // For now, useChat handles message state
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }

  function handleSelectConversation(id: string | null) {
    setConversationId(id);
    setConversationTitle(null);
    // Clear current messages when selecting new conversation
    // In a full implementation, you'd reload messages for the selected conversation
  }

  function handlePromptSelect(prompt: string) {
    // Send message directly using sendMessage
    sendMessage({ text: prompt });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage({ text: input });
    setInput('');
  }

  function detectChartData(content: string): { type: 'line' | 'bar' | 'pie', data: any[], title: string } | null {
    // Simple detection for demo - in production, this would parse tool results
    if (content.includes('tendencia') || content.includes('mes a mes')) {
      // Mock line chart data
      return {
        type: 'line',
        data: [
          { month: 'Ene', expenses: 45000, income: 60000 },
          { month: 'Feb', expenses: 52000, income: 60000 },
          { month: 'Mar', expenses: 48000, income: 65000 },
        ],
        title: 'Tendencia de gastos e ingresos'
      };
    }

    if (content.includes('categoría') && content.includes('total')) {
      // Mock pie chart data
      return {
        type: 'pie',
        data: [
          { name: 'Comida', amount: 15000 },
          { name: 'Transporte', amount: 8000 },
          { name: 'Servicios', amount: 12000 },
        ],
        title: 'Distribución por categoría'
      };
    }

    return null;
  }

  const modeConfig = {
    quick: { icon: Zap, label: 'Rápido', color: 'text-yellow-500' },
    deep: { icon: Brain, label: 'Profundo', color: 'text-purple-500' },
    adaptive: { icon: GitMerge, label: 'Adaptativo', color: 'text-blue-500' },
  };

  const ModeIcon = modeConfig[mode].icon;

  return (
    <div className="fixed inset-0 top-16 flex overflow-hidden bg-background">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block w-80 shrink-0">
        <ChatSidebar
          currentConversationId={conversationId || undefined}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-surface shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h1 className={typography.h2}>
                {conversationTitle || 'Asistente AI'}
              </h1>
              <p className={`${typography.bodySmall} text-muted-foreground`}>
                Análisis financiero inteligente
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Export Button */}
            {messages.length > 0 && (
              <button
                onClick={() => setExportDialogOpen(true)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Exportar conversación"
              >
                <Download className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive">
            <p className="text-sm font-medium">Error al comunicarse con el asistente</p>
            <p className="text-xs mt-1">Por favor, intenta de nuevo más tarde.</p>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2">
          {messages.length === 0 ? (
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col items-center justify-center text-center mb-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/20 mb-4">
                  <Sparkles className="h-12 w-12 text-primary" />
                </div>
                <h2 className={`${typography.h2} mb-2`}>
                  ¿En qué puedo ayudarte hoy?
                </h2>
                <p className={`${typography.body} text-muted-foreground max-w-md`}>
                  Pregunta sobre tus gastos, analiza tendencias o obtén recomendaciones financieras
                </p>
              </div>

              <SuggestedPrompts
                onSelectPrompt={handlePromptSelect}
                isLoading={isLoading}
              />
            </div>
          ) : (
            <div className="max-w-5xl mx-auto space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => {
                  // Extract text parts
                  const textParts = message.parts?.filter((p: any) => p.type === 'text') || [];
                  const textContent = textParts.map((p: any) => p.text).join('');

                  // Extract tool parts (format: "tool-{toolName}")
                  const toolParts = message.parts?.filter((p: any) =>
                    p.type?.startsWith('tool-')
                  ) || [];

                  // Check if still processing - use global status for latest message
                  const isLatestMessage = index === messages.length - 1;
                  const isProcessing = isLatestMessage && (status === 'submitted' || status === 'streaming');

                  // Generate automatic summary from tool results if no text
                  const generateSummary = (tools: any[]): string | null => {
                    if (tools.length === 0) return null;

                    const tool = tools[0]; // Get first tool result
                    const output = tool.output;

                    if (!output) return null;

                    // Category Summary
                    if (output.categorySummary && Array.isArray(output.categorySummary)) {
                      const top5 = output.categorySummary.slice(0, 5);
                      const total = output.total || top5.reduce((sum: number, c: any) => sum + c.amount, 0);

                      let summary = `Aquí están tus top 5 categorías de gasto:\n\n`;
                      top5.forEach((cat: any, idx: number) => {
                        summary += `${idx + 1}. **${cat.name}**: $${cat.amount.toFixed(2)} (${cat.count} transacciones)\n`;
                      });
                      summary += `\n**Total**: $${total.toFixed(2)}`;
                      return summary;
                    }

                    // Budget Analysis
                    if (output.message && output.budgets !== undefined) {
                      return output.message;
                    }

                    // Comparison
                    if (output.comparison && output.period1 && output.period2) {
                      const p1 = output.period1;
                      const p2 = output.period2;
                      const changes = output.changes;

                      return `Comparación de períodos:\n\n` +
                        `**${p1.label}**: $${p1.totalExpenses.toFixed(2)} en gastos (${p1.transactionCount} transacciones)\n` +
                        `**${p2.label}**: $${p2.totalExpenses.toFixed(2)} en gastos (${p2.transactionCount} transacciones)\n\n` +
                        `Cambio en gastos: ${changes.expensesChange > 0 ? '+' : ''}${changes.expensesChange.toFixed(1)}%`;
                    }

                    // Predictions & Insights
                    if (output.predictions || output.insights || output.recommendations) {
                      let summary = '';

                      if (output.predictions) {
                        summary += `**📊 Predicción para el próximo mes:**\n`;
                        summary += `Gasto estimado: $${output.predictions.nextMonthExpenses?.toFixed(2) || 'N/A'}\n`;
                        summary += `Tendencia: ${output.predictions.trend === 'stable' ? '📈 Estable' : output.predictions.trend}\n\n`;
                      }

                      if (output.insights && output.insights.length > 0) {
                        summary += `**💡 Insights:**\n`;
                        output.insights.forEach((insight: string) => {
                          summary += `• ${insight}\n`;
                        });
                        summary += '\n';
                      }

                      if (output.recommendations && output.recommendations.length > 0) {
                        summary += `**✨ Recomendaciones:**\n`;
                        output.recommendations.forEach((rec: string) => {
                          summary += `• ${rec}\n`;
                        });
                      }

                      return summary.trim();
                    }

                    // Recurring Transactions
                    if (output.recurringTransactions && Array.isArray(output.recurringTransactions)) {
                      const recurring = output.recurringTransactions;
                      let summary = `**🔄 Gastos Recurrentes Detectados:**\n\n`;

                      if (recurring.length === 0) {
                        summary += 'No se detectaron gastos recurrentes.\n';
                      } else {
                        recurring.forEach((tx: any, idx: number) => {
                          summary += `${idx + 1}. **${tx.vendor}**\n`;
                          summary += `   • Promedio: $${tx.amount.toFixed(2)}\n`;
                          summary += `   • Frecuencia: ${tx.frequency} veces\n`;
                          summary += `   • Última vez: ${tx.lastDate}\n`;
                          if (idx < recurring.length - 1) summary += '\n';
                        });

                        if (output.totalMonthlyEstimate) {
                          summary += `\n\n**💰 Total estimado mensual:** $${output.totalMonthlyEstimate.toFixed(2)}`;
                        }
                      }

                      return summary;
                    }

                    // GENERIC FALLBACK for any other tool output
                    // Extract the tool name for context
                    const toolName = tool.type?.replace('tool-', '') || 'herramienta';
                    const toolLabels: Record<string, string> = {
                      'getTransactionsByCategory': '📁 Transacciones por Categoría',
                      'getTransactionsByDateRange': '📅 Transacciones por Fecha',
                      'getCategorySummary': '📊 Resumen de Categorías',
                      'getTrendAnalysis': '📈 Análisis de Tendencias',
                      'getSpendingByVendor': '🏪 Gastos por Comercio',
                      'getBudgetAnalysis': '💰 Análisis de Presupuesto',
                      'getAccountsSummary': '🏦 Resumen de Cuentas',
                      'searchTransactions': '🔍 Búsqueda de Transacciones',
                      'comparePeriodsAnalysis': '⚖️ Comparación de Períodos',
                    };

                    // Handle errors first
                    if (output.error) {
                      return `❌ **Error:** ${output.error}\n\nPor favor intenta de nuevo o reformula tu pregunta.`;
                    }

                    let summary = `**${toolLabels[toolName] || '📊 Datos'}:**\n\n`;

                    // Handle arrays
                    if (Array.isArray(output)) {
                      if (output.length === 0) {
                        summary += 'No se encontraron resultados.\n';
                      } else {
                        summary += `Se encontraron ${output.length} resultados.\n\n`;
                        output.slice(0, 5).forEach((item: any, idx: number) => {
                          summary += `${idx + 1}. `;
                          if (item.vendor) summary += `**${item.vendor}** `;
                          if (item.name) summary += `**${item.name}** `;
                          if (item.amount !== undefined) summary += `$${item.amount.toFixed(2)}`;
                          if (item.date) summary += ` (${item.date})`;
                          summary += '\n';
                        });
                        if (output.length > 5) {
                          summary += `\n...y ${output.length - 5} más.\n`;
                        }
                      }
                      return summary;
                    }

                    // Handle objects with common properties
                    if (typeof output === 'object') {
                      // Check for transactions property
                      if (output.transactions && Array.isArray(output.transactions)) {
                        summary += `Se encontraron ${output.transactions.length} transacciones.\n`;
                        if (output.summary) {
                          if (output.summary.total !== undefined) {
                            summary += `**Total:** $${output.summary.total.toFixed(2)}\n`;
                          }
                          if (output.summary.count !== undefined) {
                            summary += `**Cantidad:** ${output.summary.count}\n`;
                          }
                          if (output.summary.average !== undefined) {
                            summary += `**Promedio:** $${output.summary.average.toFixed(2)}\n`;
                          }
                        }
                        return summary;
                      }

                      // Check for monthlyData (trends)
                      if (output.monthlyData && Array.isArray(output.monthlyData)) {
                        const hasExpenses = output.monthlyData.some((m: any) => m.totalExpenses > 0);
                        const hasIncome = output.monthlyData.some((m: any) => m.totalIncome > 0);

                        summary += `He analizado tus últimos ${output.monthlyData.length} meses de actividad financiera.\n\n`;
                        summary += `**📊 Tendencia Mensual:**\n\n`;

                        output.monthlyData.forEach((month: any) => {
                          summary += `**${month.month}**\n`;
                          if (month.totalExpenses !== undefined && month.totalExpenses > 0) {
                            summary += `  💸 Gastos: $${month.totalExpenses.toFixed(2)}`;
                            if (month.transactionCount) summary += ` (${month.transactionCount} transacciones)`;
                            summary += '\n';
                          }
                          if (month.totalIncome !== undefined && month.totalIncome > 0) {
                            summary += `  💰 Ingresos: $${month.totalIncome.toFixed(2)}\n`;
                          }
                          if (month.balance !== undefined) {
                            const sign = month.balance >= 0 ? '+' : '';
                            summary += `  📊 Balance: ${sign}$${month.balance.toFixed(2)}\n`;
                          }
                          summary += '\n';
                        });

                        if (output.trends) {
                          summary += `**📈 Análisis de Tendencias:**\n\n`;
                          if (output.trends.averageExpenses) {
                            summary += `• Promedio mensual de gastos: $${output.trends.averageExpenses.toFixed(2)}\n`;
                          }
                          if (output.trends.averageIncome) {
                            summary += `• Promedio mensual de ingresos: $${output.trends.averageIncome.toFixed(2)}\n`;
                          }
                          if (output.trends.currentVsPrevious) {
                            const trend = output.trends.currentVsPrevious;
                            if (trend.expenseChange !== undefined) {
                              const emoji = trend.expenseChange > 0 ? '📈' : '📉';
                              summary += `• Cambio en gastos vs mes anterior: ${emoji} ${trend.expenseChange > 0 ? '+' : ''}${trend.expenseChange.toFixed(1)}%\n`;
                            }
                            if (trend.incomeChange !== undefined) {
                              const emoji = trend.incomeChange > 0 ? '📈' : '📉';
                              summary += `• Cambio en ingresos vs mes anterior: ${emoji} ${trend.incomeChange > 0 ? '+' : ''}${trend.incomeChange.toFixed(1)}%\n`;
                            }
                          }
                        }

                        summary += `\nEsta tendencia te ayuda a identificar patrones en tus finanzas y planificar mejor tu presupuesto.`;
                        return summary;
                      }

                      // Check for topVendors
                      if (output.topVendors && Array.isArray(output.topVendors)) {
                        summary += `**🏪 Top Comercios:**\n\n`;
                        output.topVendors.slice(0, 5).forEach((vendor: any, idx: number) => {
                          summary += `${idx + 1}. **${vendor.vendor}**\n`;
                          summary += `   • Total: $${vendor.total.toFixed(2)}\n`;
                          summary += `   • Transacciones: ${vendor.count}\n`;
                          summary += `   • Promedio: $${vendor.average.toFixed(2)}\n\n`;
                        });
                        return summary;
                      }

                      // Generic object - show key values
                      summary += 'Datos obtenidos:\n\n';
                      Object.entries(output).forEach(([key, value]) => {
                        if (typeof value === 'number') {
                          summary += `• **${key}:** ${value.toFixed(2)}\n`;
                        } else if (typeof value === 'string') {
                          summary += `• **${key}:** ${value}\n`;
                        } else if (Array.isArray(value)) {
                          summary += `• **${key}:** ${value.length} items\n`;
                        }
                      });
                      return summary;
                    }

                    return null;
                  };

                  const autoSummary = !textContent && toolParts.length > 0 && !isProcessing
                    ? generateSummary(toolParts)
                    : null;

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'user' ? (
                        <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-primary text-primary-foreground">
                          <p className={typography.body}>{textContent}</p>
                        </div>
                      ) : (
                        <div className="max-w-[90%] space-y-3">
                          {/* Show tool calls */}
                          {toolParts.map((tool: any, i: number) => {
                            const toolName = tool.type?.replace('tool-', '') || 'Unknown';
                            return (
                              <ToolCallIndicator
                                key={i}
                                toolName={toolName}
                                status={tool.state === 'output-available' ? 'complete' : 'loading'}
                                result={tool.output}
                              />
                            );
                          })}

                          {/* Show text response or generate summary */}
                          {(textContent || autoSummary || isProcessing || (!textContent && toolParts.length > 0)) && (
                            <div className="rounded-2xl px-4 py-3 bg-surface ring-1 ring-border">
                              {textContent ? (
                                <>
                                  <p className={`${typography.body} whitespace-pre-wrap`}>
                                    {textContent}
                                  </p>
                                  {/* Auto-detect and render charts */}
                                  {(() => {
                                    const chartData = detectChartData(textContent);
                                    return chartData ? (
                                      <InlineChart
                                        type={chartData.type}
                                        data={chartData.data}
                                        title={chartData.title}
                                      />
                                    ) : null;
                                  })()}
                                </>
                              ) : autoSummary ? (
                                <div className="space-y-3">
                                  <AutoSummaryRenderer summary={autoSummary} />
                                  <div className="pt-2 mt-3 border-t border-border/50">
                                    <p className="text-xs text-muted-foreground italic flex items-center gap-1.5">
                                      <Sparkles className="h-3 w-3" />
                                      Resumen generado automáticamente
                                    </p>
                                  </div>
                                </div>
                              ) : isProcessing ? (
                                <div className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                  <span className={`${typography.bodySmall} text-muted-foreground`}>
                                    Generando respuesta...
                                  </span>
                                </div>
                              ) : toolParts.length > 0 ? (
                                <p className={`${typography.body} text-muted-foreground italic`}>
                                  ℹ️ Los datos están disponibles arriba. Haz clic en las flechas para expandir los detalles.
                                </p>
                              ) : null}
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-surface ring-1 ring-border rounded-2xl px-4 py-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="border-t border-border p-3 bg-surface shrink-0">
          <form onSubmit={handleSubmit} className="max-w-5xl mx-auto flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre tus gastos..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-background ring-1 ring-border focus:ring-2 focus:ring-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input?.trim()}
              className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-surface">
            <ChatSidebar
              currentConversationId={conversationId || undefined}
              onSelectConversation={handleSelectConversation}
              onClose={() => setSidebarOpen(false)}
              isMobile
            />
          </div>
        </div>
      )}

      {/* Export Dialog */}
      <ExportDialog
        isOpen={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        messages={messages}
        conversationTitle={conversationTitle || undefined}
      />
    </div>
  );
}
