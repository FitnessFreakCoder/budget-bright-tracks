
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: TransactionType;
}

export interface TransactionFormData {
  amount: number;
  description: string;
  category: string;
  date: string;
  type: TransactionType;
}

export interface CategoryTotal {
  category: string;
  total: number;
}
