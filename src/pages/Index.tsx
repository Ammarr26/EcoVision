
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { StatsCard } from '@/components/StatsCard';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Package, DollarSign, Users, TrendingUp } from 'lucide-react';

const inventoryData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  value: Math.floor(Math.random() * 3000)
}));

const costData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  value: Math.floor(Math.random() * 12000)
}));

const Index = () => {
  return (
    <Layout>
      <div className="space-y-8 min-h-screen">
        <div className="glass-card p-8 rounded-2xl starlight">
          <h1 className="text-3xl font-semibold gradient-text">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's your factory overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Inventory"
            value="2,453"
            icon={<Package className="w-5 h-5" />}
            trend={{ value: 12, positive: true }}
          />
          <StatsCard
            title="Monthly Costs"
            value="$12,234"
            icon={<DollarSign className="w-5 h-5" />}
            trend={{ value: 8, positive: false }}
          />
          <StatsCard
            title="Active Suppliers"
            value="34"
            icon={<Users className="w-5 h-5" />}
            trend={{ value: 2, positive: true }}
          />
          <StatsCard
            title="Efficiency Rate"
            value="94%"
            icon={<TrendingUp className="w-5 h-5" />}
            trend={{ value: 5, positive: true }}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 glass-card glow-card">
            <h3 className="text-lg font-semibold mb-4 gradient-text">Inventory Trends</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={inventoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: "rgba(30,30,30,0.8)", borderColor: "rgba(255,255,255,0.1)" }} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#9370DB"
                    strokeWidth={2}
                    dot={{ fill: "#9370DB", strokeWidth: 2 }}
                    activeDot={{ r: 8, fill: "#9370DB", stroke: "rgba(255,255,255,0.3)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 glass-card glow-card">
            <h3 className="text-lg font-semibold mb-4 gradient-text">Cost Analysis</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: "rgba(30,30,30,0.8)", borderColor: "rgba(255,255,255,0.1)" }} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4C83FF"
                    strokeWidth={2}
                    dot={{ fill: "#4C83FF", strokeWidth: 2 }}
                    activeDot={{ r: 8, fill: "#4C83FF", stroke: "rgba(255,255,255,0.3)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* AI Recommendations */}
        <Card className="p-6 glass-card glow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold gradient-text">AI Recommendations</h3>
            <span className="text-xs text-muted-foreground">Updated 5 min ago</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 glow">
              <h4 className="font-medium text-primary">Inventory Optimization</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Based on current trends, consider increasing stock of raw material A by 15% to meet projected demand spike in Q4.
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 glow">
              <h4 className="font-medium text-primary">Cost Reduction Opportunity</h4>
              <p className="text-sm text-muted-foreground mt-1">
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
