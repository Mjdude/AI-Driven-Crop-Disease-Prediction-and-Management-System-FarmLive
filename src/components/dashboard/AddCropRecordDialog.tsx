import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AddCropRecordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

interface CropRecord {
    id: string;
    cropName: string;
    variety: string;
    fieldLocation: string;
    plantingDate: Date;
    area: number;
    areaUnit: string;
    notes: string;
    createdAt: Date;
}

const CROP_OPTIONS = [
    'Rice', 'Wheat', 'Corn', 'Tomato', 'Potato', 'Onion', 'Cotton', 'Sugarcane', 'Soybean', 'Other'
];

const AREA_UNITS = ['Acres', 'Hectares', 'Square Meters'];

export const AddCropRecordDialog: React.FC<AddCropRecordDialogProps> = ({
    open,
    onOpenChange,
    onSuccess
}) => {
    const [loading, setLoading] = useState(false);
    const [cropName, setCropName] = useState('');
    const [variety, setVariety] = useState('');
    const [fieldLocation, setFieldLocation] = useState('');
    const [plantingDate, setPlantingDate] = useState<Date>();
    const [area, setArea] = useState('');
    const [areaUnit, setAreaUnit] = useState('Acres');
    const [notes, setNotes] = useState('');

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!cropName.trim()) {
            newErrors.cropName = 'Crop name is required';
        }
        if (!variety.trim()) {
            newErrors.variety = 'Variety is required';
        }
        if (!fieldLocation.trim()) {
            newErrors.fieldLocation = 'Field location is required';
        }
        if (!plantingDate) {
            newErrors.plantingDate = 'Planting date is required';
        }
        if (!area || parseFloat(area) <= 0) {
            newErrors.area = 'Valid area is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(true);

        try {
            // Create crop record
            const newRecord: CropRecord = {
                id: `crop_${Date.now()}`,
                cropName,
                variety,
                fieldLocation,
                plantingDate: plantingDate!,
                area: parseFloat(area),
                areaUnit,
                notes,
                createdAt: new Date()
            };

            // Get existing records from localStorage
            const existingRecords = JSON.parse(localStorage.getItem('cropRecords') || '[]');

            // Add new record
            existingRecords.push(newRecord);

            // Save back to localStorage
            localStorage.setItem('cropRecords', JSON.stringify(existingRecords));

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            toast.success(`Crop record for ${cropName} added successfully!`);

            // Reset form
            setCropName('');
            setVariety('');
            setFieldLocation('');
            setPlantingDate(undefined);
            setArea('');
            setAreaUnit('Acres');
            setNotes('');
            setErrors({});

            // Close dialog
            onOpenChange(false);

            // Trigger success callback
            onSuccess?.();
        } catch (error) {
            console.error('Error saving crop record:', error);
            toast.error('Failed to save crop record');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setCropName('');
        setVariety('');
        setFieldLocation('');
        setPlantingDate(undefined);
        setArea('');
        setAreaUnit('Acres');
        setNotes('');
        setErrors({});
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Crop Record</DialogTitle>
                    <DialogDescription>
                        Record a new crop planting in your farm. Fill in the details below.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Crop Name */}
                    <div className="space-y-2">
                        <Label htmlFor="cropName">
                            Crop Name <span className="text-red-500">*</span>
                        </Label>
                        <Select value={cropName} onValueChange={setCropName}>
                            <SelectTrigger className={errors.cropName ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select crop type" />
                            </SelectTrigger>
                            <SelectContent>
                                {CROP_OPTIONS.map((crop) => (
                                    <SelectItem key={crop} value={crop}>
                                        {crop}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.cropName && (
                            <p className="text-sm text-red-500">{errors.cropName}</p>
                        )}
                    </div>

                    {/* Variety */}
                    <div className="space-y-2">
                        <Label htmlFor="variety">
                            Variety <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="variety"
                            value={variety}
                            onChange={(e) => setVariety(e.target.value)}
                            placeholder="e.g., Basmati, Hybrid-123"
                            className={errors.variety ? 'border-red-500' : ''}
                        />
                        {errors.variety && (
                            <p className="text-sm text-red-500">{errors.variety}</p>
                        )}
                    </div>

                    {/* Field Location */}
                    <div className="space-y-2">
                        <Label htmlFor="fieldLocation">
                            Field Location <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="fieldLocation"
                            value={fieldLocation}
                            onChange={(e) => setFieldLocation(e.target.value)}
                            placeholder="e.g., North Field, Plot A2"
                            className={errors.fieldLocation ? 'border-red-500' : ''}
                        />
                        {errors.fieldLocation && (
                            <p className="text-sm text-red-500">{errors.fieldLocation}</p>
                        )}
                    </div>

                    {/* Planting Date */}
                    <div className="space-y-2">
                        <Label>
                            Planting Date <span className="text-red-500">*</span>
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        'w-full justify-start text-left font-normal',
                                        !plantingDate && 'text-muted-foreground',
                                        errors.plantingDate && 'border-red-500'
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {plantingDate ? format(plantingDate, 'PPP') : 'Pick a date'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={plantingDate}
                                    onSelect={setPlantingDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.plantingDate && (
                            <p className="text-sm text-red-500">{errors.plantingDate}</p>
                        )}
                    </div>

                    {/* Area */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="area">
                                Area <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="area"
                                type="number"
                                step="0.01"
                                min="0"
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                placeholder="0.00"
                                className={errors.area ? 'border-red-500' : ''}
                            />
                            {errors.area && (
                                <p className="text-sm text-red-500">{errors.area}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="areaUnit">Unit</Label>
                            <Select value={areaUnit} onValueChange={setAreaUnit}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {AREA_UNITS.map((unit) => (
                                        <SelectItem key={unit} value={unit}>
                                            {unit}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Additional information about this planting..."
                            rows={3}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Crop Record
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
