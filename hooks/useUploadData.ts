'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

type BankStatement = Database['public']['Tables']['bank_statements']['Row'];

export interface CustomBank {
  id: string;
  name: string;
  displayName: string;
  color: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  color: string;
  type: 'income' | 'expense';
  parentId?: string | null;
}

export interface BankStats {
  [bankName: string]: { statementsCount: number; transactionsCount: number };
}

export function useUploadData() {
  const [statements, setStatements] = useState<BankStatement[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [customBanks, setCustomBanks] = useState<CustomBank[]>([]);
  const [bankStats, setBankStats] = useState<BankStats>({});
  const [activeRulesCount, setActiveRulesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch statements
    const { data: statementsData, error: statementsError } = await supabase
      .from('bank_statements')
      .select('*')
      .eq('user_id', user.id)
      .order('upload_date', { ascending: false });

    if (statementsError) {
      console.error('Error fetching statements:', statementsError);
    } else {
      setStatements(statementsData || []);
    }

    // Fetch active rules count
    const { data: rules } = await supabase
      .from('categorization_rules')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true);

    setActiveRulesCount(rules?.length || 0);

    // Fetch custom banks
    const { data: customBanksData } = await supabase
      .from('custom_banks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (customBanksData) {
      setCustomBanks(customBanksData.map(cb => ({
        id: cb.id,
        name: cb.name,
        displayName: cb.display_name,
        color: cb.color,
      })));
    }

    // Calculate bank statistics
    const stats: BankStats = {};
    (statementsData || []).forEach(stmt => {
      const bankName = stmt.bank || 'Desconocido';
      if (!stats[bankName]) {
        stats[bankName] = { statementsCount: 0, transactionsCount: 0 };
      }
      stats[bankName].statementsCount += 1;
      stats[bankName].transactionsCount += stmt.transactions_count;
    });
    setBankStats(stats);

    // Fetch categories
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('name');

    if (categoriesError) {
      console.error('Error loading categories:', categoriesError);
    } else if (categoriesData) {
      setCategories(categoriesData);
    }

    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    statements,
    setStatements,
    categories,
    setCategories,
    customBanks,
    setCustomBanks,
    bankStats,
    setBankStats,
    activeRulesCount,
    setActiveRulesCount,
    loading,
    refetch: fetchData,
  };
}
