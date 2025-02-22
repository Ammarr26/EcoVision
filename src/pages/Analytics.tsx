import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, TrendingUp, Box, Activity, Bell, Star, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter, ZAxis,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// Mock data for market sentiment constellation
const marketSentimentData = Array.from({ length: 50 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  z: Math.random() * 1000,
  name: `Product ${Math.floor(Math.random() * 100)}`,
  sentiment: Math.random(),
  demand: Math.random() * 100,
  fill: Math.random() > 0.5 ? "#4ADE80" : "#FB7185"
}));

// Mock data for competitor analysis
const competitorData = [
  { name: 'Your Company', pricing: 85, stockouts: 5, leadTime: 2 },
  { name: 'Competitor A', pricing: 78, stockouts: 8, leadTime: 3 },
  { name: 'Competitor B', pricing: 92, stockouts: 3, leadTime: 1.5 },
];

// Market metrics data for radar chart (replacing 3D visualization)
const marketMetrics = [
  { subject: 'Market Share', A: 120, B: 110, fullMark: 150 },
  { subject: 'Growth Rate', A: 98, B: 130, fullMark: 150 },
  { subject: 'Customer Satisfaction', A: 86, B: 130, fullMark: 150 },
  { subject: 'Innovation', A: 99, B: 100, fullMark: 150 },
  { subject: 'Brand Value', A: 85, B: 90, fullMark: 150 },
  { subject: 'Market Reach', A: 65, B: 85, fullMark: 150 },
];

const Analytics = () => {
  const [selectedCategory, setSelectedCategory] = useState('Electronics');
  const { toast } = useToast();
  const [alerts, setAlerts] = React.useState([
    { id: 1, message: "Price surge detected in Electronics category", type: "warning" },
    { id: 2, message: "New competitor entered the market", type: "info" }
  ]);

  // Simulate real-time alerts
  React.useEffect(() => {
    const interval = setInterval(() => {
      const newAlert = {
        id: Date.now(),
        message: `Market shift detected in ${selectedCategory}`,
        type: Math.random() > 0.5 ? "warning" : "info"
      };
      
      toast({
        title: "Market Alert",
        description: newAlert.message,
        variant: newAlert.type === "warning" ? "destructive" : "default"
      });
      
      setAlerts(prev => [...prev, newAlert].slice(-5));
    }, 15000);

    return () => clearInterval(interval);
  }, [selectedCategory, toast]);

  return (
    <Layout>
      <div className="min-h-screen bg-background p-6 space-y-6">
        {/* Header section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Advanced Analytics Hub
            </h1>
            <p className="text-muted-foreground mt-2">Real-time Market Intelligence</p>
          </div>
          <Button variant="outline" className="border-primary">
            <Bell className="h-4 w-4 mr-2" />
            {alerts.length} Alerts
          </Button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Analysis Radar */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Market Analysis Matrix</h3>
            <div className="h-[400px] rounded-lg overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={120} data={marketMetrics}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Radar 
                    name="Your Company"
                    dataKey="A"
                    stroke="#7E69AB"
                    fill="#7E69AB"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Industry Average"
                    dataKey="B"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Market Sentiment Constellation */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Market Sentiment Constellation</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="x" name="Market Share" />
                  <YAxis type="number" dataKey="y" name="Growth" />
                  <ZAxis type="number" dataKey="z" range={[50, 400]} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem'
                    }}
                    content={({ payload }) => {
                      if (payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 rounded-lg border shadow-sm">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-muted-foreground">Demand: {Math.round(data.demand)}</p>
                            <p className={`text-${data.sentiment > 0.5 ? 'green' : 'red'}-600`}>
                              Sentiment: {data.sentiment > 0.5 ? 'Positive' : 'Negative'}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter 
                    data={marketSentimentData}
                    fill="#7E69AB"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Competitor X-Ray */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Competitor X-Ray Analysis</h3>
            <div className="flex items-center gap-2">
              <select 
                className="bg-background border rounded-lg px-4 py-2"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="Electronics">Electronics</option>
                <option value="Textiles">Textiles</option>
                <option value="Food">Food & Beverage</option>
              </select>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={competitorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar dataKey="pricing" name="Pricing Efficiency" fill="#7E69AB" />
                <Bar dataKey="stockouts" name="Stockouts (Weekly)" fill="#82ca9d" />
                <Bar dataKey="leadTime" name="Lead Time (Days)" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Real-Time Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.map(alert => (
            <Card 
              key={alert.id}
              className="p-4 border"
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${
                  alert.type === 'warning' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {alert.type === 'warning' ? (
                    <Activity className="h-4 w-4 text-red-600" />
                  ) : (
                    <Star className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{alert.type === 'warning' ? 'Warning' : 'Info'}</h4>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
                <Button variant="ghost" size="sm">
                  Take Action
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
