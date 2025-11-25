import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';

interface LoanApplicationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productName?: string;
}

export const LoanApplicationDialog: React.FC<LoanApplicationDialogProps> = ({
    open,
    onOpenChange,
    productName = 'General Loan'
}) => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

    const handleFileUpload = () => {
        // Simulate file upload
        const newFile = `Document_${uploadedFiles.length + 1}.pdf`;
        setUploadedFiles([...uploadedFiles, newFile]);
        toast.success('Document uploaded successfully');
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        toast.success('Loan application submitted successfully!');
        setIsSubmitting(false);
        onOpenChange(false);
        setStep(1);
        setUploadedFiles([]);
    };

    const renderStep1 = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input placeholder="As per Aadhaar" />
                </div>
                <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input type="date" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Mobile Number</Label>
                    <Input placeholder="+91" />
                </div>
                <div className="space-y-2">
                    <Label>Email (Optional)</Label>
                    <Input type="email" placeholder="farmer@example.com" />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Current Address</Label>
                <Textarea placeholder="Full address with pincode" />
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Loan Amount Required (₹)</Label>
                    <Input type="number" placeholder="e.g. 500000" />
                </div>
                <div className="space-y-2">
                    <Label>Preferred Tenure (Months)</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select tenure" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="12">12 Months</SelectItem>
                            <SelectItem value="24">24 Months</SelectItem>
                            <SelectItem value="36">36 Months</SelectItem>
                            <SelectItem value="48">48 Months</SelectItem>
                            <SelectItem value="60">60 Months</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label>Purpose of Loan</Label>
                <Textarea placeholder="Describe how you will use the funds..." />
            </div>
            <div className="space-y-2">
                <Label>Farm Size (Acres)</Label>
                <Input type="number" placeholder="Total land holding" />
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Required Documents
                </h4>
                <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                    <li>Aadhaar Card / PAN Card</li>
                    <li>Land Ownership Records (7/12 Extract)</li>
                    <li>Bank Statement (Last 6 months)</li>
                    <li>Income Proof / Kisan Credit Card</li>
                </ul>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={handleFileUpload}>
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Click to upload documents</p>
                <p className="text-xs text-gray-500">PDF, JPG, or PNG (Max 5MB)</p>
            </div>

            {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                    <Label>Uploaded Documents</Label>
                    {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <span className="text-sm">{file}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}>
                                <X className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    I agree to the terms and conditions and authorize credit checks.
                </label>
            </div>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Apply for {productName}</DialogTitle>
                    <DialogDescription>
                        Complete the application form to proceed with your loan request
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="flex items-center justify-between mb-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex flex-col items-center relative z-10">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= i ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                                    }`}>
                                    {step > i ? <CheckCircle className="h-5 w-5" /> : i}
                                </div>
                                <span className="text-xs mt-1 text-gray-500">
                                    {i === 1 ? 'Personal' : i === 2 ? 'Loan Details' : 'Documents'}
                                </span>
                            </div>
                        ))}
                        <div className="absolute top-[100px] left-[40px] w-[480px] h-[2px] bg-gray-200 -z-0 hidden sm:block">
                            <div
                                className="h-full bg-green-600 transition-all duration-300"
                                style={{ width: `${((step - 1) / 2) * 100}%` }}
                            />
                        </div>
                    </div>

                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                </div>

                <DialogFooter>
                    {step > 1 && (
                        <Button variant="outline" onClick={() => setStep(step - 1)}>
                            Back
                        </Button>
                    )}
                    {step < 3 ? (
                        <Button onClick={() => setStep(step + 1)}>Next Step</Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
