import React from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { StatsCard } from '@/components/StatsCard';
import { LineChart, TrendingUp, Box, Activity } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

const mockData = {
  stats: [
    { title: "Efficiency Rate", value: "94%", icon: <TrendingUp className="w-5 h-5" />, trend: { value: 5, positive: true } },
    { title: "Production Rate", value: "850/day", icon: <Box className="w-5 h-5" />, trend: { value: 3, positive: true } },
    { title: "Quality Score", value: "96%", icon: <Activity className="w-5 h-5" />, trend: { value: 2, positive: true } },
    { title: "Predictions", value: "97%", icon: <LineChart className="w-5 h-5" />, trend: { value: 4, positive: true } },
  ],
  productionTrends: Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    actual: Math.floor(Math.random() * 1000) + 2000,
    predicted: Math.floor(Math.random() * 1000) + 2000,
  })),
  qualityMetrics: [
    { name: 'Excellent', value: 65, color: '#22C55E' },
    { name: 'Good', value: 25, color: '#2563EB' },
    { name: 'Average', value: 8, color: '#EAB308' },
    { name: 'Poor', value: 2, color: '#EF4444' },
  ],
  efficiencyData: Array.from({ length: 6 }, (_, i) => ({
    process: ['Assembly', 'Testing', 'Packaging', 'Quality Check', 'Storage', 'Shipping'][i],
    efficiency: Math.floor(Math.random() * 20) + 80,
  })),
};

const Analytics = () => {
  return (
    <Layout>
      <div className="space-y-8 bg-analytics-background min-h-screen">
        <div className="bg-gradient-to-tr from-analytics-primary/20 via-analytics-accent to-analytics-background p-8 rounded-2xl">
          <h1 className="text-3xl font-semibold text-analytics-primary">Analytics Dashboard</h1>
          <p className="text-secondary mt-2">Monitor performance metrics and predictions</p>
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
            <h3 className="text-lg font-semibold mb-4 text-analytics-primary">Production Trends & Predictions</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData.productionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#2563EB" 
                    fill="#2563EB" 
                    fillOpacity={0.2} 
                    name="Actual"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#22C55E" 
                    fill="#22C55E" 
                    fillOpacity={0.2} 
                    name="Predicted"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 backdrop-blur-sm bg-white shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-analytics-primary">Quality Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockData.qualityMetrics}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {mockData.qualityMetrics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="p-6 backdrop-blur-sm bg-white shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-analytics-primary">Process Efficiency Analysis</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData.efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="process" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="efficiency" 
                  fill="#2563EB" 
                  name="Efficiency Rate"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;
