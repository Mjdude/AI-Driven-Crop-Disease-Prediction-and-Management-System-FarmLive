import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface PriceAlertDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: (alert: any) => void;
    existingAlert?: any;
}

export const PriceAlertDialog: React.FC<PriceAlertDialogProps> = ({
    open,
    onOpenChange,
    onSuccess,
    existingAlert
}) => {
    const [formData, setFormData] = useState(existingAlert || {
        crop: '',
        market: '',
        condition: 'above',
        targetPrice: '',
        notifyVia: ['push']
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newAlert = {
            id: existingAlert?.id || Date.now().toString(),
            ...formData,
            enabled: true,
            targetPrice: Number(formData.targetPrice)
        };

        toast.success(existingAlert ? 'Alert updated successfully' : 'Price alert created successfully');
        onSuccess?.(newAlert);
        onOpenChange(false);

        if (!existingAlert) {
            setFormData({
                crop: '',
                market: '',
                condition: 'above',
                targetPrice: '',
                notifyVia: ['push']
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{existingAlert ? 'Edit Price Alert' : 'Create Price Alert'}</DialogTitle>
                    <DialogDescription>
                        Get notified when market prices change
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="crop">Crop</Label>
                        <Select
                            value={formData.crop}
                            onValueChange={(val) => setFormData({ ...formData, crop: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select crop" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Rice (Basmati)">Rice (Basmati)</SelectItem>
                                <SelectItem value="Wheat">Wheat</SelectItem>
                                <SelectItem value="Cotton">Cotton</SelectItem>
                                <SelectItem value="Tomato">Tomato</SelectItem>
                                <SelectItem value="Potato">Potato</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="market">Market</Label>
                        <Select
                            value={formData.market}
                            onValueChange={(val) => setFormData({ ...formData, market: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select market" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Delhi Mandi">Delhi Mandi</SelectItem>
                                <SelectItem value="Punjab Mandi">Punjab Mandi</SelectItem>
                                <SelectItem value="Gujarat Mandi">Gujarat Mandi</SelectItem>
                                <SelectItem value="Mumbai APMC">Mumbai APMC</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="condition">Condition</Label>
                            <Select
                                value={formData.condition}
                                onValueChange={(val) => setFormData({ ...formData, condition: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="above">Price goes above</SelectItem>
                                    <SelectItem value="below">Price goes below</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Target Price (₹)</Label>
                            <Input
                                id="price"
                                type="number"
                                required
                                value={formData.targetPrice}
                                onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Notify via</Label>
                        <div className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="push"
                                    checked={formData.notifyVia.includes('push')}
                                    onCheckedChange={(checked) => {
                                        if (checked) setFormData({ ...formData, notifyVia: [...formData.notifyVia, 'push'] });
                                        else setFormData({ ...formData, notifyVia: formData.notifyVia.filter((m: string) => m !== 'push') });
                                    }}
                                />
                                <Label htmlFor="push">Push Notification</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="sms"
                                    checked={formData.notifyVia.includes('sms')}
                                    onCheckedChange={(checked) => {
                                        if (checked) setFormData({ ...formData, notifyVia: [...formData.notifyVia, 'sms'] });
                                        else setFormData({ ...formData, notifyVia: formData.notifyVia.filter((m: string) => m !== 'sms') });
                                    }}
                                />
                                <Label htmlFor="sms">SMS</Label>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">{existingAlert ? 'Update Alert' : 'Create Alert'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
