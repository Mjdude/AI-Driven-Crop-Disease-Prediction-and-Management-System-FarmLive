import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ScheduleIrrigationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export const ScheduleIrrigationDialog: React.FC<ScheduleIrrigationDialogProps> = ({
    open,
    onOpenChange,
    onSuccess
}) => {
    const [loading, setLoading] = useState(false);
    const [fieldLocation, setFieldLocation] = useState('');
    const [cropType, setCropType] = useState('');
    const [scheduledDate, setScheduledDate] = useState<Date>();
    const [scheduledTime, setScheduledTime] = useState('');
    const [duration, setDuration] = useState('');
    const [waterAmount, setWaterAmount] = useState('');
    const [method, setMethod] = useState('');
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!fieldLocation.trim()) newErrors.fieldLocation = 'Field location is required';
        if (!cropType) newErrors.cropType = 'Crop type is required';
        if (!scheduledDate) newErrors.scheduledDate = 'Date is required';
        if (!scheduledTime) newErrors.scheduledTime = 'Time is required';
        if (!duration || parseFloat(duration) <= 0) newErrors.duration = 'Valid duration is required';
        if (!waterAmount || parseFloat(waterAmount) <= 0) newErrors.waterAmount = 'Valid water amount is required';
        if (!method) newErrors.method = 'Irrigation method is required';

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
            const schedule = {
                id: `irrigation_${Date.now()}`,
                fieldLocation,
                cropType,
                scheduledDate: scheduledDate!.toISOString(),
                scheduledTime,
                duration: parseFloat(duration),
                waterAmount: parseFloat(waterAmount),
                method,
                notes,
                status: 'scheduled',
                createdAt: new Date().toISOString()
            };

            const existingSchedules = JSON.parse(localStorage.getItem('irrigationSchedules') || '[]');
            existingSchedules.push(schedule);
            localStorage.setItem('irrigationSchedules', JSON.stringify(existingSchedules));

            await new Promise(resolve => setTimeout(resolve, 500));

            toast.success(`Irrigation scheduled for ${format(scheduledDate!, 'PPP')} at ${scheduledTime}`);

            // Reset form
            setFieldLocation('');
            setCropType('');
            setScheduledDate(undefined);
            setScheduledTime('');
            setDuration('');
            setWaterAmount('');
            setMethod('');
            setNotes('');
            setErrors({});

            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            console.error('Error scheduling irrigation:', error);
            toast.error('Failed to schedule irrigation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Schedule Irrigation</DialogTitle>
                    <DialogDescription>
                        Plan your irrigation schedule for optimal water management
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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

                        <div className="space-y-2">
                            <Label htmlFor="cropType">
                                Crop Type <span className="text-red-500">*</span>
                            </Label>
                            <Select value={cropType} onValueChange={setCropType}>
                                <SelectTrigger className={errors.cropType ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select crop" />
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
                            {errors.cropType && (
                                <p className="text-sm text-red-500">{errors.cropType}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>
                                Scheduled Date <span className="text-red-500">*</span>
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            'w-full justify-start text-left font-normal',
                                            !scheduledDate && 'text-muted-foreground',
                                            errors.scheduledDate && 'border-red-500'
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {scheduledDate ? format(scheduledDate, 'PPP') : 'Pick a date'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={scheduledDate}
                                        onSelect={setScheduledDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.scheduledDate && (
                                <p className="text-sm text-red-500">{errors.scheduledDate}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="scheduledTime">
                                Time <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="scheduledTime"
                                    type="time"
                                    value={scheduledTime}
                                    onChange={(e) => setScheduledTime(e.target.value)}
                                    className={cn('pl-10', errors.scheduledTime && 'border-red-500')}
                                />
                            </div>
                            {errors.scheduledTime && (
                                <p className="text-sm text-red-500">{errors.scheduledTime}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="duration">
                                Duration (hours) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="duration"
                                type="number"
                                step="0.5"
                                min="0"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                placeholder="e.g., 2.5"
                                className={errors.duration ? 'border-red-500' : ''}
                            />
                            {errors.duration && (
                                <p className="text-sm text-red-500">{errors.duration}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="waterAmount">
                                Water Amount (liters) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="waterAmount"
                                type="number"
                                min="0"
                                value={waterAmount}
                                onChange={(e) => setWaterAmount(e.target.value)}
                                placeholder="e.g., 5000"
                                className={errors.waterAmount ? 'border-red-500' : ''}
                            />
                            {errors.waterAmount && (
                                <p className="text-sm text-red-500">{errors.waterAmount}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="method">
                            Irrigation Method <span className="text-red-500">*</span>
                        </Label>
                        <Select value={method} onValueChange={setMethod}>
                            <SelectTrigger className={errors.method ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Drip">Drip Irrigation</SelectItem>
                                <SelectItem value="Sprinkler">Sprinkler</SelectItem>
                                <SelectItem value="Flood">Flood Irrigation</SelectItem>
                                <SelectItem value="Furrow">Furrow Irrigation</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.method && (
                            <p className="text-sm text-red-500">{errors.method}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Additional notes about this irrigation schedule..."
                            rows={3}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Schedule Irrigation
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
