
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { StatsCard } from '@/components/StatsCard';
import { DollarSign, TrendingUp, CreditCard, Wallet } from 'lucide-react';
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

const mockData = {
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
};

const Finance = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold">Financial Overview</h1>
          <p className="text-secondary mt-2">Monitor your financial performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockData.stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-white/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Revenue vs Expenses</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData.monthlyFinance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#22C55E" name="Revenue" />
                  <Line type="monotone" dataKey="expenses" stroke="#EF4444" name="Expenses" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 bg-white/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Expense Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockData.expenses}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {mockData.expenses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-white/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4">Budget Alerts</h3>
          <div className="space-y-4">
            <div className="p-4 bg-warning/10 rounded-lg">
              <h4 className="font-medium text-warning">Maintenance Budget Alert</h4>
              <p className="text-sm text-secondary mt-1">
                Maintenance expenses are approaching the monthly budget limit. Currently at 85% of allocated budget.
              </p>
            </div>
            <div className="p-4 bg-success/10 rounded-lg">
              <h4 className="font-medium text-success">Cost Saving Opportunity</h4>
              <p className="text-sm text-secondary mt-1">
                Bulk purchase discount available from Supplier A. Potential savings of $3,200 on raw materials.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Finance;
