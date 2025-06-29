import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, addMonths } from 'date-fns';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { API_BASE_URL } from '../lib/config';

// Helper for Indian Rupee formatting
const formatINR = (value: number) => {
  if (value == null || isNaN(value)) return '₹0.00';
  return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 });
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view your orders.');
          setLoading(false);
          return;
        }
        const res = await axios.get(`${API_BASE_URL}/api/orders/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        setError('Failed to fetch order history.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Order History</h1>
        {orders.length === 0 ? (
          <div className="text-center text-gray-500">No orders found.</div>
        ) : (
          <div className="space-y-8">
            {orders.map(order => (
              <Card key={order.id} className="shadow-lg border border-blue-100 rounded-2xl hover:shadow-2xl transition-all">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-blue-900 mb-1">Order #{order.id}</CardTitle>
                    <div className="text-gray-500 text-sm">Placed on: {format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}</div>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <span className="text-lg font-semibold text-blue-700">Total: {formatINR(order.total)}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 bg-white rounded-b-2xl">
                  <div className="mb-3 font-semibold text-blue-800 text-lg">Items</div>
                  <ul className="divide-y divide-blue-50">
                    {order.OrderItems.map(item => {
                      const startDate = new Date(order.createdAt);
                      const endDate = addMonths(startDate, item.duration);
                      return (
                        <li key={item.id} className="flex flex-col md:flex-row md:items-center md:justify-between py-4">
                          <div>
                            <span className="font-medium text-gray-900">{item.Product?.name || 'Product'}</span>
                            <span className="ml-2 text-gray-500">({item.duration} month{item.duration > 1 ? 's' : ''})</span>
                            <span className="block text-xs text-green-700 mt-1">Active Till: {format(endDate, 'dd MMM yyyy')}</span>
                          </div>
                          <div className="mt-2 md:mt-0 text-right">
                            <span className="text-lg font-bold text-blue-700">{formatINR(item.total_price)}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory; 