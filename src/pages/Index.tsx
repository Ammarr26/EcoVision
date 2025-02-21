
import React from 'react';
import { Layout } from '@/components/Layout';
import { StatsCard } from '@/components/StatsCard';
import { Card } from '@/components/ui/card';
import { Package, DollarSign, Users, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const mockData = {
  stats: [
    { title: "Total Inventory", value: "2,453", icon: <Package className="w-5 h-5" />, trend: { value: 12, positive: true } },
    { title: "Monthly Costs", value: "$12,234", icon: <DollarSign className="w-5 h-5" />, trend: { value: 8, positive: false } },
    { title: "Active Suppliers", value: "34", icon: <Users className="w-5 h-5" />, trend: { value: 2, positive: true } },
    { title: "Efficiency Rate", value: "94%", icon: <TrendingUp className="w-5 h-5" />, trend: { value: 5, positive: true } },
  ],
  chartData: Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    inventory: Math.floor(Math.random() * 1000) + 2000,
    costs: Math.floor(Math.random() * 5000) + 8000,
  })),
};

const Index = () => {
  return (
    <Layout>
      <div className="space-y-8 bg-dashboard-background min-h-screen">
        <div className="bg-gradient-to-r from-dashboard-primary/20 to-dashboard-accent p-8 rounded-2xl">
          <h1 className="text-3xl font-semibold text-dashboard-primary">Dashboard</h1>
          <p className="text-secondary mt-2">Welcome back! Here's your factory overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockData.stats.map((stat) => (
            <StatsCard 
              key={stat.title} 
              {...stat} 
              className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 backdrop-blur-sm bg-white shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-dashboard-primary">Inventory Trends</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="inventory"
                    stroke="#7E69AB"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 backdrop-blur-sm bg-white shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-dashboard-primary">Cost Analysis</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="costs"
                    stroke="#22C55E"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="p-6 backdrop-blur-sm bg-white shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-dashboard-primary">AI Recommendations</h3>
            <span className="text-xs text-secondary">Updated 5 min ago</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-dashboard-accent rounded-xl">
              <h4 className="font-medium text-dashboard-primary">Inventory Optimization</h4>
              <p className="text-sm text-secondary mt-1">
                Based on current trends, consider increasing stock of raw material A by 15% to meet projected demand spike in Q4.
              </p>
            </div>
            <div className="p-4 bg-dashboard-accent rounded-xl">
              <h4 className="font-medium text-dashboard-primary">Cost Reduction Opportunity</h4>
              <p className="text-sm text-secondary mt-1">
                Supplier B is offering a 12% discount on bulk orders placed before end of month. Potential savings: $3,450.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
