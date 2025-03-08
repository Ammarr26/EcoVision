
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
  },
  {
    id: '2',
    name: 'Metal Parts',
    color: '#10B981',
    materials: [
      { id: '2-1', name: 'Steel Sheets', quantity: 1000, minRequired: 200, unit: 'kg', location: 'Rack C1', supplier: 'MetalWorks Co.' },
      { id: '2-2', name: 'Aluminum Rods', quantity: 800, minRequired: 150, unit: 'kg', expiryDate: '2024-11-20', location: 'Rack C2', supplier: 'AlumaTech' },
    ]
  },
  {
    id: '3',
    name: 'Chemicals',
    color: '#F97316',
    materials: [
      { id: '3-1', name: 'Cleaning Solvent', quantity: 200, minRequired: 50, unit: 'L', expiryDate: '2023-09-15', location: 'Cabinet D1', supplier: 'ChemCorp' },
      { id: '3-2', name: 'Adhesive', quantity: 150, minRequired: 30, unit: 'L', expiryDate: '2023-10-05', location: 'Cabinet D2', supplier: 'StickFast Inc.' },
    ]
  },
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
      title: "Stock Value", 
      value: "$123,456", 
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
      <div className="space-y-8 bg-inventory-background min-h-screen">
        <div className="bg-gradient-to-br from-inventory-primary/20 via-inventory-accent to-inventory-background p-8 rounded-2xl">
          <h1 className="text-3xl font-semibold text-inventory-primary">Inventory Management</h1>
          <p className="text-secondary mt-2">Track and manage your inventory levels</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <StatsCard 
              key={stat.title} 
              {...stat} 
              className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white"
            />
          ))}
        </div>

        {(expiringMaterials.length > 0 || expiredMaterials.length > 0) && (
          <Card className="p-6 backdrop-blur-sm bg-white shadow-lg border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-inventory-primary flex items-center">
                <Clock className="w-5 h-5 mr-2 text-amber-500" />
                Materials Expiring Soon
              </h3>
              <span className="text-xs text-secondary bg-amber-100 px-2 py-1 rounded-full">
                {expiringMaterials.length} expiring soon • {expiredMaterials.length} expired
              </span>
            </div>
            
            <div className="space-y-6">
              {expiringMaterials.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-secondary mb-2">Expiring Soon</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {expiringMaterials.slice(0, 4).map(({ material, category, daysLeft }) => (
                      <div key={material.id} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex justify-between">
                          <span className="font-medium">{material.name}</span>
                          <span className="text-amber-600 text-sm">{daysLeft} days left</span>
                        </div>
                        <div className="text-sm text-secondary mt-1">
                          Category: {category} • Qty: {material.quantity} {material.unit}
                        </div>
                        <div className="mt-2 text-xs italic text-amber-700">
                          {daysLeft <= 7 
                            ? "Use in production immediately or consider discounting."
                            : "Plan to use in upcoming production cycles."}
                        </div>
                      </div>
                    ))}
                  </div>
                  {expiringMaterials.length > 4 && (
                    <div className="text-right mt-2">
                      <Button variant="link" size="sm" className="text-amber-600">
                        View all {expiringMaterials.length} expiring items
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {expiredMaterials.slice(0, 2).map(({ material, category, daysOverdue }) => (
                      <div key={material.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex justify-between">
                          <span className="font-medium">{material.name}</span>
                          <span className="text-destructive text-sm">Expired {daysOverdue} days ago</span>
                        </div>
                        <div className="text-sm text-secondary mt-1">
                          Category: {category} • Qty: {material.quantity} {material.unit}
                        </div>
                        <div className="mt-2 text-xs italic text-destructive">
                          Review for disposal or special handling according to company policy.
                        </div>
                      </div>
                    ))}
                  </div>
                  {expiredMaterials.length > 2 && (
                    <div className="text-right mt-2">
                      <Button variant="link" size="sm" className="text-destructive">
                        View all {expiredMaterials.length} expired items
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        )}

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="Expiry Date (if applicable)"
                  value={newMaterial.expiryDate}
                  onChange={(e) => setNewMaterial({...newMaterial, expiryDate: e.target.value})}
                />
                <Input
                  placeholder="Storage Location"
                  value={newMaterial.location}
                  onChange={(e) => setNewMaterial({...newMaterial, location: e.target.value})}
                />
                <Input
                  placeholder="Supplier"
                  value={newMaterial.supplier}
                  onChange={(e) => setNewMaterial({...newMaterial, supplier: e.target.value})}
                />
              </div>
              <Button onClick={handleAddMaterial} className="w-full">Add Material</Button>
            </div>
          </Card>
        </div>

        <Card className="p-6 backdrop-blur-sm bg-white shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h3 className="text-xl font-semibold text-inventory-primary">Inventory Items</h3>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full md:w-60"
                />
              </div>
              <Button 
                variant={filterExpiring ? "default" : "outline"}
                size="sm" 
                onClick={() => setFilterExpiring(!filterExpiring)}
                className="flex items-center"
              >
                <FilterIcon className="w-4 h-4 mr-1" />
                {filterExpiring ? "Show All" : "Show Expiring Only"}
              </Button>
            </div>
          </div>
          
          {filteredCategories.length === 0 ? (
            <div className="text-center py-8 text-secondary">
              No items match your search criteria.
            </div>
          ) : (
            filteredCategories.map(category => (
              <div key={category.id} className="mb-8 last:mb-0">
                <div className="flex justify-between items-center mb-4">
                  {editingCategoryId === category.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-48"
                      />
                      <Button
                        size="sm"
                        className="text-green-600"
                        variant="ghost"
                        onClick={() => saveEditedCategory(category.id)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="text-red-600"
                        variant="ghost"
                        onClick={() => setEditingCategoryId(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-inventory-primary">{category.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCategory(category.id, category.name)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
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
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {category.materials.map(material => {
                          const daysUntilExpiry = getDaysUntilExpiry(material.expiryDate);
                          const isExpired = daysUntilExpiry !== null && daysUntilExpiry < 0;
                          const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
                          
                          return (
                            <tr key={material.id}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                {editingMaterialId === material.id ? (
                                  <div className="flex items-center gap-2">
                                    <Input
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      className="w-32"
                                    />
                                    <Button
                                      size="sm"
                                      className="text-green-600"
                                      variant="ghost"
                                      onClick={() => saveEditedMaterial(category.id, material.id)}
                                    >
                                      <Check className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="text-red-600"
                                      variant="ghost"
                                      onClick={() => setEditingMaterialId(null)}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <span>{material.name}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditMaterial(material.id, material.name)}
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                )}
                                {material.location && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    Location: {material.location}
                                  </div>
                                )}
                                {material.supplier && (
                                  <div className="text-xs text-gray-500">
                                    Supplier: {material.supplier}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                {material.quantity <= material.minRequired ? (
                                  <span className="text-red-500 font-medium">{material.quantity}</span>
                                ) : (
                                  material.quantity
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{material.minRequired}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{material.unit}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                {material.expiryDate ? (
                                  <div>
                                    <div className={`
                                      ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-amber-600' : 'text-gray-600'}
                                    `}>
                                      {new Date(material.expiryDate).toLocaleDateString()}
                                    </div>
                                    {isExpired ? (
                                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                        Expired
                                      </span>
                                    ) : isExpiringSoon ? (
                                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                        {daysUntilExpiry} days left
                                      </span>
                                    ) : null}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">N/A</span>
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                <Button
                                  variant="ghost" 
                                  size="sm"
                                  className="text-red-500"
                                  onClick={() => handleDeleteMaterial(category.id, material.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
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
              </div>
            ))
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Inventory;
