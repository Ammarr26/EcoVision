
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { StatsCard } from '@/components/StatsCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { LineChart, TrendingUp, Box, Activity, MessageCircle, Globe, Building2, ChevronDown } from 'lucide-react';
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
  Bar,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

// Mock data for market sentiment
const marketSentimentData = Array.from({ length: 50 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  z: Math.random() * 1000, // demand size
  name: `Product ${Math.floor(Math.random() * 100)}`,
  competition: Math.random(), // competition level for color
}));

// Mock data for predictions
const predictionData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  actual: Math.floor(Math.random() * 1000) + 2000,
  predicted: Math.floor(Math.random() * 1000) + 2000,
  optimistic: Math.floor(Math.random() * 1200) + 2200,
  pessimistic: Math.floor(Math.random() * 800) + 1800,
}));

const Analytics = () => {
  const [timeSliderValue, setTimeSliderValue] = useState([50]);
  const [viewMode, setViewMode] = useState<'macro' | 'micro'>('macro');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; sender: 'user' | 'ai' }>>([]);

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [...prev, { text: chatInput, sender: 'user' }]);
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        text: `Analysis: Based on historical data and market trends, ${chatInput.toLowerCase()} shows a 15% potential increase in Q3. Recommend monitoring supply chain factors.`, 
        sender: 'ai' 
      }]);
    }, 1000);
    setChatInput('');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white p-6 space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Predictive Intelligence Lab
            </h1>
            <p className="text-gray-400 mt-2">AI-Powered Market Analysis & Forecasting</p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className={`border-purple-500 ${viewMode === 'macro' ? 'bg-purple-500/20' : ''}`}
              onClick={() => setViewMode('macro')}
            >
              Macro View
            </Button>
            <Button 
              variant="outline" 
              className={`border-purple-500 ${viewMode === 'micro' ? 'bg-purple-500/20' : ''}`}
              onClick={() => setViewMode('micro')}
            >
              Micro View
            </Button>
          </div>
        </div>

        {/* Time Machine Slider */}
        <Card className="p-6 bg-black/40 backdrop-blur-xl border border-purple-500/20">
          <h3 className="text-xl font-semibold mb-4">Time Machine Predictor</h3>
          <div className="space-y-4">
            <Slider
              defaultValue={[50]}
              max={100}
              step={1}
              value={timeSliderValue}
              onValueChange={setTimeSliderValue}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>Past (12 months)</span>
              <span>Present</span>
              <span>Future (12 months)</span>
            </div>
          </div>
        </Card>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Sentiment Galaxy */}
          <Card className="p-6 bg-black/40 backdrop-blur-xl border border-purple-500/20">
            <h3 className="text-xl font-semibold mb-4">Market Sentiment Galaxy</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis type="number" dataKey="x" name="Demand" />
                  <YAxis type="number" dataKey="y" name="Price" />
                  <ZAxis type="number" dataKey="z" range={[50, 400]} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ payload }) => {
                      if (payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-black/80 p-3 rounded-lg border border-purple-500/20">
                            <p className="text-white">{data.name}</p>
                            <p className="text-gray-400">Demand: {Math.round(data.z)}</p>
                            <p className="text-gray-400">Competition: {data.competition.toFixed(2)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter 
                    data={marketSentimentData} 
                    fill="#8884d8"
                    stroke="#fff"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* AI Co-Pilot Chat */}
          <Card className="p-6 bg-black/40 backdrop-blur-xl border border-purple-500/20">
            <h3 className="text-xl font-semibold mb-4">AI Co-Pilot Chat</h3>
            <div className="h-[400px] flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {chatMessages.map((message, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg max-w-[80%] ${
                      message.sender === 'user' 
                        ? 'bg-purple-500/20 ml-auto' 
                        : 'bg-blue-500/20'
                    }`}
                  >
                    {message.text}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  className="bg-white/10 border-purple-500/30"
                  placeholder="Ask about market predictions..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                />
                <Button onClick={handleChatSubmit}>
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Prediction Timeline */}
        <Card className="p-6 bg-black/40 backdrop-blur-xl border border-purple-500/20">
          <h3 className="text-xl font-semibold mb-4">Prediction Timeline</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictionData}>
                <defs>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOptimistic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPessimistic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="month" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(147, 51, 234, 0.2)',
                    borderRadius: '0.5rem'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#8884d8" 
                  fill="url(#colorPredicted)" 
                  name="Actual"
                />
                <Area 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#82ca9d" 
                  fill="url(#colorOptimistic)" 
                  name="Predicted"
                />
                <Area 
                  type="monotone" 
                  dataKey="pessimistic" 
                  stroke="#ffc658" 
                  fill="url(#colorPessimistic)" 
                  name="Pessimistic"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Competitor Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-black/40 backdrop-blur-xl border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Market Position</h4>
              <Globe className="h-5 w-5 text-purple-400" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Market Share</span>
                <span className="text-green-400">32%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-black/40 backdrop-blur-xl border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Pricing Strategy</h4>
              <Building2 className="h-5 w-5 text-purple-400" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Price Competitiveness</span>
                <span className="text-yellow-400">85%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-black/40 backdrop-blur-xl border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Innovation Index</h4>
              <TrendingUp className="h-5 w-5 text-purple-400" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>R&D Progress</span>
                <span className="text-blue-400">92%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
