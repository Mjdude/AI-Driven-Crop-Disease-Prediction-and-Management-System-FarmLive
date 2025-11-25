import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface EMICalculatorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EMICalculatorDialog: React.FC<EMICalculatorDialogProps> = ({
    open,
    onOpenChange
}) => {
    const [amount, setAmount] = useState(100000);
    const [rate, setRate] = useState(8.5);
    const [tenure, setTenure] = useState(12);
    const [emi, setEmi] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);

    useEffect(() => {
        const monthlyRate = rate / 12 / 100;
        const emiValue = (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
            (Math.pow(1 + monthlyRate, tenure) - 1);
        const totalPay = emiValue * tenure;
        const totalInt = totalPay - amount;

        setEmi(Math.round(emiValue));
        setTotalPayment(Math.round(totalPay));
        setTotalInterest(Math.round(totalInt));
    }, [amount, rate, tenure]);

    const data = [
        { name: 'Principal Amount', value: amount },
        { name: 'Total Interest', value: totalInterest }
    ];

    const COLORS = ['#0088FE', '#FFBB28'];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Smart EMI Calculator</DialogTitle>
                    <DialogDescription>
                        Plan your loan repayment with our advanced calculator
                    </DialogDescription>
                </DialogHeader>

                <div className="grid md:grid-cols-2 gap-6 py-4">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Loan Amount</Label>
                                <span className="font-bold text-blue-600">₹{amount.toLocaleString()}</span>
                            </div>
                            <Slider
                                value={[amount]}
                                onValueChange={(value) => setAmount(value[0])}
                                max={5000000}
                                step={10000}
                                className="py-2"
                            />
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="mt-1"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Interest Rate (%)</Label>
                                <span className="font-bold text-blue-600">{rate}%</span>
                            </div>
                            <Slider
                                value={[rate]}
                                onValueChange={(value) => setRate(value[0])}
                                max={20}
                                step={0.1}
                                className="py-2"
                            />
                            <Input
                                type="number"
                                value={rate}
                                onChange={(e) => setRate(Number(e.target.value))}
                                className="mt-1"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Tenure (Months)</Label>
                                <span className="font-bold text-blue-600">{tenure} months</span>
                            </div>
                            <Slider
                                value={[tenure]}
                                onValueChange={(value) => setTenure(value[0])}
                                max={120}
                                step={1}
                                className="py-2"
                            />
                            <Input
                                type="number"
                                value={tenure}
                                onChange={(e) => setTenure(Number(e.target.value))}
                                className="mt-1"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4">
                        <div className="text-center mb-4">
                            <p className="text-sm text-gray-500">Monthly EMI</p>
                            <p className="text-3xl font-bold text-blue-600">₹{emi.toLocaleString()}</p>
                        </div>

                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="w-full space-y-2 mt-4 text-sm">
                            <div className="flex justify-between border-b pb-1">
                                <span className="text-gray-600">Principal Amount</span>
                                <span className="font-semibold">₹{amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-b pb-1">
                                <span className="text-gray-600">Total Interest</span>
                                <span className="font-semibold text-yellow-600">₹{totalInterest.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between pt-1">
                                <span className="font-bold">Total Payment</span>
                                <span className="font-bold">₹{totalPayment.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
