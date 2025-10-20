-- Chat Conversations and Messages Tables
-- Migration for AI Chat feature with persistence

-- Chat Conversations table
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  mode TEXT DEFAULT 'adaptive' CHECK (mode IN ('quick', 'deep', 'adaptive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'tool')),
  content TEXT NOT NULL,
  tool_calls_metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_chat_conversations_user_id ON public.chat_conversations(user_id);
CREATE INDEX idx_chat_conversations_updated_at ON public.chat_conversations(user_id, updated_at DESC);
CREATE INDEX idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(conversation_id, created_at ASC);

-- Full-text search index for messages (for search functionality)
CREATE INDEX idx_chat_messages_content_search ON public.chat_messages USING gin(to_tsvector('spanish', content));

-- Row Level Security (RLS) Policies
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Conversations policies
CREATE POLICY "Users can view their own conversations" ON public.chat_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations" ON public.chat_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" ON public.chat_conversations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations" ON public.chat_conversations
  FOR DELETE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages in their conversations" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversations
      WHERE id = chat_messages.conversation_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their conversations" ON public.chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_conversations
      WHERE id = chat_messages.conversation_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update messages in their conversations" ON public.chat_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversations
      WHERE id = chat_messages.conversation_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete messages in their conversations" ON public.chat_messages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversations
      WHERE id = chat_messages.conversation_id
      AND user_id = auth.uid()
    )
  );

-- Trigger for updated_at on conversations
CREATE TRIGGER set_updated_at_chat_conversations
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to auto-update last_message_at when new message is added
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chat_conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last_message_at
CREATE TRIGGER update_last_message_at
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_conversation_last_message();

-- Function to generate conversation title from first user message
CREATE OR REPLACE FUNCTION public.generate_conversation_title()
RETURNS TRIGGER AS $$
BEGIN
  -- If title is null and this is a user message, generate title
  IF NEW.role = 'user' THEN
    UPDATE public.chat_conversations
    SET title = LEFT(NEW.content, 60) || CASE WHEN LENGTH(NEW.content) > 60 THEN '...' ELSE '' END
    WHERE id = NEW.conversation_id
    AND title IS NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate title
CREATE TRIGGER auto_generate_title
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.generate_conversation_title();
