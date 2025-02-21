import React from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { StatsCard } from '@/components/StatsCard';
import { Users, Star, Clock, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const mockData = {
  stats: [
    { title: "Active Suppliers", value: "34", icon: <Users className="w-5 h-5" />, trend: { value: 2, positive: true } },
    { title: "Avg. Rating", value: "4.5", icon: <Star className="w-5 h-5" />, trend: { value: 5, positive: true } },
    { title: "Delivery Time", value: "2.3 days", icon: <Clock className="w-5 h-5" />, trend: { value: 8, positive: true } },
    { title: "Cost Savings", value: "$12,345", icon: <TrendingUp className="w-5 h-5" />, trend: { value: 10, positive: true } },
  ],
  supplierPerformance: Array.from({ length: 6 }, (_, i) => ({
    name: ['Supplier A', 'Supplier B', 'Supplier C', 'Supplier D', 'Supplier E', 'Supplier F'][i],
    quality: Math.floor(Math.random() * 20) + 80,
    delivery: Math.floor(Math.random() * 20) + 80,
    cost: Math.floor(Math.random() * 20) + 80,
  })),
  deliveryTimes: Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    average: Math.random() * 2 + 1,
  })),
};

const Suppliers = () => {
  return (
    <Layout>
      <div className="space-y-8 bg-suppliers-background min-h-screen">
        <div className="bg-gradient-to-l from-suppliers-primary/20 to-suppliers-accent p-8 rounded-2xl">
          <h1 className="text-3xl font-semibold text-suppliers-primary">Supplier Management</h1>
          <p className="text-secondary mt-2">Monitor and manage supplier relationships</p>
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
          <Card className="p-6 bg-white/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Supplier Performance</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.supplierPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quality" fill="#2563EB" name="Quality Score" />
                  <Bar dataKey="delivery" fill="#22C55E" name="Delivery Score" />
                  <Bar dataKey="cost" fill="#EAB308" name="Cost Efficiency" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 bg-white/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Average Delivery Times</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData.deliveryTimes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    stroke="#2563EB" 
                    name="Avg. Delivery Time (Days)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockData.supplierPerformance
            .sort((a, b) => (b.quality + b.delivery + b.cost) - (a.quality + a.delivery + a.cost))
            .slice(0, 3)
            .map((supplier, index) => (
              <Card key={index} className="p-6 bg-white shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-suppliers-accent">
                    <Users className="w-6 h-6 text-suppliers-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-suppliers-primary">{supplier.name}</h4>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      <p className="text-sm text-secondary">Quality: {supplier.quality}%</p>
                      <p className="text-sm text-secondary">Delivery: {supplier.delivery}%</p>
                      <p className="text-sm text-secondary">Cost Efficiency: {supplier.cost}%</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default Suppliers;
