import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PriceChartDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cropName: string;
}

export const PriceChartDialog: React.FC<PriceChartDialogProps> = ({
    open,
    onOpenChange,
    cropName
}) => {
    // Mock data for the chart
    const data = [
        { date: '1 Nov', price: 2400, marketAvg: 2350 },
        { date: '5 Nov', price: 2450, marketAvg: 2400 },
        { date: '10 Nov', price: 2420, marketAvg: 2380 },
        { date: '15 Nov', price: 2500, marketAvg: 2450 },
        { date: '20 Nov', price: 2550, marketAvg: 2480 },
        { date: '22 Nov', price: 2600, marketAvg: 2500 },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>{cropName} Price Trend</DialogTitle>
                    <DialogDescription>
                        Historical price analysis for the last 30 days
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="flex justify-end mb-4">
                        <Select defaultValue="30days">
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Duration" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7days">Last 7 Days</SelectItem>
                                <SelectItem value="30days">Last 30 Days</SelectItem>
                                <SelectItem value="3months">Last 3 Months</SelectItem>
                                <SelectItem value="1year">Last Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#16a34a"
                                    strokeWidth={2}
                                    name="Current Market Price"
                                    activeDot={{ r: 8 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="marketAvg"
                                    stroke="#9ca3af"
                                    strokeDasharray="5 5"
                                    name="State Average"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                        <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-xs text-gray-600">Highest Price</p>
                            <p className="text-lg font-bold text-green-700">₹2,600</p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg">
                            <p className="text-xs text-gray-600">Lowest Price</p>
                            <p className="text-lg font-bold text-red-700">₹2,400</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-gray-600">Average Price</p>
                            <p className="text-lg font-bold text-blue-700">₹2,486</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
