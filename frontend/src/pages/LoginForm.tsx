import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { API_BASE_URL } from '../lib/config';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const LoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, form);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.name);
      if (user.is_admin) {
        localStorage.setItem('isAdmin', 'true');
      } else {
        localStorage.setItem('isAdmin', 'false');
      }
      window.dispatchEvent(new Event('storage'));
      toast({ title: 'Login Successful', description: 'Welcome back to PennyTools!' });
      navigate('/');
    } catch (error: any) {
      setIsLoading(false);
      if (error.response && error.response.status === 404) {
        setShowRegisterDialog(true);
      } else {
        setError('Invalid credentials');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
            <img src="/icon.png" alt="Logo" className="w-10 h-10 object-contain" />
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              PennyTools
            </span>
          </Link>
        </div>
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-gray-900">
              Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
            {error && (
              <div className="text-red-600 text-center mt-4">{error}</div>
            )}
            <div className="text-center mt-6">
              <span className="text-gray-700">Don't have an account? </span>
              <Link to="/register">
                <Button variant="outline" className="ml-2">Register</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <div className="text-center">
          <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            &larr; Back to Home
          </Link>
        </div>
      </div>
      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registration Required</DialogTitle>
            <DialogDescription>
              Please register yourself, then login.<br />
              <Link to="/register">
                <Button className="mt-4 w-full">Go to Register</Button>
              </Link>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoginForm; 