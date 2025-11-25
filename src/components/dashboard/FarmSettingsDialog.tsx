import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface FarmSettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

interface FarmSettings {
    farmName: string;
    farmSize: number;
    sizeUnit: string;
    location: string;
    ownerName: string;
    contactNumber: string;
    email: string;
    notifications: {
        weather: boolean;
        irrigation: boolean;
        market: boolean;
        health: boolean;
    };
    units: {
        temperature: 'celsius' | 'fahrenheit';
        area: 'acres' | 'hectares';
        rainfall: 'mm' | 'inches';
    };
    language: string;
}

export const FarmSettingsDialog: React.FC<FarmSettingsDialogProps> = ({
    open,
    onOpenChange,
    onSuccess
}) => {
    const [loading, setLoading] = useState(false);

    // Load existing settings from localStorage
    const loadSettings = (): FarmSettings => {
        const saved = localStorage.getItem('farmSettings');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            farmName: '',
            farmSize: 0,
            sizeUnit: 'acres',
            location: '',
            ownerName: '',
            contactNumber: '',
            email: '',
            notifications: {
                weather: true,
                irrigation: true,
                market: true,
                health: true
            },
            units: {
                temperature: 'celsius',
                area: 'acres',
                rainfall: 'mm'
            },
            language: 'English'
        };
    };

    const [settings, setSettings] = useState<FarmSettings>(loadSettings());

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Save to localStorage
            localStorage.setItem('farmSettings', JSON.stringify(settings));

            await new Promise(resolve => setTimeout(resolve, 500));

            toast.success('Farm settings saved successfully!');
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Farm Settings</DialogTitle>
                    <DialogDescription>
                        Configure your farm profile and preferences
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Farm Profile */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Farm Profile</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="farmName">Farm Name</Label>
                                <Input
                                    id="farmName"
                                    value={settings.farmName}
                                    onChange={(e) => setSettings({ ...settings, farmName: e.target.value })}
                                    placeholder="Green Valley Farm"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={settings.location}
                                    onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                                    placeholder="City, State"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="farmSize">Farm Size</Label>
                                <Input
                                    id="farmSize"
                                    type="number"
                                    step="0.1"
                                    value={settings.farmSize || ''}
                                    onChange={(e) => setSettings({ ...settings, farmSize: parseFloat(e.target.value) || 0 })}
                                    placeholder="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sizeUnit">Unit</Label>
                                <Select
                                    value={settings.sizeUnit}
                                    onValueChange={(value) => setSettings({ ...settings, sizeUnit: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="acres">Acres</SelectItem>
                                        <SelectItem value="hectares">Hectares</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ownerName">Owner Name</Label>
                                <Input
                                    id="ownerName"
                                    value={settings.ownerName}
                                    onChange={(e) => setSettings({ ...settings, ownerName: e.target.value })}
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contactNumber">Contact Number</Label>
                                <Input
                                    id="contactNumber"
                                    type="tel"
                                    value={settings.contactNumber}
                                    onChange={(e) => setSettings({ ...settings, contactNumber: e.target.value })}
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={settings.email}
                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                placeholder="farmer@example.com"
                            />
                        </div>
                    </div>

                    {/* Notification Preferences */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="text-lg font-semibold">Notification Preferences</h3>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="weather-notif">Weather Alerts</Label>
                                <Switch
                                    id="weather-notif"
                                    checked={settings.notifications.weather}
                                    onCheckedChange={(checked) =>
                                        setSettings({
                                            ...settings,
                                            notifications: { ...settings.notifications, weather: checked }
                                        })
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="irrigation-notif">Irrigation Reminders</Label>
                                <Switch
                                    id="irrigation-notif"
                                    checked={settings.notifications.irrigation}
                                    onCheckedChange={(checked) =>
                                        setSettings({
                                            ...settings,
                                            notifications: { ...settings.notifications, irrigation: checked }
                                        })
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="market-notif">Market Price Updates</Label>
                                <Switch
                                    id="market-notif"
                                    checked={settings.notifications.market}
                                    onCheckedChange={(checked) =>
                                        setSettings({
                                            ...settings,
                                            notifications: { ...settings.notifications, market: checked }
                                        })
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="health-notif">Crop Health Alerts</Label>
                                <Switch
                                    id="health-notif"
                                    checked={settings.notifications.health}
                                    onCheckedChange={(checked) =>
                                        setSettings({
                                            ...settings,
                                            notifications: { ...settings.notifications, health: checked }
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Unit Preferences */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="text-lg font-semibold">Unit Preferences</h3>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="temp-unit">Temperature</Label>
                                <Select
                                    value={settings.units.temperature}
                                    onValueChange={(value: 'celsius' | 'fahrenheit') =>
                                        setSettings({
                                            ...settings,
                                            units: { ...settings.units, temperature: value }
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="celsius">Celsius (°C)</SelectItem>
                                        <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="area-unit">Area</Label>
                                <Select
                                    value={settings.units.area}
                                    onValueChange={(value: 'acres' | 'hectares') =>
                                        setSettings({
                                            ...settings,
                                            units: { ...settings.units, area: value }
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="acres">Acres</SelectItem>
                                        <SelectItem value="hectares">Hectares</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rainfall-unit">Rainfall</Label>
                                <Select
                                    value={settings.units.rainfall}
                                    onValueChange={(value: 'mm' | 'inches') =>
                                        setSettings({
                                            ...settings,
                                            units: { ...settings.units, rainfall: value }
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mm">Millimeters</SelectItem>
                                        <SelectItem value="inches">Inches</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Language */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="text-lg font-semibold">Language</h3>
                        <Select
                            value={settings.language}
                            onValueChange={(value) => setSettings({ ...settings, language: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="Hindi">Hindi</SelectItem>
                                <SelectItem value="Punjabi">Punjabi</SelectItem>
                                <SelectItem value="Tamil">Tamil</SelectItem>
                                <SelectItem value="Telugu">Telugu</SelectItem>
                            </SelectContent>
                        </Select>
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
                            Save Settings
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
