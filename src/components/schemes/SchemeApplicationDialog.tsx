import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, ArrowRight, ArrowLeft, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Scheme {
    id: string;
    name: string;
    documents: string[];
    applicationUrl?: string;
}

interface SchemeApplicationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    scheme: Scheme | null;
    onSubmit: (applicationId: string) => void;
}

export const SchemeApplicationDialog: React.FC<SchemeApplicationDialogProps> = ({
    open,
    onOpenChange,
    scheme,
    onSubmit
}) => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        aadhaar: '',
        mobile: '',
        address: '',
        bankAccount: '',
        ifsc: '',
        landArea: '',
        surveyNumber: ''
    });
    const [uploadedDocs, setUploadedDocs] = useState<{ [key: string]: boolean }>({});

    if (!scheme) return null;

    const totalSteps = 3;

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleFileUpload = (docName: string) => {
        // Simulate upload
        toast.success(`${docName} uploaded successfully`);
        setUploadedDocs(prev => ({ ...prev, [docName]: true }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        onSubmit(Date.now().toString());
        onOpenChange(false);
        setStep(1);
        setUploadedDocs({});
        setFormData({
            fullName: '',
            aadhaar: '',
            mobile: '',
            address: '',
            bankAccount: '',
            ifsc: '',
            landArea: '',
            surveyNumber: ''
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Apply for {scheme.name}</DialogTitle>
                    <DialogDescription>
                        Complete the application process in {totalSteps} simple steps
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between text-sm font-medium mb-2">
                            <span className={step >= 1 ? 'text-green-600' : 'text-gray-400'}>Personal Details</span>
                            <span className={step >= 2 ? 'text-green-600' : 'text-gray-400'}>Farm & Bank</span>
                            <span className={step >= 3 ? 'text-green-600' : 'text-gray-400'}>Documents</span>
                        </div>
                        <Progress value={(step / totalSteps) * 100} className="h-2" />
                    </div>

                    {/* Step 1: Personal Details */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Full Name (as per Aadhaar)</Label>
                                    <Input
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="Enter full name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Mobile Number</Label>
                                    <Input
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                        placeholder="Enter mobile number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Aadhaar Number</Label>
                                    <Input
                                        value={formData.aadhaar}
                                        onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                                        placeholder="12-digit Aadhaar number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Address</Label>
                                    <Input
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Village, District, State"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Farm & Bank Details */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Land Area (Acres)</Label>
                                    <Input
                                        value={formData.landArea}
                                        onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                                        placeholder="Total land area"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Survey Number</Label>
                                    <Input
                                        value={formData.surveyNumber}
                                        onChange={(e) => setFormData({ ...formData, surveyNumber: e.target.value })}
                                        placeholder="Land survey number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Bank Account Number</Label>
                                    <Input
                                        value={formData.bankAccount}
                                        onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                                        placeholder="Account number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>IFSC Code</Label>
                                    <Input
                                        value={formData.ifsc}
                                        onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })}
                                        placeholder="Bank IFSC code"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Documents */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Required Documents
                                </h4>
                                <p className="text-sm text-blue-600">
                                    Please upload clear copies of the following documents. Supported formats: JPG, PNG, PDF.
                                </p>
                            </div>

                            <div className="grid gap-3">
                                {scheme.documents.map((doc, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${uploadedDocs[doc] ? 'bg-green-100' : 'bg-gray-100'}`}>
                                                {uploadedDocs[doc] ? (
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <FileText className="h-4 w-4 text-gray-500" />
                                                )}
                                            </div>
                                            <span className="font-medium text-sm">{doc}</span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleFileUpload(doc)}
                                            disabled={uploadedDocs[doc]}
                                        >
                                            {uploadedDocs[doc] ? 'Uploaded' : 'Upload'}
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {scheme.applicationUrl && (
                                <div className="mt-6 p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <ExternalLink className="h-5 w-5 text-yellow-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-yellow-800">Official Website Application</h4>
                                            <p className="text-sm text-yellow-700 mb-3">
                                                Some steps may need to be completed on the official government portal.
                                            </p>
                                            <Button
                                                variant="outline"
                                                className="bg-white hover:bg-yellow-100 text-yellow-800 border-yellow-300"
                                                onClick={() => window.open(scheme.applicationUrl, '_blank')}
                                            >
                                                Visit Official Website
                                                <ExternalLink className="ml-2 h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-between sm:justify-between">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={step === 1 || isSubmitting}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>

                    {step < totalSteps ? (
                        <Button onClick={handleNext}>
                            Next
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Submit Application
                                    <CheckCircle className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
