
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // This is a mock login. In a real app, you would validate credentials against a backend
    setTimeout(() => {
      // Mock credentials - in a real app this would be authenticated against a backend
      if (email === 'admin@barrush.co.ke' && password === 'admin123') {
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        toast.error('Invalid credentials');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-barrush-midnight to-black flex flex-col items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
        }}
      />
      
      <div className="w-full max-w-md z-10">
        <Card className="bg-barrush-slate/40 backdrop-blur-sm border-barrush-copper/30">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-barrush-copper font-serif tracking-wide">
              BARRUSH
            </CardTitle>
            <CardDescription className="text-barrush-platinum/80">
              Admin Dashboard Login
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-barrush-platinum">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@barrush.co.ke"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-barrush-midnight/50 border-barrush-copper/30 text-barrush-platinum"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-barrush-platinum">Password</Label>
                  <a href="#" className="text-sm text-barrush-copper hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-barrush-midnight/50 border-barrush-copper/30 text-barrush-platinum"
                />
              </div>
              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full transition-all duration-300 bg-barrush-copper hover:bg-barrush-copper/90 text-barrush-midnight font-medium"
              >
                {isLoading ? 'Logging in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              variant="link" 
              onClick={() => navigate('/')}
              className="text-barrush-copper hover:text-barrush-copper/80"
            >
              Back to Website
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
