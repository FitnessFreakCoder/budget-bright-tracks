
import { Transaction, CategoryTotal } from "@/types";

// Generate a unique ID for transactions
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Calculate total income
export const calculateTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter(transaction => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);
};

// Calculate total expenses
export const calculateTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter(transaction => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);
};

// Calculate balance (income - expenses)
export const calculateBalance = (transactions: Transaction[]): number => {
  return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
};

// Get category totals for chart data
export const getCategoryTotals = (transactions: Transaction[]): CategoryTotal[] => {
  const expensesByCategory: Record<string, number> = {};
  
  transactions
    .filter(transaction => transaction.type === "expense")
    .forEach(transaction => {
      if (!expensesByCategory[transaction.category]) {
        expensesByCategory[transaction.category] = 0;
      }
      expensesByCategory[transaction.category] += transaction.amount;
    });
  
  return Object.entries(expensesByCategory).map(([category, total]) => ({
    category,
    total
  }));
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Get formatted date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};
