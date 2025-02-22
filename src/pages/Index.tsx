
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { MoreHorizontal, ChevronDown, Package, ArrowRight } from 'lucide-react';

const salesData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  currentYear: Math.floor(Math.random() * 40000) + 10000,
  lastYear: Math.floor(Math.random() * 40000) + 10000,
}));

const recentTransactions = [
  {
    id: '#876364',
    name: 'Bluetooth Devices',
    price: '$178',
    pieces: '325',
    totalSales: '$3,46,660'
  },
  {
    id: '#876388',
    name: 'Airpod',
    price: '$14',
    pieces: '53',
    totalSales: '$46,660'
  },
  {
    id: '#874412',
    name: 'Shoes',
    price: '$21',
    pieces: '78',
    totalSales: '$3,46,676'
  }
];

const customerList = [
  {
    name: 'John Doe',
    email: 'johndoe2211@gmail.com',
    phone: '+33757005467',
    gender: 'Male'
  },
  {
    name: 'Shelby Goode',
    email: 'shelbygoode481@gmail.com',
    phone: '+33757005467',
    gender: 'Female'
  }
];

const Index = () => {
  const [selectedYear, setSelectedYear] = React.useState('2023-2024');

  const years = [
    '2015-2016',
    '2016-2017',
    '2017-2018',
    '2018-2019',
    '2019-2020',
    '2020-2021',
    '2021-2022',
    '2022-2023',
    '2023-2024'
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-[#F8FAFC] p-6">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-[#7E69AB]">Sales</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="gap-2">
              Party Analytics
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Year Selection Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {years.map((year) => (
              <Button
                key={year}
                variant={year === selectedYear ? 'default' : 'ghost'}
                className={`px-4 py-2 ${
                  year === selectedYear ? 'bg-[#7E69AB] text-white' : 'text-gray-600'
                }`}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Current vs Last Year Chart */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Current vs. Last Year</h3>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="currentYear" 
                    stroke="#7E69AB" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="lastYear" 
                    stroke="#FF6B6B" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Last 5 Years Chart */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Sales</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Last 5 Years</span>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7E69AB" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#7E69AB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="currentYear" 
                      stroke="#7E69AB" 
                      fillOpacity={1}
                      fill="url(#colorUv)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Zone Status */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Zone Status</h3>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Sales</th>
                      <th className="pb-3">Receivable</th>
                      <th className="pb-3">Sales</th>
                      <th className="pb-3">Receivable</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr>
                      <td className="py-2">Arena</td>
                      <td className="py-2">0</td>
                      <td className="py-2 text-green-500">3,239,461,056</td>
                      <td className="py-2">0</td>
                      <td className="py-2 text-red-500">(4,160,807)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Analysis Section */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Card className="p-4 bg-[#7E69AB] text-white">
                <h4 className="text-sm font-medium mb-4">Sales (bags) vs. Last Year</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Year to Date</span>
                    <span className="text-sm text-red-300">0 (-100%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Month to Date</span>
                    <span className="text-sm text-red-300">0 (0%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Day</span>
                    <span className="text-sm">0</span>
                  </div>
                </div>
              </Card>
              {/* Add more analysis cards as needed */}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
