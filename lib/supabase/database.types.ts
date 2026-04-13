// Auto-generated types for Supabase tables
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          color: string
          icon: string | null
          type: 'expense' | 'income'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          color?: string
          icon?: string | null
          type: 'expense' | 'income'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          color?: string
          icon?: string | null
          type?: 'expense' | 'income'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      accounts: {
        Row: {
          id: string
          user_id: string
          name: string
          bank: string
          account_number: string | null
          currency: string
          initial_balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          bank: string
          account_number?: string | null
          currency?: string
          initial_balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          bank?: string
          account_number?: string | null
          currency?: string
          initial_balance?: number
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          account_id: string | null
          category_id: string
          date: string
          vendor: string
          description: string | null
          amount: number
          type: 'expense' | 'income'
          currency: string
          bank: string | null
          confidence_score: number | null
          is_manually_verified: boolean
          is_ignored: boolean
          notes: string | null
          installment_group_id: string | null
          installment_number: number | null
          installment_total: number | null
          original_amount: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id?: string | null
          category_id: string
          date: string
          vendor: string
          description?: string | null
          amount: number
          type: 'expense' | 'income'
          currency?: string
          bank?: string | null
          confidence_score?: number | null
          is_manually_verified?: boolean
          is_ignored?: boolean
          notes?: string | null
          installment_group_id?: string | null
          installment_number?: number | null
          installment_total?: number | null
          original_amount?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_id?: string | null
          category_id?: string
          date?: string
          vendor?: string
          description?: string | null
          amount?: number
          type?: 'expense' | 'income'
          currency?: string
          bank?: string | null
          confidence_score?: number | null
          is_manually_verified?: boolean
          is_ignored?: boolean
          notes?: string | null
          installment_group_id?: string | null
          installment_number?: number | null
          installment_total?: number | null
          original_amount?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          category_id: string
          amount: number
          period: 'monthly' | 'yearly'
          start_date: string
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          amount: number
          period: 'monthly' | 'yearly'
          start_date: string
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          amount?: number
          period?: 'monthly' | 'yearly'
          start_date?: string
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categorization_rules: {
        Row: {
          id: string
          user_id: string
          vendor_pattern: string
          amount_min: number | null
          amount_max: number | null
          category_id: string
          priority: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vendor_pattern: string
          amount_min?: number | null
          amount_max?: number | null
          category_id: string
          priority?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vendor_pattern?: string
          amount_min?: number | null
          amount_max?: number | null
          category_id?: string
          priority?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bank_statements: {
        Row: {
          id: string
          user_id: string
          account_id: string | null
          file_path: string
          file_name: string
          upload_date: string
          period_start: string | null
          period_end: string | null
          status: 'processing' | 'completed' | 'failed'
          transactions_count: number
          format: string | null
          bank: string | null
          currency: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id?: string | null
          file_path: string
          file_name: string
          upload_date?: string
          period_start?: string | null
          period_end?: string | null
          status?: 'processing' | 'completed' | 'failed'
          transactions_count?: number
          format?: string | null
          bank?: string | null
          currency?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_id?: string | null
          file_path?: string
          file_name?: string
          upload_date?: string
          period_start?: string | null
          period_end?: string | null
          status?: 'processing' | 'completed' | 'failed'
          transactions_count?: number
          format?: string | null
          bank?: string | null
          currency?: string | null
          created_at?: string
        }
      }
      custom_banks: {
        Row: {
          id: string
          user_id: string
          name: string
          display_name: string
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          display_name: string
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          display_name?: string
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      chat_conversations: {
        Row: {
          id: string
          user_id: string
          title: string | null
          mode: 'quick' | 'deep' | 'adaptive'
          created_at: string
          updated_at: string
          last_message_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          mode?: 'quick' | 'deep' | 'adaptive'
          created_at?: string
          updated_at?: string
          last_message_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          mode?: 'quick' | 'deep' | 'adaptive'
          created_at?: string
          updated_at?: string
          last_message_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant' | 'system' | 'tool'
          content: string
          tool_calls_metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: 'user' | 'assistant' | 'system' | 'tool'
          content: string
          tool_calls_metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: 'user' | 'assistant' | 'system' | 'tool'
          content?: string
          tool_calls_metadata?: Json | null
          created_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          name: string
          price_uyu: number
          price_usd: number
          interval: 'monthly' | 'yearly' | 'lifetime'
          features: Json
          limits: Json
          is_active: boolean
          created_at: string
        }
        Insert: {
          id: string
          name: string
          price_uyu?: number
          price_usd?: number
          interval?: 'monthly' | 'yearly' | 'lifetime'
          features?: Json
          limits?: Json
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          price_uyu?: number
          price_usd?: number
          interval?: 'monthly' | 'yearly' | 'lifetime'
          features?: Json
          limits?: Json
          is_active?: boolean
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          status: 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_start: string
          current_period_end: string
          cancel_at_period_end: boolean
          payment_provider: string | null
          payment_provider_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          status?: 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_start?: string
          current_period_end?: string
          cancel_at_period_end?: boolean
          payment_provider?: string | null
          payment_provider_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          status?: 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_start?: string
          current_period_end?: string
          cancel_at_period_end?: boolean
          payment_provider?: string | null
          payment_provider_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      usage_tracking: {
        Row: {
          id: string
          user_id: string
          period_start: string
          uploads_count: number
          ai_messages_count: number
          receipts_count: number
          exports_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          period_start?: string
          uploads_count?: number
          ai_messages_count?: number
          receipts_count?: number
          exports_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          period_start?: string
          uploads_count?: number
          ai_messages_count?: number
          receipts_count?: number
          exports_count?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
