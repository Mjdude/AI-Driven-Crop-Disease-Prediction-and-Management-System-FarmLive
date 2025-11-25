import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface MarketSettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const MarketSettingsDialog: React.FC<MarketSettingsDialogProps> = ({
    open,
    onOpenChange
}) => {
    const [settings, setSettings] = useState({
        defaultMarket: 'Delhi Mandi',
        currency: 'INR',
        notifications: {
            priceAlerts: true,
            newListings: true,
            orderUpdates: true,
            marketNews: false
        },
        autoRefresh: true,
        refreshInterval: '15'
    });

    const handleSave = () => {
        // Save to localStorage
        localStorage.setItem('marketSettings', JSON.stringify(settings));
        toast.success('Market settings saved successfully');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Market Intelligence Settings</DialogTitle>
                    <DialogDescription>
                        Configure your market preferences and notifications
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label>Default Market</Label>
                        <Select
                            value={settings.defaultMarket}
                            onValueChange={(val) => setSettings({ ...settings, defaultMarket: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select market" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Delhi Mandi">Delhi Mandi</SelectItem>
                                <SelectItem value="Punjab Mandi">Punjab Mandi</SelectItem>
                                <SelectItem value="Mumbai APMC">Mumbai APMC</SelectItem>
                                <SelectItem value="Gujarat Mandi">Gujarat Mandi</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-medium text-sm text-gray-900">Notifications</h4>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="price-alerts">Price Alerts</Label>
                            <Switch
                                id="price-alerts"
                                checked={settings.notifications.priceAlerts}
                                onCheckedChange={(checked) => setSettings({
                                    ...settings,
                                    notifications: { ...settings.notifications, priceAlerts: checked }
                                })}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="new-listings">New Listings in Area</Label>
                            <Switch
                                id="new-listings"
                                checked={settings.notifications.newListings}
                                onCheckedChange={(checked) => setSettings({
                                    ...settings,
                                    notifications: { ...settings.notifications, newListings: checked }
                                })}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="order-updates">Order Status Updates</Label>
                            <Switch
                                id="order-updates"
                                checked={settings.notifications.orderUpdates}
                                onCheckedChange={(checked) => setSettings({
                                    ...settings,
                                    notifications: { ...settings.notifications, orderUpdates: checked }
                                })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Auto-refresh Data</Label>
                            <Switch
                                checked={settings.autoRefresh}
                                onCheckedChange={(checked) => setSettings({ ...settings, autoRefresh: checked })}
                            />
                        </div>
                        {settings.autoRefresh && (
                            <Select
                                value={settings.refreshInterval}
                                onValueChange={(val) => setSettings({ ...settings, refreshInterval: val })}
                            >
                                <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Refresh interval" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">Every 5 minutes</SelectItem>
                                    <SelectItem value="15">Every 15 minutes</SelectItem>
                                    <SelectItem value="30">Every 30 minutes</SelectItem>
                                    <SelectItem value="60">Every hour</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Settings</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
