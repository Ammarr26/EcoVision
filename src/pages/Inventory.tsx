import React from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { StatsCard } from '@/components/StatsCard';
import { Package, PackageOpen, BoxSelect, Truck } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const mockData = {
  stats: [
    { title: "Raw Materials", value: "1,234", icon: <Package className="w-5 h-5" />, trend: { value: 5, positive: true } },
    { title: "Work in Progress", value: "456", icon: <PackageOpen className="w-5 h-5" />, trend: { value: 2, positive: true } },
    { title: "Finished Goods", value: "789", icon: <BoxSelect className="w-5 h-5" />, trend: { value: 3, positive: false } },
    { title: "In Transit", value: "123", icon: <Truck className="w-5 h-5" />, trend: { value: 8, positive: true } },
  ],
  stockLevels: Array.from({ length: 6 }, (_, i) => ({
    category: ['Electronics', 'Metal Parts', 'Plastics', 'Chemicals', 'Packaging', 'Tools'][i],
    current: Math.floor(Math.random() * 1000) + 500,
    minimum: Math.floor(Math.random() * 300) + 200,
  })),
  monthlyTrends: Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    inflow: Math.floor(Math.random() * 1000) + 500,
    outflow: Math.floor(Math.random() * 800) + 400,
  })),
};

const Inventory = () => {
  return (
    <Layout>
      <div className="space-y-8 bg-inventory-background min-h-screen">
        <div className="bg-gradient-to-br from-inventory-primary/20 via-inventory-accent to-inventory-background p-8 rounded-2xl">
          <h1 className="text-3xl font-semibold text-inventory-primary">Inventory Management</h1>
          <p className="text-secondary mt-2">Track and manage your inventory levels</p>
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
            <h3 className="text-lg font-semibold mb-4 text-inventory-primary">Stock Levels by Category</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.stockLevels}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="current" fill="#3B82F6" name="Current Stock" />
                  <Bar dataKey="minimum" fill="#DC2626" name="Minimum Required" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 bg-white/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Monthly Inventory Flow</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="inflow" stroke="#2563EB" name="Inflow" />
                  <Line type="monotone" dataKey="outflow" stroke="#DC2626" name="Outflow" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockData.stockLevels
            .filter(item => item.current < item.minimum)
            .map((item, index) => (
              <Card key={index} className="p-6 bg-white shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-inventory-accent">
                    <Package className="w-6 h-6 text-inventory-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-inventory-primary">{item.category}</h4>
                    <p className="text-sm text-secondary mt-1">
                      Current stock: {item.current} units
                    </p>
                    <p className="text-sm text-destructive">
                      Minimum required: {item.minimum} units
                    </p>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default Inventory;
