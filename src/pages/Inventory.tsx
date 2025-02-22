
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { StatsCard } from '@/components/StatsCard';
import { Package, PackageOpen, BoxSelect, Truck, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

interface Material {
  id: string;
  name: string;
  quantity: number;
  minRequired: number;
  unit: string;
}

interface Category {
  id: string;
  name: string;
  materials: Material[];
  color: string;
}

const colorPalettes = {
  electronics: ['#ea384c', '#8B5CF6', '#D946EF', '#0EA5E9'],
  metals: ['#ea384c', '#8B5CF6', '#D946EF', '#0EA5E9'],
  chemicals: ['#ea384c', '#8B5CF6', '#D946EF', '#0EA5E9'],
  plastics: ['#ea384c', '#8B5CF6', '#D946EF', '#0EA5E9'],
  packaging: ['#ea384c', '#8B5CF6', '#D946EF', '#0EA5E9']
};

const generatePieColors = (category: Category) => {
  const categoryType = Object.keys(colorPalettes).find(type => 
    category.name.toLowerCase().includes(type)
  ) || 'electronics';
  
  return colorPalettes[categoryType as keyof typeof colorPalettes];
};

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    color: '#3B82F6',
    materials: [
      { id: '1-1', name: 'Microchips', quantity: 500, minRequired: 100, unit: 'pcs' },
      { id: '1-2', name: 'Circuit Boards', quantity: 300, minRequired: 50, unit: 'pcs' },
    ]
  },
  {
    id: '2',
    name: 'Metal Parts',
    color: '#10B981',
    materials: [
      { id: '2-1', name: 'Steel Sheets', quantity: 1000, minRequired: 200, unit: 'kg' },
      { id: '2-2', name: 'Aluminum Rods', quantity: 800, minRequired: 150, unit: 'kg' },
    ]
  },
];

const Inventory = () => {
  const [categories, setCategories] = React.useState<Category[]>(mockCategories);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);
  const [newMaterial, setNewMaterial] = React.useState({
    name: '',
    quantity: '',
    minRequired: '',
    unit: ''
  });
  const [newCategoryName, setNewCategoryName] = React.useState('');

  const stats = [
    { 
      title: "Total Categories", 
      value: categories.length.toString(), 
      icon: <Package className="w-5 h-5" />, 
      trend: { value: 2, positive: true } 
    },
    { 
      title: "Total Materials", 
      value: categories.reduce((acc, cat) => acc + cat.materials.length, 0).toString(), 
      icon: <PackageOpen className="w-5 h-5" />, 
      trend: { value: 5, positive: true } 
    },
    { 
      title: "Low Stock Items", 
      value: categories.reduce((acc, cat) => 
        acc + cat.materials.filter(m => m.quantity < m.minRequired).length, 0).toString(),
      icon: <BoxSelect className="w-5 h-5" />, 
      trend: { value: 3, positive: false } 
    },
    { 
      title: "Stock Value", 
      value: "$123,456", 
      icon: <Truck className="w-5 h-5" />, 
      trend: { value: 8, positive: true } 
    },
  ];

  const handleAddCategory = () => {
    if (!newCategoryName) return;
    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName,
      materials: [],
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    };
    setCategories([...categories, newCategory]);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    if (selectedCategory?.id === categoryId) {
      setSelectedCategory(null);
    }
  };

  const handleAddMaterial = () => {
    if (!selectedCategory || !newMaterial.name || !newMaterial.quantity) return;
    
    const updatedCategories = categories.map(cat => {
      if (cat.id === selectedCategory.id) {
        return {
          ...cat,
          materials: [...cat.materials, {
            id: Date.now().toString(),
            name: newMaterial.name,
            quantity: Number(newMaterial.quantity),
            minRequired: Number(newMaterial.minRequired),
            unit: newMaterial.unit
          }]
        };
      }
      return cat;
    });
    
    setCategories(updatedCategories);
    setNewMaterial({ name: '', quantity: '', minRequired: '', unit: '' });
  };

  const getPieChartData = (category: Category) => {
    return category.materials.map(material => ({
      name: material.name,
      value: material.quantity
    }));
  };

  return (
    <Layout>
      <div className="space-y-8 bg-inventory-background min-h-screen">
        <div className="bg-gradient-to-br from-inventory-primary/20 via-inventory-accent to-inventory-background p-8 rounded-2xl">
          <h1 className="text-3xl font-semibold text-inventory-primary">Inventory Management</h1>
          <p className="text-secondary mt-2">Track and manage your inventory levels</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatsCard 
              key={stat.title} 
              {...stat} 
              className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 backdrop-blur-sm bg-white shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-inventory-primary">Add New Category</h3>
            <div className="flex gap-4">
              <Input
                placeholder="Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <Button onClick={handleAddCategory}>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>
          </Card>

          <Card className="p-6 backdrop-blur-sm bg-white shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-inventory-primary">Add New Material</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <select
                  className="border rounded-md p-2"
                  onChange={(e) => setSelectedCategory(categories.find(c => c.id === e.target.value) || null)}
                  value={selectedCategory?.id || ''}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <Input
                  placeholder="Material Name"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={newMaterial.quantity}
                  onChange={(e) => setNewMaterial({...newMaterial, quantity: e.target.value})}
                />
                <Input
                  type="number"
                  placeholder="Minimum Required"
                  value={newMaterial.minRequired}
                  onChange={(e) => setNewMaterial({...newMaterial, minRequired: e.target.value})}
                />
                <Input
                  placeholder="Unit (e.g., pcs, kg)"
                  value={newMaterial.unit}
                  onChange={(e) => setNewMaterial({...newMaterial, unit: e.target.value})}
                />
              </div>
              <Button onClick={handleAddMaterial} className="w-full">Add Material</Button>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {categories.map(category => (
            <Card key={category.id} className="p-6 bg-white shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-inventory-primary">{category.name}</h3>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Category
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Required</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {category.materials.map(material => (
                        <tr key={material.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material.minRequired}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getPieChartData(category)}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill={category.color}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {getPieChartData(category).map((entry, index) => {
                          const colors = generatePieColors(category);
                          return (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={colors[index % colors.length]}
                            />
                          );
                        })}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
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
