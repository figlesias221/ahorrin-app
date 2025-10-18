export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  userId: string;
  date: Date;
  vendor: string;
  description?: string;
  amount: number;
  type: TransactionType;
  currency: string;
  bank?: string;
  categoryId: string;
  category?: Category;
  accountId?: string;
  statementId?: string;
  statement?: BankStatement;
  isIgnored: boolean;
  isManuallyVerified: boolean;
  confidenceScore?: number; // 0-1 para categorización AI
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  bank: string;
  accountNumber?: string;
  currency: string;
  initialBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardMetrics {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  transactionCount: number;
  categoryBreakdown: {
    category: Category;
    total: number;
    count: number;
    percentage: number;
  }[];
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

// Budget types
export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  category?: Category;
  amount: number;
  period: 'monthly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Categorization rule types
export interface CategorizationRule {
  id: string;
  userId: string;
  vendorPattern: string;
  amountMin?: number;
  amountMax?: number;
  categoryId: string;
  category?: Category;
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Bank statement upload types
export interface BankStatement {
  id: string;
  userId: string;
  accountId?: string;
  account?: Account;
  filePath: string;
  fileName: string;
  uploadDate: Date;
  periodStart?: Date;
  periodEnd?: Date;
  status: 'processing' | 'completed' | 'failed';
  transactionsCount: number;
  createdAt: Date;
}

// Form types
export interface TransactionFormData {
  date: string;
  vendor: string;
  description?: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  accountId?: string;
  notes?: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  color: string;
  icon?: string;
  isActive: boolean;
}

export interface BudgetFormData {
  categoryId: string;
  amount: number;
  period: 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
}

// Filter types
export interface TransactionFilters {
  dateFrom?: Date;
  dateTo?: Date;
  categoryIds?: string[];
  type?: TransactionType;
  minAmount?: number;
  maxAmount?: number;
  vendor?: string;
  accountId?: string;
  statementId?: string;
  currencies?: string[]; // Filter by currency (USD, UYU, etc.)
  banks?: string[]; // Filter by bank name
}

export interface TransactionSortOptions {
  field: 'date' | 'amount' | 'vendor' | 'category';
  direction: 'asc' | 'desc';
}

// Pagination types
export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Chart data types
export interface CategoryChartData {
  category: string;
  amount: number;
  count: number;
  color: string;
}

export interface TrendChartData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}
