
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  LineChart
} from 'recharts';

// Sample data - this would be replaced with actual data from backend
const orderData = [
  { id: 1, customer: "John Doe", location: "Kilifi Town", items: "Whiskey, Gin", amount: 3500, time: "2023-06-06 14:30", status: "Delivered" },
  { id: 2, customer: "Jane Smith", location: "Watamu", items: "Vodka, Mixers", amount: 2200, time: "2023-06-06 16:45", status: "In Transit" },
  { id: 3, customer: "Mark Johnson", location: "Malindi", items: "Wine, Champagne", amount: 5800, time: "2023-06-06 18:20", status: "Processing" },
  { id: 4, customer: "Sarah Williams", location: "Mtwapa", items: "Beer, Cider", amount: 1800, time: "2023-06-06 19:10", status: "Delivered" },
  { id: 5, customer: "Robert Brown", location: "Kikambala", items: "Rum, Cola", amount: 2500, time: "2023-06-06 20:30", status: "Delivered" },
];

const dailyData = [
  { name: 'Mon', orders: 4, revenue: 12000 },
  { name: 'Tue', orders: 3, revenue: 9500 },
  { name: 'Wed', orders: 6, revenue: 19200 },
  { name: 'Thu', orders: 8, revenue: 24600 },
  { name: 'Fri', orders: 12, revenue: 36000 },
  { name: 'Sat', orders: 15, revenue: 45000 },
  { name: 'Sun', orders: 10, revenue: 32000 },
];

const monthlyData = [
  { name: 'Jan', orders: 120, revenue: 380000 },
  { name: 'Feb', orders: 100, revenue: 320000 },
  { name: 'Mar', orders: 140, revenue: 450000 },
  { name: 'Apr', orders: 160, revenue: 510000 },
  { name: 'May', orders: 180, revenue: 580000 },
  { name: 'Jun', orders: 220, revenue: 700000 },
];

const chartConfig = {
  orders: {
    label: "Orders",
    theme: {
      light: "#c9a96e",
      dark: "#c9a96e",
    },
  },
  revenue: {
    label: "Revenue",
    theme: {
      light: "#374151", 
      dark: "#6b7280",
    },
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(true); // In reality would check auth status
  
  // Mock authentication check
  React.useEffect(() => {
    // In a real app, check authentication here
    // If not authenticated, redirect to login
    if (!authenticated) {
      navigate('/');
    }
  }, [authenticated, navigate]);

  if (!authenticated) {
    return null; // Will redirect via effect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-barrush-midnight to-black text-barrush-platinum">
      <header className="border-b border-barrush-copper/20 bg-barrush-midnight/90 backdrop-blur-sm sticky top-0 z-30">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-barrush-copper font-serif tracking-wider">
              BARRUSH <span className="text-sm font-normal text-barrush-platinum/70">ADMIN</span>
            </h1>
          </div>
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="border-barrush-copper/50 text-barrush-copper hover:bg-barrush-copper/10"
          >
            Return to Website
          </Button>
        </div>
      </header>

      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-barrush-copper font-serif">Dashboard</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-barrush-slate/40 border-barrush-copper/20">
            <CardHeader>
              <CardTitle className="text-barrush-platinum">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-barrush-copper">128</p>
            </CardContent>
            <CardFooter className="text-sm text-barrush-platinum/60">+12% from last week</CardFooter>
          </Card>
          
          <Card className="bg-barrush-slate/40 border-barrush-copper/20">
            <CardHeader>
              <CardTitle className="text-barrush-platinum">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-barrush-copper">KSh 347,800</p>
            </CardContent>
            <CardFooter className="text-sm text-barrush-platinum/60">+8% from last week</CardFooter>
          </Card>
          
          <Card className="bg-barrush-slate/40 border-barrush-copper/20">
            <CardHeader>
              <CardTitle className="text-barrush-platinum">Active Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-barrush-copper">7</p>
            </CardContent>
            <CardFooter className="text-sm text-barrush-platinum/60">2 pending, 5 in transit</CardFooter>
          </Card>
        </div>

        {/* Tabs for Reports */}
        <Tabs defaultValue="daily" className="mb-8">
          <TabsList className="grid grid-cols-2 max-w-md mb-4 bg-barrush-slate/40">
            <TabsTrigger value="daily">Daily Report</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily">
            <Card className="bg-barrush-slate/40 border-barrush-copper/20">
              <CardHeader>
                <CardTitle className="text-barrush-platinum">Daily Orders & Revenue</CardTitle>
                <CardDescription className="text-barrush-platinum/70">
                  View performance metrics for the current week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyData}>
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis yAxisId="left" stroke="#6b7280" />
                        <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend content={<ChartLegendContent />} />
                        <Bar yAxisId="left" dataKey="orders" fill="#c9a96e" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="revenue" fill="#374151" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-barrush-platinum/80"><span className="font-semibold">Peak day:</span> Friday (15 orders)</p>
                  <p className="text-barrush-platinum/80"><span className="font-semibold">Peak hours:</span> 6PM - 9PM</p>
                  <p className="text-barrush-platinum/80"><span className="font-semibold">Most ordered item:</span> Whiskey</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="monthly">
            <Card className="bg-barrush-slate/40 border-barrush-copper/20">
              <CardHeader>
                <CardTitle className="text-barrush-platinum">Monthly Orders & Revenue</CardTitle>
                <CardDescription className="text-barrush-platinum/70">
                  View performance metrics for the year to date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis yAxisId="left" stroke="#6b7280" />
                        <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend content={<ChartLegendContent />} />
                        <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#c9a96e" strokeWidth={2} />
                        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#374151" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-barrush-platinum/80"><span className="font-semibold">Peak month:</span> June (220 orders)</p>
                  <p className="text-barrush-platinum/80"><span className="font-semibold">Growth rate:</span> +22% since January</p>
                  <p className="text-barrush-platinum/80"><span className="font-semibold">Top location:</span> Watamu</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Orders Table */}
        <Card className="bg-barrush-slate/40 border-barrush-copper/20">
          <CardHeader>
            <CardTitle className="text-barrush-platinum">Recent Orders</CardTitle>
            <CardDescription className="text-barrush-platinum/70">
              View and manage the latest customer orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-barrush-copper/20">
                  <TableHead className="text-barrush-platinum">ID</TableHead>
                  <TableHead className="text-barrush-platinum">Customer</TableHead>
                  <TableHead className="text-barrush-platinum">Location</TableHead>
                  <TableHead className="text-barrush-platinum">Items</TableHead>
                  <TableHead className="text-barrush-platinum">Amount</TableHead>
                  <TableHead className="text-barrush-platinum">Time</TableHead>
                  <TableHead className="text-barrush-platinum">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData.map((order) => (
                  <TableRow key={order.id} className="border-barrush-copper/20">
                    <TableCell className="font-medium text-barrush-platinum/90">#{order.id}</TableCell>
                    <TableCell className="text-barrush-platinum/90">{order.customer}</TableCell>
                    <TableCell className="text-barrush-platinum/90">{order.location}</TableCell>
                    <TableCell className="text-barrush-platinum/90">{order.items}</TableCell>
                    <TableCell className="text-barrush-platinum/90">KSh {order.amount}</TableCell>
                    <TableCell className="text-barrush-platinum/90">{order.time}</TableCell>
                    <TableCell>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "Delivered" ? "bg-green-100 text-green-800" : 
                          order.status === "In Transit" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              className="border-barrush-copper/50 text-barrush-copper hover:bg-barrush-copper/10"
            >
              Previous
            </Button>
            <Button 
              className="bg-barrush-copper hover:bg-barrush-copper/90 text-barrush-midnight"
            >
              Next
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
