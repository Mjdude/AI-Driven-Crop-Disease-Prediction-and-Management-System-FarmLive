import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface LoanProduct {
    id: string;
    name: string;
    provider: string;
    interestRate: number;
    maxAmount: number;
    tenure: number;
    processingFee: number;
    features: string[];
}

interface LoanComparisonDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedLoans: LoanProduct[];
}

export const LoanComparisonDialog: React.FC<LoanComparisonDialogProps> = ({
    open,
    onOpenChange,
    selectedLoans
}) => {
    if (selectedLoans.length === 0) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Loan Comparison</DialogTitle>
                    <DialogDescription>
                        Compare features and rates to find the best loan for you
                    </DialogDescription>
                </DialogHeader>

                <div className="overflow-x-auto mt-4">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="p-4 text-left bg-gray-50 border-b min-w-[200px]">Feature</th>
                                {selectedLoans.map(loan => (
                                    <th key={loan.id} className="p-4 text-left bg-gray-50 border-b min-w-[200px]">
                                        <div className="font-bold text-lg">{loan.name}</div>
                                        <div className="text-sm text-gray-500">{loan.provider}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-4 border-b font-medium">Interest Rate</td>
                                {selectedLoans.map(loan => (
                                    <td key={loan.id} className="p-4 border-b text-green-600 font-bold">
                                        {loan.interestRate}% p.a.
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 border-b font-medium">Max Amount</td>
                                {selectedLoans.map(loan => (
                                    <td key={loan.id} className="p-4 border-b">
                                        ₹{loan.maxAmount.toLocaleString()}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 border-b font-medium">Tenure</td>
                                {selectedLoans.map(loan => (
                                    <td key={loan.id} className="p-4 border-b">
                                        Up to {loan.tenure} months
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 border-b font-medium">Processing Fee</td>
                                {selectedLoans.map(loan => (
                                    <td key={loan.id} className="p-4 border-b">
                                        {loan.processingFee}%
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 border-b font-medium align-top">Key Features</td>
                                {selectedLoans.map(loan => (
                                    <td key={loan.id} className="p-4 border-b align-top">
                                        <ul className="space-y-2">
                                            {loan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm">
                                                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-medium">Action</td>
                                {selectedLoans.map(loan => (
                                    <td key={loan.id} className="p-4">
                                        <Button className="w-full">Apply Now</Button>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </DialogContent>
        </Dialog>
    );
};
