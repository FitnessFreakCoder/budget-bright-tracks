
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, DollarSign } from "lucide-react";
import { Transaction } from "@/types";
import { 
  calculateTotalIncome, 
  calculateTotalExpenses, 
  calculateBalance,
  formatCurrency 
} from "@/utils/transactionUtils";

interface DashboardProps {
  transactions: Transaction[];
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  description, 
  className 
}) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  const balance = calculateBalance(transactions);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Total Balance"
        value={formatCurrency(balance)}
        icon={<DollarSign className="h-4 w-4 text-gray-500" />}
        description="Current balance"
        className={`bg-card border-l-4 ${balance >= 0 ? 'border-l-green-500' : 'border-l-red-500'}`}
      />
      <StatCard
        title="Total Income"
        value={formatCurrency(totalIncome)}
        icon={<ArrowUpCircle className="h-4 w-4 text-green-500" />}
        description="All time income"
        className="bg-card border-l-4 border-l-green-500"
      />
      <StatCard
        title="Total Expenses"
        value={formatCurrency(totalExpenses)}
        icon={<ArrowDownCircle className="h-4 w-4 text-red-500" />}
        description="All time expenses"
        className="bg-card border-l-4 border-l-red-500"
      />
    </div>
  );
};

export default Dashboard;
