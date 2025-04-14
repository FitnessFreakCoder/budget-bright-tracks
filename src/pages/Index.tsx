
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Dashboard from "@/components/Dashboard";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import ExpenseChart from "@/components/ExpenseChart";
import { Transaction, TransactionFormData } from "@/types";
import { 
  generateId, 
  getCategoryTotals 
} from "@/utils/transactionUtils";

const Index = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Load transactions from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem("expenses-tracker-transactions");
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("expenses-tracker-transactions", JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (formData: TransactionFormData) => {
    if (editingTransaction) {
      // Update existing transaction
      setTransactions(prevTransactions =>
        prevTransactions.map(transaction =>
          transaction.id === editingTransaction.id
            ? { ...formData, id: transaction.id }
            : transaction
        )
      );
      setEditingTransaction(null);
    } else {
      // Add new transaction
      const newTransaction: Transaction = {
        ...formData,
        id: generateId()
      };
      setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
    }
    setIsFormVisible(false);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormVisible(true);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
    setIsFormVisible(false);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setTransactions(prevTransactions => 
        prevTransactions.filter(transaction => transaction.id !== deleteId)
      );
      toast({
        title: "Transaction Deleted",
        description: "The transaction has been deleted successfully."
      });
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  const categoryData = getCategoryTotals(transactions);

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary">Budget Tracker</h1>
        <p className="text-muted-foreground mt-2">Manage your finances with ease</p>
      </header>

      <div className="mb-8">
        <Dashboard transactions={transactions} />
      </div>

      <Tabs defaultValue="transactions" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Manage Transactions</h2>
            <button
              onClick={() => {
                setEditingTransaction(null);
                setIsFormVisible(!isFormVisible);
              }}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center"
            >
              {isFormVisible ? "Hide Form" : "Add Transaction"}
            </button>
          </div>
          
          {isFormVisible && (
            <div className="mb-6">
              <TransactionForm
                onAddTransaction={handleAddTransaction}
                onCancel={handleCancelEdit}
                initialData={editingTransaction || undefined}
                isEditing={!!editingTransaction}
              />
            </div>
          )}
          
          <TransactionList
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Spending Analytics</h2>
            <ExpenseChart data={categoryData} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
