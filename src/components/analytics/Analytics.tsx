import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Download, TrendingUp, Droplets, DollarSign, Sprout } from 'lucide-react';
import { toast } from 'sonner';

// Mock Data
const yieldData = [
    { name: 'Wheat', actual: 4000, predicted: 4200 },
    { name: 'Rice', actual: 3000, predicted: 3200 },
    { name: 'Corn', actual: 2000, predicted: 2100 },
    { name: 'Soybean', actual: 2780, predicted: 2900 },
    { name: 'Barley', actual: 1890, predicted: 2000 },
];

const priceTrends = [
    { month: 'Jan', wheat: 2200, rice: 3500, corn: 1800 },
    { month: 'Feb', wheat: 2250, rice: 3550, corn: 1820 },
    { month: 'Mar', wheat: 2300, rice: 3600, corn: 1850 },
    { month: 'Apr', wheat: 2280, rice: 3580, corn: 1840 },
    { month: 'May', wheat: 2350, rice: 3650, corn: 1880 },
    { month: 'Jun', wheat: 2400, rice: 3700, corn: 1900 },
];

const resourceUsage = [
    { name: 'Water', value: 45, color: '#3b82f6' },
    { name: 'Fertilizer', value: 25, color: '#10b981' },
    { name: 'Pesticides', value: 15, color: '#ef4444' },
    { name: 'Labor', value: 15, color: '#f59e0b' },
];

const weatherImpact = [
    { month: 'Jan', rainfall: 20, yield: 85 },
    { month: 'Feb', rainfall: 15, yield: 88 },
    { month: 'Mar', rainfall: 40, yield: 92 },
    { month: 'Apr', rainfall: 80, yield: 95 },
    { month: 'May', rainfall: 120, yield: 90 },
    { month: 'Jun', rainfall: 150, yield: 85 },
];

export const Analytics: React.FC = () => {
    const handleExport = () => {
        toast.success('Analytics report downloaded successfully');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Farm Analytics</h1>
                    <p className="text-gray-600 mt-1">Comprehensive insights into your farm's performance</p>
                </div>
                <div className="flex gap-2">
                    <Select defaultValue="this_year">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="this_month">This Month</SelectItem>
                            <SelectItem value="last_month">Last Month</SelectItem>
                            <SelectItem value="this_year">This Year</SelectItem>
                            <SelectItem value="last_year">Last Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Yield</p>
                                <h3 className="text-2xl font-bold mt-1">14.5 Tons</h3>
                                <p className="text-xs text-green-600 mt-1 flex items-center">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    +12% from last year
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <Sprout className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Revenue</p>
                                <h3 className="text-2xl font-bold mt-1">₹8.2 Lakhs</h3>
                                <p className="text-xs text-green-600 mt-1 flex items-center">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    +8% from last year
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <DollarSign className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Water Usage</p>
                                <h3 className="text-2xl font-bold mt-1">2.4 ML</h3>
                                <p className="text-xs text-red-600 mt-1 flex items-center">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    +5% vs target
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Droplets className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Efficiency Score</p>
                                <h3 className="text-2xl font-bold mt-1">88/100</h3>
                                <p className="text-xs text-green-600 mt-1 flex items-center">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    Top 10% in region
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="production" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="production">Production & Yield</TabsTrigger>
                    <TabsTrigger value="financial">Financial Trends</TabsTrigger>
                    <TabsTrigger value="resources">Resource Usage</TabsTrigger>
                </TabsList>

                <TabsContent value="production" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Actual vs Predicted Yield</CardTitle>
                                <CardDescription>Comparison of crop yields across different varieties</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={yieldData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="actual" name="Actual Yield (kg)" fill="#10b981" />
                                            <Bar dataKey="predicted" name="Predicted Yield (kg)" fill="#3b82f6" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Weather Impact on Yield</CardTitle>
                                <CardDescription>Correlation between rainfall and crop productivity</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={weatherImpact}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                                            <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                                            <Tooltip />
                                            <Legend />
                                            <Area yAxisId="left" type="monotone" dataKey="rainfall" name="Rainfall (mm)" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                                            <Area yAxisId="right" type="monotone" dataKey="yield" name="Yield Index" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="financial" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Market Price Trends</CardTitle>
                            <CardDescription>Historical price movements for key crops</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={priceTrends}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="wheat" name="Wheat (₹/q)" stroke="#f59e0b" strokeWidth={2} />
                                        <Line type="monotone" dataKey="rice" name="Rice (₹/q)" stroke="#10b981" strokeWidth={2} />
                                        <Line type="monotone" dataKey="corn" name="Corn (₹/q)" stroke="#3b82f6" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="resources" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Cost Distribution</CardTitle>
                                <CardDescription>Breakdown of farming expenses</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={resourceUsage}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {resourceUsage.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Resource Efficiency</CardTitle>
                                <CardDescription>Monthly resource utilization efficiency</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {['Water', 'Fertilizer', 'Energy', 'Labor'].map((resource, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium">{resource}</span>
                                                <span className="text-gray-500">{85 + idx * 2}% Efficient</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500 rounded-full"
                                                    style={{ width: `${85 + idx * 2}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};
