
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { StatsCard } from '@/components/StatsCard';
import { 
  Package, 
  PackageOpen, 
  Truck, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Clock, 
  AlertTriangle,
  Search,
  FilterIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
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
  expiryDate?: string;
  location?: string;
  supplier?: string;
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

// Starting with just the Electronics category to save space
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    color: '#3B82F6',
    materials: [
      { id: '1-1', name: 'Microchips', quantity: 500, minRequired: 100, unit: 'pcs', expiryDate: '2025-12-31', location: 'Shelf A1', supplier: 'Techtronic Inc.' },
      { id: '1-2', name: 'Circuit Boards', quantity: 300, minRequired: 50, unit: 'pcs', expiryDate: '2024-08-15', location: 'Shelf A2', supplier: 'CircuitPro LLC' },
      { id: '1-3', name: 'Transistors', quantity: 800, minRequired: 200, unit: 'pcs', expiryDate: '2023-10-30', location: 'Drawer B3', supplier: 'Techtronic Inc.' },
    ]
  }
];

const Inventory = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExpiring, setFilterExpiring] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    quantity: '',
    minRequired: '',
    unit: '',
    expiryDate: '',
    location: '',
    supplier: ''
  });
  const [newCategoryName, setNewCategoryName] = useState('');
  const { toast } = useToast();

  // Calculate total inventory count
  const totalInventoryCount = categories.reduce((acc, category) => {
    return acc + category.materials.reduce((sum, material) => sum + material.quantity, 0);
  }, 0);

  // Calculate total number of materials
  const totalMaterialsCount = categories.reduce((acc, category) => acc + category.materials.length, 0);
  
  // Calculate total categories
  const totalCategoriesCount = categories.length;

  const stats = [
    { 
      title: "Total Items", 
      value: totalInventoryCount.toString(), 
      icon: <Package className="w-5 h-5" />, 
      trend: { value: 12, positive: true } 
    },
    { 
      title: "Materials Types", 
      value: totalMaterialsCount.toString(), 
      icon: <PackageOpen className="w-5 h-5" />, 
      trend: { value: 5, positive: true } 
    },
    { 
      title: "Categories", 
      value: totalCategoriesCount.toString(), 
      icon: <Truck className="w-5 h-5" />, 
      trend: { value: 8, positive: true } 
    },
  ];

  // Function to calculate days until expiry
  const getDaysUntilExpiry = (expiryDate: string | undefined) => {
    if (!expiryDate) return null;
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Get materials that are expiring soon (within 30 days)
  const getExpiringMaterials = () => {
    const expiringMaterials: {material: Material, category: string, daysLeft: number}[] = [];
    
    categories.forEach(category => {
      category.materials.forEach(material => {
        const daysLeft = getDaysUntilExpiry(material.expiryDate);
        if (daysLeft !== null && daysLeft <= 30 && daysLeft >= 0) {
          expiringMaterials.push({
            material,
            category: category.name,
            daysLeft
          });
        }
      });
    });
    
    return expiringMaterials.sort((a, b) => a.daysLeft - b.daysLeft);
  };

  // Get expired materials
  const getExpiredMaterials = () => {
    const expiredMaterials: {material: Material, category: string, daysOverdue: number}[] = [];
    
    categories.forEach(category => {
      category.materials.forEach(material => {
        const daysLeft = getDaysUntilExpiry(material.expiryDate);
        if (daysLeft !== null && daysLeft < 0) {
          expiredMaterials.push({
            material,
            category: category.name,
            daysOverdue: Math.abs(daysLeft)
          });
        }
      });
    });
    
    return expiredMaterials.sort((a, b) => b.daysOverdue - a.daysOverdue);
  };

  const expiringMaterials = getExpiringMaterials();
  const expiredMaterials = getExpiredMaterials();

  const handleEditCategory = (categoryId: string, currentName: string) => {
    setEditingCategoryId(categoryId);
    setEditValue(currentName);
  };

  const handleEditMaterial = (materialId: string, currentName: string) => {
    setEditingMaterialId(materialId);
    setEditValue(currentName);
  };

  const saveEditedCategory = (categoryId: string) => {
    if (!editValue.trim()) return;
    
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, name: editValue } : cat
    ));
    setEditingCategoryId(null);
    setEditValue('');
    
    toast({
      title: "Category updated",
      description: `Category name updated to "${editValue}"`,
    });
  };

  const saveEditedMaterial = (categoryId: string, materialId: string) => {
    if (!editValue.trim()) return;
    
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          materials: cat.materials.map(mat => 
            mat.id === materialId ? { ...mat, name: editValue } : mat
          )
        };
      }
      return cat;
    }));
    setEditingMaterialId(null);
    setEditValue('');
    
    toast({
      title: "Material updated",
      description: `Material name updated to "${editValue}"`,
    });
  };

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
    
    toast({
      title: "Category added",
      description: `New category "${newCategoryName}" has been added`,
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    const categoryToDelete = categories.find(cat => cat.id === categoryId);
    
    setCategories(categories.filter(cat => cat.id !== categoryId));
    if (selectedCategory?.id === categoryId) {
      setSelectedCategory(null);
    }
    
    if (categoryToDelete) {
      toast({
        title: "Category deleted",
        description: `Category "${categoryToDelete.name}" has been removed`,
        variant: "destructive",
      });
    }
  };

  const handleAddMaterial = () => {
    if (!selectedCategory || !newMaterial.name || !newMaterial.quantity) {
      toast({
        title: "Missing information",
        description: "Please fill in at least the category, name, and quantity",
        variant: "destructive",
      });
      return;
    }
    
    const updatedCategories = categories.map(cat => {
      if (cat.id === selectedCategory.id) {
        return {
          ...cat,
          materials: [...cat.materials, {
            id: Date.now().toString(),
            name: newMaterial.name,
            quantity: Number(newMaterial.quantity),
            minRequired: Number(newMaterial.minRequired) || 0,
            unit: newMaterial.unit,
            expiryDate: newMaterial.expiryDate || undefined,
            location: newMaterial.location || undefined,
            supplier: newMaterial.supplier || undefined
          }]
        };
      }
      return cat;
    });
    
    setCategories(updatedCategories);
    setNewMaterial({ 
      name: '', 
      quantity: '', 
      minRequired: '', 
      unit: '', 
      expiryDate: '',
      location: '',
      supplier: ''
    });
    
    toast({
      title: "Material added",
      description: `"${newMaterial.name}" has been added to ${selectedCategory.name}`,
    });
  };

  const handleDeleteMaterial = (categoryId: string, materialId: string) => {
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex === -1) return;
    
    const materialName = categories[categoryIndex].materials.find(m => m.id === materialId)?.name;
    
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex] = {
      ...updatedCategories[categoryIndex],
      materials: updatedCategories[categoryIndex].materials.filter(
        material => material.id !== materialId
      )
    };
    
    setCategories(updatedCategories);
    
    toast({
      title: "Material deleted",
      description: `"${materialName}" has been removed`,
      variant: "destructive",
    });
  };

  const getPieChartData = (category: Category) => {
    return category.materials.map(material => ({
      name: material.name,
      value: material.quantity
    }));
  };

  const filteredCategories = categories.map(category => {
    if (!searchTerm && !filterExpiring) return category;
    
    let filteredMaterials = category.materials;
    
    // Apply search filter
    if (searchTerm) {
      filteredMaterials = filteredMaterials.filter(material => 
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply expiring filter
    if (filterExpiring) {
      filteredMaterials = filteredMaterials.filter(material => {
        const daysLeft = getDaysUntilExpiry(material.expiryDate);
        return daysLeft !== null && daysLeft <= 30;
      });
    }
    
    return {
      ...category,
      materials: filteredMaterials
    };
  }).filter(category => category.materials.length > 0);

  return (
    <Layout>
      <div className="space-y-6 bg-inventory-background min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-br from-inventory-primary/20 via-inventory-accent to-inventory-background p-6 rounded-xl">
          <h1 className="text-2xl font-semibold text-inventory-primary">Inventory Management</h1>
          <p className="text-secondary mt-1">Track and manage your inventory items efficiently</p>
        </div>

        {/* Search and Filter Bar */}
        <Card className="p-4 backdrop-blur-sm bg-white shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-auto flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search materials, suppliers, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button 
                variant={filterExpiring ? "default" : "outline"}
                size="sm" 
                onClick={() => setFilterExpiring(!filterExpiring)}
                className="flex items-center whitespace-nowrap"
              >
                <FilterIcon className="w-4 h-4 mr-1" />
                {filterExpiring ? "Show All" : "Show Expiring Only"}
              </Button>
              <Button
                size="sm"
                onClick={() => setSearchTerm('')}
                variant="outline"
                className="whitespace-nowrap"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <StatsCard 
              key={stat.title} 
              {...stat} 
              className="border-none shadow-md hover:shadow-lg transition-shadow bg-white"
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Category & Material Forms */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-5 backdrop-blur-sm bg-white shadow-md">
              <h3 className="text-md font-semibold mb-3 text-inventory-primary">Add New Category</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Category Name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddCategory} size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </Card>

            <Card className="p-5 backdrop-blur-sm bg-white shadow-md">
              <h3 className="text-md font-semibold mb-3 text-inventory-primary">Add New Material</h3>
              <div className="space-y-3">
                <select
                  className="w-full border rounded-md p-2 text-sm"
                  onChange={(e) => setSelectedCategory(categories.find(c => c.id === e.target.value) || null)}
                  value={selectedCategory?.id || ''}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-3">
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
                    placeholder="Unit (e.g., pcs, kg)"
                    value={newMaterial.unit}
                    onChange={(e) => setNewMaterial({...newMaterial, unit: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder="Minimum Required"
                    value={newMaterial.minRequired}
                    onChange={(e) => setNewMaterial({...newMaterial, minRequired: e.target.value})}
                  />
                  <Input
                    type="date"
                    placeholder="Expiry Date"
                    value={newMaterial.expiryDate}
                    onChange={(e) => setNewMaterial({...newMaterial, expiryDate: e.target.value})}
                  />
                  <Input
                    placeholder="Storage Location"
                    value={newMaterial.location}
                    onChange={(e) => setNewMaterial({...newMaterial, location: e.target.value})}
                  />
                  <div className="col-span-2">
                    <Input
                      placeholder="Supplier"
                      value={newMaterial.supplier}
                      onChange={(e) => setNewMaterial({...newMaterial, supplier: e.target.value})}
                    />
                  </div>
                </div>
                <Button onClick={handleAddMaterial} className="w-full" size="sm">Add Material</Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Inventory Items */}
          <div className="lg:col-span-3">
            <Card className="p-5 backdrop-blur-sm bg-white shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-inventory-primary">Inventory Items</h3>
                {filteredCategories.length === 0 && searchTerm && (
                  <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                    No results for "{searchTerm}" - try another search
                  </div>
                )}
              </div>
              
              {filteredCategories.length === 0 ? (
                <div className="text-center py-8 text-secondary">
                  {searchTerm ? "No items match your search criteria." : "No categories available. Add your first category above."}
                </div>
              ) : (
                filteredCategories.map(category => (
                  <div key={category.id} className="mb-6 last:mb-0">
                    <div className="flex justify-between items-center mb-3">
                      {editingCategoryId === category.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-48 text-sm"
                          />
                          <Button
                            size="sm"
                            className="text-green-600 h-8 w-8 p-0"
                            variant="ghost"
                            onClick={() => saveEditedCategory(category.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="text-red-600 h-8 w-8 p-0"
                            variant="ghost"
                            onClick={() => setEditingCategoryId(null)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h3 className="text-md font-semibold text-inventory-primary">{category.name}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditCategory(category.id, category.name)}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      )}
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Delete
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="overflow-x-auto bg-gray-50 rounded-lg p-2">
                        <table className="min-w-full rounded-lg text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {category.materials.map(material => {
                              const daysUntilExpiry = getDaysUntilExpiry(material.expiryDate);
                              const isExpired = daysUntilExpiry !== null && daysUntilExpiry < 0;
                              const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
                              
                              return (
                                <tr key={material.id} className="hover:bg-gray-100 transition-colors">
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {editingMaterialId === material.id ? (
                                      <div className="flex items-center gap-1">
                                        <Input
                                          value={editValue}
                                          onChange={(e) => setEditValue(e.target.value)}
                                          className="w-28 h-7 text-xs"
                                        />
                                        <Button
                                          size="sm"
                                          className="text-green-600 h-7 w-7 p-0"
                                          variant="ghost"
                                          onClick={() => saveEditedMaterial(category.id, material.id)}
                                        >
                                          <Check className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          className="text-red-600 h-7 w-7 p-0"
                                          variant="ghost"
                                          onClick={() => setEditingMaterialId(null)}
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <div>
                                        <div className="font-medium flex items-center">
                                          {material.name}
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 ml-1"
                                            onClick={() => handleEditMaterial(material.id, material.name)}
                                          >
                                            <Edit2 className="w-3 h-3" />
                                          </Button>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-0.5 space-x-1">
                                          {material.location && <span>Location: {material.location}</span>}
                                          {material.supplier && <span>• Supplier: {material.supplier}</span>}
                                        </div>
                                        {material.expiryDate && (
                                          <div className={`text-xs mt-0.5 ${
                                            isExpired ? 'text-red-600' : 
                                            isExpiringSoon ? 'text-amber-600' : 
                                            'text-gray-500'
                                          }`}>
                                            {isExpired ? 'Expired' : 'Expires'}: {new Date(material.expiryDate).toLocaleDateString()}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                                    {material.quantity <= material.minRequired ? (
                                      <span className="text-red-500 font-medium">{material.quantity}</span>
                                    ) : (
                                      material.quantity
                                    )}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{material.unit}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                    <Button
                                      variant="ghost" 
                                      size="sm"
                                      className="text-red-500 h-7 w-7 p-0"
                                      onClick={() => handleDeleteMaterial(category.id, material.id)}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={getPieChartData(category)}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
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
                  </div>
                ))
              )}
            </Card>
          </div>
        </div>

        {/* Expiry Tracking Section (Moved to the bottom) */}
        {(expiringMaterials.length > 0 || expiredMaterials.length > 0) && (
          <Card className="p-5 backdrop-blur-sm bg-white shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-inventory-primary flex items-center">
                <Clock className="w-5 h-5 mr-2 text-amber-500" />
                Materials Expiry Tracker
              </h3>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                {expiringMaterials.length} expiring soon • {expiredMaterials.length} expired
              </span>
            </div>
            
            <div className="space-y-4">
              {expiringMaterials.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-secondary mb-2">Expiring Soon</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {expiringMaterials.slice(0, 3).map(({ material, category, daysLeft }) => (
                      <div key={material.id} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{material.name}</span>
                          <span className="text-amber-600 text-xs bg-amber-100 px-1.5 py-0.5 rounded-full">
                            {daysLeft} days left
                          </span>
                        </div>
                        <div className="text-sm text-secondary mt-1">
                          Category: {category} • Qty: {material.quantity} {material.unit}
                        </div>
                        <div className="mt-2 text-xs italic text-amber-700">
                          {daysLeft <= 7 
                            ? "Urgent: Use in production or discount."
                            : "Plan to use in upcoming production."}
                        </div>
                      </div>
                    ))}
                  </div>
                  {expiringMaterials.length > 3 && (
                    <div className="text-right mt-2">
                      <Button variant="link" size="sm" className="text-amber-600">
                        View all {expiringMaterials.length} expiring items →
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {expiredMaterials.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-destructive mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Expired Materials
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {expiredMaterials.slice(0, 3).map(({ material, category, daysOverdue }) => (
                      <div key={material.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{material.name}</span>
                          <span className="text-destructive text-xs bg-red-100 px-1.5 py-0.5 rounded-full">
                            {daysOverdue} days ago
                          </span>
                        </div>
                        <div className="text-sm text-secondary mt-1">
                          Category: {category} • Qty: {material.quantity} {material.unit}
                        </div>
                        <div className="mt-2 text-xs italic text-destructive">
                          Review for disposal per company policy.
                        </div>
                      </div>
                    ))}
                  </div>
                  {expiredMaterials.length > 3 && (
                    <div className="text-right mt-2">
                      <Button variant="link" size="sm" className="text-destructive">
                        View all {expiredMaterials.length} expired items →
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Inventory;
