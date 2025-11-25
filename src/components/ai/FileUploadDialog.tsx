import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Image as ImageIcon, X, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAnalysisComplete: (result: any) => void;
}

export const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
    open,
    onOpenChange,
    onAnalysisComplete
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [type, setType] = useState('image');
    const [analyzing, setAnalyzing] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setAnalyzing(true);
        try {
            // Simulate analysis
            await new Promise(resolve => setTimeout(resolve, 2000));

            const result = {
                id: Date.now().toString(),
                fileName: file.name,
                type: type,
                summary: type === 'image'
                    ? 'Analysis detected early signs of Nitrogen deficiency in the crop leaves.'
                    : 'Report indicates optimal soil pH levels but low organic carbon content.',
                confidence: 92,
                recommendations: [
                    type === 'image' ? 'Apply nitrogen-rich fertilizer' : 'Add organic compost',
                    'Monitor for 7 days',
                    'Schedule follow-up analysis'
                ]
            };

            onAnalysisComplete(result);
            toast.success('Analysis complete!');
            onOpenChange(false);
            setFile(null);
        } catch (error) {
            toast.error('Analysis failed');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Upload for AI Analysis</DialogTitle>
                    <DialogDescription>
                        Upload images or documents for instant AI insights
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label>Analysis Type</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="image">Crop/Pest Image</SelectItem>
                                <SelectItem value="report">Soil/Water Report (PDF)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {!file ? (
                        <div
                            className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('file-upload')?.click()}
                        >
                            <Upload className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                            <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {type === 'image' ? 'JPG, PNG up to 10MB' : 'PDF, DOCX up to 10MB'}
                            </p>
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                accept={type === 'image' ? "image/*" : ".pdf,.doc,.docx"}
                                onChange={handleFileChange}
                            />
                        </div>
                    ) : (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg">
                                    {type === 'image' ? <ImageIcon className="h-6 w-6 text-blue-600" /> : <FileText className="h-6 w-6 text-blue-600" />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                                <X className="h-4 w-4 text-gray-500" />
                            </Button>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleAnalyze} disabled={!file || analyzing}>
                        {analyzing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Analyze Now
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
