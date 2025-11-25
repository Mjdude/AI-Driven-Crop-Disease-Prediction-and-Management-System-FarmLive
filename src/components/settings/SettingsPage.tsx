import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, User, Bell, Ruler, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

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

export const SettingsPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState<FarmSettings>({
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
    });

    useEffect(() => {
        const saved = localStorage.getItem('farmSettings');
        if (saved) {
            setSettings(JSON.parse(saved));
        }
    }, []);

    const handleLanguageChange = (value: string) => {
        const langMap: { [key: string]: string } = {
            'English': 'en',
            'Hindi': 'hi',
            'Kannada': 'kn',
            'Telugu': 'te',
            'Tamil': 'ta'
        };

        const langCode = langMap[value];
        if (langCode) {
            i18n.changeLanguage(langCode);
            setSettings({ ...settings, language: value });
            // Persist language preference
            localStorage.setItem('i18nextLng', langCode);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            localStorage.setItem('farmSettings', JSON.stringify(settings));
            await new Promise(resolve => setTimeout(resolve, 500));
            toast.success('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-1">Manage your farm profile and application preferences</p>
                </div>
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Farm Profile */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-500" />
                            Farm Profile
                        </CardTitle>
                        <CardDescription>Basic information about your farm and contact details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </CardContent>
                </Card>

                {/* Notification Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-yellow-500" />
                            Notification Preferences
                        </CardTitle>
                        <CardDescription>Manage how and when you want to be notified</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <Label htmlFor="weather-notif" className="cursor-pointer">Weather Alerts</Label>
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

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <Label htmlFor="irrigation-notif" className="cursor-pointer">Irrigation Reminders</Label>
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

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <Label htmlFor="market-notif" className="cursor-pointer">Market Price Updates</Label>
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

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <Label htmlFor="health-notif" className="cursor-pointer">Crop Health Alerts</Label>
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
                    </CardContent>
                </Card>

                {/* Unit Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Ruler className="h-5 w-5 text-green-500" />
                            Unit Preferences
                        </CardTitle>
                        <CardDescription>Customize measurement units for your dashboard</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    </CardContent>
                </Card>

                {/* Language */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-purple-500" />
                            {t('header.language')}
                        </CardTitle>
                        <CardDescription>Select your preferred language</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label>Application Language</Label>
                            <Select
                                value={settings.language}
                                onValueChange={handleLanguageChange}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="English">English</SelectItem>
                                    <SelectItem value="Hindi">Hindi</SelectItem>
                                    <SelectItem value="Kannada">Kannada</SelectItem>
                                    <SelectItem value="Telugu">Telugu</SelectItem>
                                    <SelectItem value="Tamil">Tamil</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};
