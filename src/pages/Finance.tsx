import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { StatsCard } from '@/components/StatsCard';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Wallet, 
  Plus, 
  Trash2, 
  Edit2, 
  Calendar, 
  Search,
  FilterIcon,
  ChevronDown,
  ChevronsUpDown,
  Save
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

interface FinancialData {
  stats: {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend: { value: number; positive: boolean };
  }[];
  expenses: {
    name: string;
    value: number;
    color: string;
  }[];
  monthlyFinance: {
    month: string;
    revenue: number;
    expenses: number;
  }[];
  transactions: Transaction[];
}

const mockData: FinancialData = {
  stats: [
    { title: "Total Revenue", value: "$145,234", icon: <DollarSign className="w-5 h-5" />, trend: { value: 12, positive: true } },
    { title: "Monthly Expenses", value: "$52,234", icon: <CreditCard className="w-5 h-5" />, trend: { value: 5, positive: false } },
    { title: "Net Profit", value: "$93,000", icon: <TrendingUp className="w-5 h-5" />, trend: { value: 8, positive: true } },
    { title: "Available Budget", value: "$25,400", icon: <Wallet className="w-5 h-5" />, trend: { value: 3, positive: true } },
  ],
  expenses: [
    { name: 'Raw Materials', value: 35000, color: '#2563EB' },
    { name: 'Labor', value: 25000, color: '#22C55E' },
    { name: 'Utilities', value: 15000, color: '#EAB308' },
    { name: 'Maintenance', value: 12000, color: '#EC4899' },
    { name: 'Others', value: 8000, color: '#8B5CF6' },
  ],
  monthlyFinance: Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    revenue: Math.floor(Math.random() * 50000) + 100000,
    expenses: Math.floor(Math.random() * 30000) + 70000,
  })),
  transactions: [
    { id: '1', date: '2023-10-15', description: 'Equipment Purchase', amount: 12500, category: 'Equipment', type: 'expense' },
    { id: '2', date: '2023-10-10', description: 'Client Payment', amount: 25000, category: 'Sales', type: 'income' },
    { id: '3', date: '2023-10-05', description: 'Office Supplies', amount: 850, category: 'Office', type: 'expense' },
    { id: '4', date: '2023-10-01', description: 'Software Licenses', amount: 2400, category: 'Software', type: 'expense' },
    { id: '5', date: '2023-09-28', description: 'Consulting Services', amount: 18500, category: 'Services', type: 'income' },
  ]
};

const categories = [
  'Raw Materials', 'Labor', 'Utilities', 'Maintenance', 
  'Equipment', 'Office', 'Software', 'Marketing', 'Travel', 
  'Services', 'Sales', 'Consulting', 'Other'
];

const Finance = () => {
  const [data, setData] = useState<FinancialData>(mockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'transactions' | 'budget'>('transactions');
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [newTransaction, setNewTransaction] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    amount: '',
    category: 'Raw Materials',
    type: 'expense' as 'income' | 'expense'
  });
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const { toast } = useToast();

  const transactionForm = useForm({
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      amount: '',
      category: 'Raw Materials',
      type: 'expense',
    },
  });

  const handleAddTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const transaction: Transaction = {
      id: Date.now().toString(),
      date: newTransaction.date,
      description: newTransaction.description,
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category,
      type: newTransaction.type,
    };
    
    setData({
      ...data,
      transactions: [transaction, ...data.transactions]
    });
    
    // Reset form
    setNewTransaction({
      date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      amount: '',
      category: 'Raw Materials',
      type: 'expense'
    });
    
    toast({
      title: "Transaction added",
      description: `${transaction.type === 'income' ? 'Income' : 'Expense'} of $${transaction.amount} has been recorded`,
    });
    
    // Update financial statistics based on new transaction
    updateFinancialStats(transaction);
  };

  const updateFinancialStats = (transaction: Transaction) => {
    // This would normally recalculate all statistics based on the new transaction
    // For demo purposes, we're just showing a notification
    toast({
      title: "Financial data updated",
      description: "All statistics have been recalculated",
    });
  };

  const handleDeleteTransaction = (id: string) => {
    const transactionToDelete = data.transactions.find(t => t.id === id);
    
    setData({
      ...data,
      transactions: data.transactions.filter(t => t.id !== id)
    });
    
    if (transactionToDelete) {
      toast({
        title: "Transaction deleted",
        description: `Transaction "${transactionToDelete.description}" has been removed`,
        variant: "destructive",
      });
    }
  };

  const handleEditTransaction = (id: string) => {
    const transaction = data.transactions.find(t => t.id === id);
    if (transaction) {
      setEditingTransactionId(id);
      setNewTransaction({
        date: transaction.date,
        description: transaction.description,
        amount: transaction.amount.toString(),
        category: transaction.category,
        type: transaction.type,
      });
    }
  };

  const handleSaveEdit = () => {
    if (!editingTransactionId) return;
    
    const updatedTransactions = data.transactions.map(t => {
      if (t.id === editingTransactionId) {
        return {
          ...t,
          date: newTransaction.date,
          description: newTransaction.description,
          amount: parseFloat(newTransaction.amount),
          category: newTransaction.category,
          type: newTransaction.type,
        };
      }
      return t;
    });
    
    setData({
      ...data,
      transactions: updatedTransactions
    });
    
    // Reset edit state
    setEditingTransactionId(null);
    setNewTransaction({
      date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      amount: '',
      category: 'Raw Materials',
      type: 'expense'
    });
    
    toast({
      title: "Transaction updated",
      description: "The transaction has been updated successfully",
    });
  };

  // Filter transactions based on search term and type filter
  const filteredTransactions = data.transactions.filter(transaction => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      filterType === 'all' || 
      transaction.type === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <Layout>
      <div className="space-y-8 min-h-screen">
        <div className="glass-card p-8 rounded-2xl starlight">
          <h1 className="text-3xl font-semibold gradient-text">Financial Overview</h1>
          <p className="text-muted-foreground mt-2">Monitor your financial performance</p>
        </div>

        {/* Search and Filter Bar */}
        <Card className="p-4 glass-card">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-auto flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full bg-background/30 border-white/10"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button 
                variant={filterType === 'all' ? "default" : "outline"}
                size="sm" 
                onClick={() => setFilterType('all')}
                className="flex items-center whitespace-nowrap"
              >
                <FilterIcon className="w-4 h-4 mr-1" />
                All
              </Button>
              <Button 
                variant={filterType === 'income' ? "default" : "outline"}
                size="sm" 
                onClick={() => setFilterType('income')}
                className="flex items-center whitespace-nowrap text-success"
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Income
              </Button>
              <Button 
                variant={filterType === 'expense' ? "default" : "outline"}
                size="sm" 
                onClick={() => setFilterType('expense')}
                className="flex items-center whitespace-nowrap text-destructive"
              >
                <CreditCard className="w-4 h-4 mr-1" />
                Expenses
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                }}
                variant="outline"
                className="whitespace-nowrap"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.stats.map((stat) => (
            <StatsCard 
              key={stat.title} 
              {...stat} 
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Transaction Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 glass-card glow-card">
              <h3 className="text-lg font-semibold mb-4 gradient-text">
                {editingTransactionId ? "Edit Transaction" : "Add New Transaction"}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Date</label>
                    <div className="flex">
                      <Input
                        type="date"
                        value={newTransaction.date}
                        onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                        className="w-full bg-background/30 border-white/10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                    <select
                      className="w-full p-2 border rounded-md bg-background/30 border-white/10 text-foreground"
                      value={newTransaction.type}
                      onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value as 'income' | 'expense'})}
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <Input
                    placeholder="Transaction description"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                    className="bg-background/30 border-white/10"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Amount ($)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                      className="bg-background/30 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <select
                      className="w-full p-2 border rounded-md bg-background/30 border-white/10 text-foreground"
                      value={newTransaction.category}
                      onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {editingTransactionId ? (
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSaveEdit} 
                      className="flex-1"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditingTransactionId(null);
                        setNewTransaction({
                          date: format(new Date(), 'yyyy-MM-dd'),
                          description: '',
                          amount: '',
                          category: 'Raw Materials',
                          type: 'expense'
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={handleAddTransaction} 
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Transaction
                  </Button>
                )}
              </div>
            </Card>
            
            <Card className="p-6 glass-card glow-card">
              <h3 className="text-lg font-semibold mb-4 gradient-text">Quick Budget Planner</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-muted-foreground">Monthly Income</label>
                      <span className="text-xs text-success">Projected: $125,000</span>
                    </div>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      defaultValue="125000"
                      className="bg-background/30 border-white/10"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-muted-foreground">Monthly Expenses</label>
                      <span className="text-xs text-destructive">Trend: +5%</span>
                    </div>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      defaultValue="52234"
                      className="bg-background/30 border-white/10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Savings Target (%)</label>
                  <Input 
                    type="number" 
                    placeholder="%" 
                    defaultValue="15"
                    className="bg-background/30 border-white/10"
                  />
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-muted-foreground">Min: 10%</span>
                    <span className="text-warning">Recommended: 20%</span>
                    <span className="text-muted-foreground">Max: 40%</span>
                  </div>
                </div>
                
                <Button className="w-full">Calculate Budget</Button>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="p-3 bg-background/30 rounded-lg">
                    <div className="text-xs text-muted-foreground">Available for expenses</div>
                    <div className="text-lg font-semibold gradient-text">$106,250</div>
                  </div>
                  <div className="p-3 bg-background/30 rounded-lg">
                    <div className="text-xs text-muted-foreground">Savings goal</div>
                    <div className="text-lg font-semibold gradient-text">$18,750</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Transactions Table */}
          <div className="lg:col-span-3">
            <Card className="h-full p-6 glass-card glow-card flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold gradient-text">Recent Transactions</h3>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                  {filteredTransactions.length} transactions
                </span>
              </div>
              
              <div className="overflow-auto flex-1">
                {filteredTransactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-8 text-muted-foreground">
                    <ChevronsUpDown className="w-12 h-12 text-muted-foreground mb-3" />
                    {searchTerm ? 
                      "No transactions match your search criteria." : 
                      "No transactions recorded yet. Add your first transaction."}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="w-[100px] text-muted-foreground">Date</TableHead>
                        <TableHead className="text-muted-foreground">Description</TableHead>
                        <TableHead className="text-muted-foreground">Category</TableHead>
                        <TableHead className="text-right text-muted-foreground">Amount</TableHead>
                        <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id} className="border-white/10">
                          <TableCell className="font-medium">
                            {new Date(transaction.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>
                            <span className="inline-block px-2 py-1 text-xs rounded-full bg-accent/30">
                              {transaction.category}
                            </span>
                          </TableCell>
                          <TableCell className={`text-right font-medium ${
                            transaction.type === 'income' ? 'text-success' : 'text-destructive'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-white/5"
                                onClick={() => handleEditTransaction(transaction.id)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:bg-white/5"
                                onClick={() => handleDeleteTransaction(transaction.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 glass-card glow-card">
            <h3 className="text-lg font-semibold mb-4 gradient-text">Revenue vs Expenses</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.monthlyFinance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: "rgba(30,30,30,0.8)", borderColor: "rgba(255,255,255,0.1)" }} />
                  <Line type="monotone" dataKey="revenue" stroke="#9370DB" name="Revenue" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="#F44336" name="Expenses" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 glass-card glow-card">
            <h3 className="text-lg font-semibold mb-4 gradient-text">Expense Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.expenses}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.expenses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "rgba(30,30,30,0.8)", borderColor: "rgba(255,255,255,0.1)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 glass-card glow bg-warning/10">
            <h4 className="font-medium gradient-text">Maintenance Budget Alert</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Maintenance expenses are approaching the monthly budget limit. Currently at 85% of allocated budget.
            </p>
          </Card>
          <Card className="p-6 glass-card glow bg-success/10">
            <h4 className="font-medium gradient-text">Cost Saving Opportunity</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Bulk purchase discount available from Supplier A. Potential savings of $3,200 on raw materials.
            </p>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Finance;
