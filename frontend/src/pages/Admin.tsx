import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import AdminProductManager from '@/components/AdminProductManager';
import axios from 'axios';
import { API_BASE_URL } from '../lib/config';

const formatINR = (value: number) => {
  if (value == null || isNaN(value)) return '₹0.00';
  return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
};

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    averageOrderValue: 0,
    productPerformance: [],
    monthlySales: [],
    recentOrders: [],
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/orders/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="flex border-b mb-6">
        <button onClick={() => setActiveTab('dashboard')} className={`py-2 px-4 ${activeTab === 'dashboard' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Dashboard</button>
        <button onClick={() => setActiveTab('products')} className={`py-2 px-4 ${activeTab === 'products' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Manage Products</button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card><CardHeader><CardTitle>Total Revenue</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{formatINR(stats.totalRevenue)}</p></CardContent></Card>
            <Card><CardHeader><CardTitle>Total Sales</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{stats.totalSales}</p></CardContent></Card>
            <Card><CardHeader><CardTitle>Avg. Order Value</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{formatINR(stats.averageOrderValue)}</p></CardContent></Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Sales Overview</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip formatter={(value, name) => name === 'revenue' ? formatINR(value as number) : value} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue" />
                  <Bar yAxisId="right" dataKey="sales" fill="#82ca9d" name="Sales" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Top Selling Products</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Sales</TableHead><TableHead>Revenue</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {stats.productPerformance.map(p => (
                      <TableRow key={p.ProductId}>
                        <TableCell>{p.Product?.name || 'N/A'}</TableCell>
                        <TableCell>{p.salesCount}</TableCell>
                        <TableCell>{formatINR(p.revenue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Order ID</TableHead><TableHead>Customer</TableHead><TableHead>Date</TableHead><TableHead>Total</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {stats.recentOrders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell>#{order.id}</TableCell>
                        <TableCell>{order.name}</TableCell>
                        <TableCell>{format(new Date(order.createdAt), 'dd MMM, yyyy')}</TableCell>
                        <TableCell>{formatINR(order.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <AdminProductManager />
      )}
    </div>
  );
};

export default Admin;
