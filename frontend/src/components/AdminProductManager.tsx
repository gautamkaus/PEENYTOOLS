import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus } from 'lucide-react';
import axios from 'axios';
import { Switch } from '@/components/ui/switch';

const API_URL = 'http://localhost:5000/api/products';

const getAuthToken = () => localStorage.getItem('token');

// Helper for Indian Rupee formatting
const formatINR = (value) => {
  if (isNaN(value)) return value;
  return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 });
};

const AdminProductManager = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    image: '',
    rates: [],
    featured: false,
    discount: 0,
  });

  const [newRate, setNewRate] = useState({
    duration: '',
    rate: ''
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      toast({
        title: "Error fetching products",
        description: "Could not load products from the server.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.rates.length) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const productToAdd = {
      ...newProduct,
      featured: !!newProduct.featured
    };

    try {
      await axios.post(API_URL, productToAdd, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });
      toast({
        title: "Product Added",
        description: "New AI tool has been added successfully.",
      });
      fetchProducts(); // Refresh list
      setNewProduct({
        name: '',
        description: '',
        category: '',
        image: '',
        rates: [],
        featured: false,
        discount: 0,
      });
      setShowAddForm(false);
      setNewRate({ duration: '', rate: '' });
    } catch (error) {
      toast({
        title: "Error adding product",
        description: "Could not add the product.",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = async (product) => {
    try {
      const response = await axios.get(`${API_URL}/${product.id}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });
      const freshProduct = response.data;
      setEditingProduct({
        ...freshProduct,
        rates: (freshProduct.rates || []).map(rate => ({
          duration: rate.duration,
          rate: rate.rate?.toString?.() ?? ''
        })),
        featured: !!freshProduct.featured
      });
      setShowAddForm(true);
    } catch (error) {
      toast({
        title: "Error fetching product",
        description: "Could not fetch product details for editing.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    const productToUpdate = {
        ...editingProduct,
        rates: editingProduct.rates.map(rate => ({
            duration: rate.duration,
            rate: parseFloat(rate.rate)
        })),
        featured: !!editingProduct.featured
    };

    try {
        await axios.put(`${API_URL}/${editingProduct.id}`, productToUpdate, {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        toast({
            title: "Product Updated",
            description: "Product has been updated successfully.",
        });
        fetchProducts();
        setEditingProduct(null);
    } catch (error) {
        toast({
            title: "Error updating product",
            description: "Could not update the product.",
            variant: "destructive",
        });
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
        try {
            await axios.delete(`${API_URL}/${productId}`, {
                headers: { Authorization: `Bearer ${getAuthToken()}` }
            });
            toast({
                title: "Product Deleted",
                description: "Product has been deleted successfully.",
            });
            fetchProducts();
        } catch (error) {
            toast({
                title: "Error deleting product",
                description: "Could not delete the product.",
                variant: "destructive",
            });
        }
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Product Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Button 
          onClick={() => {
            setShowAddForm(true);
            setEditingProduct(null);
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Product
        </Button>
      </div>

      {/* Add/Edit Product Form */}
      {(showAddForm || editingProduct) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct ? 'Edit AI Tool' : 'Add New AI Tool'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={editingProduct ? editingProduct.name : newProduct.name}
                  onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, name: e.target.value}) : setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="AI Tool Name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={editingProduct ? editingProduct.category : newProduct.category}
                  onValueChange={(value) => editingProduct ? setEditingProduct({...editingProduct, category: value}) : setNewProduct(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="content">Content AI</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingProduct ? editingProduct.description : newProduct.description}
                  onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, description: e.target.value}) : setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the product"
                />
              </div>

              <div>
                <Label htmlFor="rates">Rates</Label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    id="duration"
                    type="number"
                    value={newRate.duration}
                    onChange={(e) => setNewRate({...newRate, duration: e.target.value})}
                    placeholder="Duration (months)"
                  />
                  <Input
                    id="rate"
                    type="number"
                    step="any"
                    value={newRate.rate}
                    onChange={(e) => setNewRate({...newRate, rate: e.target.value})}
                    placeholder="Rate (₹)"
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => {
                      if (newRate.duration && newRate.rate) {
                        const currentRates = editingProduct ? editingProduct.rates : newProduct.rates;
                        const updatedRates = [...currentRates, { duration: parseInt(newRate.duration), rate: parseFloat(newRate.rate) }];
                        
                        if (editingProduct) {
                          setEditingProduct({...editingProduct, rates: updatedRates});
                        } else {
                          setNewProduct(prev => ({ ...prev, rates: updatedRates }));
                        }
                        
                        setNewRate({ duration: '', rate: '' });
                      }
                    }}
                  >
                    Add Rate
                  </Button>
                </div>
                
                {/* Display current rates */}
                <div className="space-y-2">
                  {(editingProduct ? editingProduct.rates : newProduct.rates).map((rate, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>{rate.duration} months - {formatINR(rate.rate)}</span>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const currentRates = editingProduct ? editingProduct.rates : newProduct.rates;
                          const updatedRates = currentRates.filter((_, i) => i !== index);
                          
                          if (editingProduct) {
                            setEditingProduct({...editingProduct, rates: updatedRates});
                          } else {
                            setNewProduct(prev => ({ ...prev, rates: updatedRates }));
                          }
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={editingProduct ? editingProduct.image : newProduct.image}
                  onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, image: e.target.value}) : setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-4">
                <Label htmlFor="featured" className="text-lg">Feature this product?</Label>
                <Switch
                  id="featured"
                  checked={editingProduct ? editingProduct.featured : newProduct.featured}
                  onCheckedChange={(checked) => {
                    if (editingProduct) {
                      setEditingProduct({ ...editingProduct, featured: checked });
                    } else {
                      setNewProduct(prev => ({ ...prev, featured: checked }));
                    }
                  }}
                />
              </div>

              <div>
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={editingProduct ? editingProduct.discount : newProduct.discount}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (editingProduct) {
                      setEditingProduct({ ...editingProduct, discount: isNaN(value) ? 0 : value });
                    } else {
                      setNewProduct(prev => ({ ...prev, discount: isNaN(value) ? 0 : value }));
                    }
                  }}
                  placeholder="e.g. 10 for 10%"
                />
              </div>

              <div className="md:col-span-2 flex justify-end space-x-2">
                <Button variant="ghost" type="button" onClick={() => {
                  setEditingProduct(null);
                  setShowAddForm(false);
                }}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Rates</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {(product.rates || []).map((rate, index) => (
                        <div key={index} className="text-xs">
                          <span className="font-medium">{rate.duration}:</span> {formatINR(rate.rate)}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.featured ? <Badge className="bg-blue-100 text-blue-800">Featured</Badge> : ''}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditProduct(product)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProductManager;
