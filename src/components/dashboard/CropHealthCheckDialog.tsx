import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Upload, Loader2, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CropHealthCheckDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

interface HealthAnalysis {
    overallHealth: 'healthy' | 'warning' | 'critical';
    healthScore: number;
    issues: {
        type: string;
        severity: 'low' | 'medium' | 'high';
        description: string;
        recommendation: string;
    }[];
    detectedDiseases: string[];
    detectedPests: string[];
}

export const CropHealthCheckDialog: React.FC<CropHealthCheckDialogProps> = ({
    open,
    onOpenChange,
    onSuccess
}) => {
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [selectedCrop, setSelectedCrop] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [analysis, setAnalysis] = useState<HealthAnalysis | null>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const performMockAnalysis = async (): Promise<HealthAnalysis> => {
        // Simulate AI analysis delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock analysis results
        const mockResults: HealthAnalysis[] = [
            {
                overallHealth: 'healthy',
                healthScore: 92,
                issues: [
                    {
                        type: 'Minor Nutrient Deficiency',
                        severity: 'low',
                        description: 'Slight yellowing detected on lower leaves, indicating possible nitrogen deficiency.',
                        recommendation: 'Apply nitrogen-rich fertilizer (urea) at 50kg per acre.'
                    }
                ],
                detectedDiseases: [],
                detectedPests: []
            },
            {
                overallHealth: 'warning',
                healthScore: 68,
                issues: [
                    {
                        type: 'Fungal Infection',
                        severity: 'medium',
                        description: 'Brown spots detected on leaves, consistent with leaf blight.',
                        recommendation: 'Apply fungicide (Mancozeb) immediately. Remove affected leaves.'
                    },
                    {
                        type: 'Pest Infestation',
                        severity: 'medium',
                        description: 'Evidence of aphid activity on young shoots.',
                        recommendation: 'Spray neem oil solution or use systemic insecticide.'
                    }
                ],
                detectedDiseases: ['Leaf Blight'],
                detectedPests: ['Aphids']
            },
            {
                overallHealth: 'critical',
                healthScore: 42,
                issues: [
                    {
                        type: 'Severe Disease',
                        severity: 'high',
                        description: 'Advanced stage of bacterial wilt detected. Immediate action required.',
                        recommendation: 'Isolate affected plants. Apply copper-based bactericide. Consider crop rotation.'
                    },
                    {
                        type: 'Water Stress',
                        severity: 'high',
                        description: 'Severe wilting and leaf curling indicating water stress.',
                        recommendation: 'Increase irrigation frequency. Check soil moisture levels.'
                    }
                ],
                detectedDiseases: ['Bacterial Wilt'],
                detectedPests: []
            }
        ];

        // Return random result for demo
        return mockResults[Math.floor(Math.random() * mockResults.length)];
    };

    const handleAnalyze = async () => {
        if (!selectedCrop) {
            toast.error('Please select a crop type');
            return;
        }

        if (!selectedImage) {
            toast.error('Please upload an image');
            return;
        }

        setAnalyzing(true);

        try {
            const result = await performMockAnalysis();
            setAnalysis(result);

            // Save to localStorage
            const healthCheck = {
                id: `health_${Date.now()}`,
                crop: selectedCrop,
                imageName: selectedImage.name,
                analysis: result,
                timestamp: new Date().toISOString()
            };

            const existingChecks = JSON.parse(localStorage.getItem('healthChecks') || '[]');
            existingChecks.push(healthCheck);
            localStorage.setItem('healthChecks', JSON.stringify(existingChecks));

            toast.success('Health analysis complete!');
        } catch (error) {
            console.error('Analysis error:', error);
            toast.error('Failed to analyze image');
        } finally {
            setAnalyzing(false);
        }
    };

    const handleClose = () => {
        setSelectedCrop('');
        setSelectedImage(null);
        setImagePreview('');
        setAnalysis(null);
        onOpenChange(false);
    };

    const getHealthIcon = (health: string) => {
        switch (health) {
            case 'healthy':
                return <CheckCircle className="h-6 w-6 text-green-600" />;
            case 'warning':
                return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
            case 'critical':
                return <AlertCircle className="h-6 w-6 text-red-600" />;
            default:
                return null;
        }
    };

    const getHealthColor = (health: string) => {
        switch (health) {
            case 'healthy':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'warning':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'critical':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return '';
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'low':
                return 'bg-blue-100 text-blue-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'high':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Crop Health Check</DialogTitle>
                    <DialogDescription>
                        Upload a photo of your crop for AI-powered health analysis
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Crop Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="crop">Crop Type</Label>
                        <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select crop type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Rice">Rice</SelectItem>
                                <SelectItem value="Wheat">Wheat</SelectItem>
                                <SelectItem value="Corn">Corn</SelectItem>
                                <SelectItem value="Tomato">Tomato</SelectItem>
                                <SelectItem value="Potato">Potato</SelectItem>
                                <SelectItem value="Cotton">Cotton</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label>Upload Image</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                            {imagePreview ? (
                                <div className="space-y-3">
                                    <img
                                        src={imagePreview}
                                        alt="Crop preview"
                                        className="max-h-64 mx-auto rounded-lg"
                                    />
                                    <p className="text-sm text-gray-600">{selectedImage?.name}</p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedImage(null);
                                            setImagePreview('');
                                            setAnalysis(null);
                                        }}
                                    >
                                        Change Image
                                    </Button>
                                </div>
                            ) : (
                                <label htmlFor="image-upload" className="cursor-pointer">
                                    <div className="flex flex-col items-center space-y-2">
                                        <Upload className="h-12 w-12 text-gray-400" />
                                        <div className="text-sm text-gray-600">
                                            <span className="text-blue-600 hover:text-blue-700">Click to upload</span>
                                            {' '}or drag and drop
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                    </div>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageSelect}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Analyze Button */}
                    {imagePreview && !analysis && (
                        <Button
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            className="w-full"
                        >
                            {analyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {analyzing ? 'Analyzing...' : 'Analyze Health'}
                        </Button>
                    )}

                    {/* Analysis Results */}
                    {analysis && (
                        <div className="space-y-4 border-t pt-4">
                            <div className={cn('p-4 rounded-lg border', getHealthColor(analysis.overallHealth))}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {getHealthIcon(analysis.overallHealth)}
                                        <h3 className="font-semibold text-lg capitalize">
                                            {analysis.overallHealth} Condition
                                        </h3>
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {analysis.healthScore}%
                                    </div>
                                </div>
                                <p className="text-sm">Overall health score based on AI analysis</p>
                            </div>

                            {/* Issues Detected */}
                            {analysis.issues.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="font-semibold">Issues Detected</h4>
                                    {analysis.issues.map((issue, index) => (
                                        <div key={index} className="border rounded-lg p-3 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h5 className="font-medium">{issue.type}</h5>
                                                <span className={cn('text-xs px-2 py-1 rounded-full', getSeverityColor(issue.severity))}>
                                                    {issue.severity.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">{issue.description}</p>
                                            <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                                <p className="text-sm text-blue-800">
                                                    <strong>Recommendation:</strong> {issue.recommendation}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Detected Diseases & Pests */}
                            {(analysis.detectedDiseases.length > 0 || analysis.detectedPests.length > 0) && (
                                <div className="grid grid-cols-2 gap-4">
                                    {analysis.detectedDiseases.length > 0 && (
                                        <div className="border rounded-lg p-3">
                                            <h5 className="font-medium mb-2 text-red-600">Diseases</h5>
                                            <ul className="text-sm space-y-1">
                                                {analysis.detectedDiseases.map((disease, i) => (
                                                    <li key={i} className="flex items-center gap-2">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {disease}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {analysis.detectedPests.length > 0 && (
                                        <div className="border rounded-lg p-3">
                                            <h5 className="font-medium mb-2 text-orange-600">Pests</h5>
                                            <ul className="text-sm space-y-1">
                                                {analysis.detectedPests.map((pest, i) => (
                                                    <li key={i} className="flex items-center gap-2">
                                                        <AlertTriangle className="h-3 w-3" />
                                                        {pest}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        {analysis ? 'Close' : 'Cancel'}
                    </Button>
                    {analysis && (
                        <Button onClick={() => {
                            onSuccess?.();
                            handleClose();
                        }}>
                            Save & Close
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
