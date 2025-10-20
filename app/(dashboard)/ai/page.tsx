'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef } from 'react';
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
import type { Message } from '@ai-sdk/react';

type ChatMode = 'quick' | 'deep' | 'adaptive';

export default function AIPage() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [mode, setMode] = useState<ChatMode>('adaptive');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [conversationTitle, setConversationTitle] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setInput } = useChat({
    api: '/api/chat',
    body: { conversationId, mode },
    onResponse: (response: Response) => {
      // Get conversation ID from header
      const convId = response.headers.get('X-Conversation-Id');
      if (convId && !conversationId) {
        setConversationId(convId);
        loadConversationTitle(convId);
      }
    },
  });

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
    setInput(prompt);
    // Auto-submit
    setTimeout(() => {
      const form = document.querySelector('form');
      form?.requestSubmit();
    }, 100);
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
    <div className="flex h-[calc(100vh-theme(spacing.16)-theme(spacing.6))]">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block w-80 shrink-0">
        <ChatSidebar
          currentConversationId={conversationId || undefined}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface">
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
            {/* Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-xl">
              {(['quick', 'deep', 'adaptive'] as ChatMode[]).map((m) => {
                const Icon = modeConfig[m].icon;
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all
                      ${mode === m
                        ? 'bg-background shadow-sm ring-1 ring-border'
                        : 'hover:bg-background/50'
                      }
                    `}
                    title={modeConfig[m].label}
                  >
                    <Icon className={`h-4 w-4 ${mode === m ? modeConfig[m].color : 'text-muted-foreground'}`} />
                    <span className={`text-xs ${mode === m ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {modeConfig[m].label}
                    </span>
                  </button>
                );
              })}
            </div>

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
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col items-center justify-center text-center mb-8">
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
            <div className="max-w-4xl mx-auto space-y-6">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'user' ? (
                      <div className="max-w-[80%] rounded-2xl px-5 py-3 bg-primary text-primary-foreground">
                        <p className={typography.body}>{message.content}</p>
                      </div>
                    ) : (
                      <div className="max-w-[85%] space-y-3">
                        <div className="rounded-2xl px-5 py-4 bg-surface ring-1 ring-border">
                          <p className={`${typography.body} whitespace-pre-wrap`}>
                            {message.content}
                          </p>

                          {/* Auto-detect and render charts */}
                          {(() => {
                            const chartData = detectChartData(message.content);
                            return chartData ? (
                              <InlineChart
                                type={chartData.type}
                                data={chartData.data}
                                title={chartData.title}
                              />
                            ) : null;
                          })()}
                        </div>

                        {/* Show tool calls if available */}
                        {(message as any).toolInvocations?.map((tool: any, i: number) => (
                          <ToolCallIndicator
                            key={i}
                            toolName={tool.toolName}
                            status={tool.state === 'result' ? 'complete' : 'loading'}
                            result={tool.state === 'result' ? tool.result : undefined}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-surface ring-1 ring-border rounded-2xl px-5 py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="border-t border-border p-4 bg-surface">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Pregunta sobre tus gastos..."
              disabled={isLoading}
              className="flex-1 px-5 py-3 rounded-xl bg-background ring-1 ring-border focus:ring-2 focus:ring-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
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
