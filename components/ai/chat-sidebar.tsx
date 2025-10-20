'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, MessageSquare, Trash2, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { typography } from '@/lib/design-tokens';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Conversation {
  id: string;
  title: string | null;
  mode: 'quick' | 'deep' | 'adaptive';
  created_at: string;
  last_message_at: string;
}

interface ChatSidebarProps {
  currentConversationId?: string;
  onSelectConversation: (id: string | null) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export function ChatSidebar({
  currentConversationId,
  onSelectConversation,
  onClose,
  isMobile = false
}: ChatSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .order('last_message_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteConversation(id: string, e: React.MouseEvent) {
    e.stopPropagation();

    if (!confirm('¿Eliminar esta conversación?')) return;

    try {
      const supabase = createClient();
      await supabase.from('chat_conversations').delete().eq('id', id);

      setConversations(prev => prev.filter(c => c.id !== id));

      if (currentConversationId === id) {
        onSelectConversation(null);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return format(date, 'EEEE', { locale: es });
    return format(date, 'dd MMM', { locale: es });
  }

  const filteredConversations = conversations.filter(conv =>
    conv.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedConversations = filteredConversations.reduce((acc, conv) => {
    const date = formatDate(conv.last_message_at);
    if (!acc[date]) acc[date] = [];
    acc[date].push(conv);
    return acc;
  }, {} as Record<string, Conversation[]>);

  return (
    <div className="flex flex-col h-full bg-surface border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`${typography.h3} text-foreground`}>Conversaciones</h2>
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <button
          onClick={() => {
            onSelectConversation(null);
            onClose?.();
          }}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className={typography.body}>Nueva conversación</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar conversaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary outline-none text-sm"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : Object.keys(groupedConversations).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-3" />
            <p className={`${typography.body} text-muted-foreground`}>
              {searchQuery ? 'No se encontraron conversaciones' : 'No hay conversaciones aún'}
            </p>
            <p className={`${typography.bodySmall} text-muted-foreground mt-1`}>
              Comienza una nueva conversación
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {Object.entries(groupedConversations).map(([date, convs]) => (
              <div key={date}>
                <h3 className={`${typography.bodySmall} text-muted-foreground mb-2 px-2`}>
                  {date}
                </h3>
                <div className="space-y-1">
                  <AnimatePresence>
                    {convs.map((conv) => (
                      <motion.div
                        key={conv.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className={`
                          w-full flex items-start gap-3 p-3 rounded-xl transition-colors group cursor-pointer
                          ${currentConversationId === conv.id
                            ? 'bg-primary/10 ring-1 ring-primary/20'
                            : 'hover:bg-muted'
                          }
                        `}
                        onClick={() => {
                          onSelectConversation(conv.id);
                          onClose?.();
                        }}
                      >
                        <MessageSquare className={`
                          h-4 w-4 mt-0.5 shrink-0
                          ${currentConversationId === conv.id ? 'text-primary' : 'text-muted-foreground'}
                        `} />

                        <div className="flex-1 min-w-0">
                          <p className={`${typography.body} truncate ${
                            currentConversationId === conv.id ? 'text-primary' : 'text-foreground'
                          }`}>
                            {conv.title || 'Nueva conversación'}
                          </p>
                        </div>

                        <button
                          onClick={(e) => deleteConversation(conv.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded-lg transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
