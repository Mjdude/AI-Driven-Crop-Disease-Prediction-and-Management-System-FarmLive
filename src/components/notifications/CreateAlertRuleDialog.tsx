import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Bell, Cloud, TrendingUp, Bug, Droplets, FileText, DollarSign } from 'lucide-react';

interface CreateAlertRuleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CreateAlertRuleDialog: React.FC<CreateAlertRuleDialogProps> = ({
    open,
    onOpenChange
}) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('weather');
    const [condition, setCondition] = useState('greater_than');
    const [threshold, setThreshold] = useState(50);
    const [channels, setChannels] = useState<string[]>(['push']);
    const [location, setLocation] = useState('');

    const handleChannelToggle = (channel: string) => {
        if (channels.includes(channel)) {
            setChannels(channels.filter(c => c !== channel));
        } else {
            setChannels([...channels, channel]);
        }
    };

    const handleSubmit = () => {
        if (!name || !location) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Simulate API call
        toast.success('Alert rule created successfully!');
        onOpenChange(false);

        // Reset form
        setName('');
        setType('weather');
        setCondition('greater_than');
        setThreshold(50);
        setChannels(['push']);
        setLocation('');
    };

    const getIconForType = (t: string) => {
        switch (t) {
            case 'weather': return <Cloud className="h-4 w-4" />;
            case 'market': return <TrendingUp className="h-4 w-4" />;
            case 'pest': return <Bug className="h-4 w-4" />;
            case 'irrigation': return <Droplets className="h-4 w-4" />;
            case 'scheme': return <FileText className="h-4 w-4" />;
            case 'loan': return <DollarSign className="h-4 w-4" />;
            default: return <Bell className="h-4 w-4" />;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Custom Alert Rule</DialogTitle>
                    <DialogDescription>
                        Define conditions to trigger automated alerts
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Rule Name</Label>
                        <Input
                            placeholder="e.g. Heavy Rain Warning"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weather">Weather</SelectItem>
                                    <SelectItem value="market">Market Price</SelectItem>
                                    <SelectItem value="pest">Pest & Disease</SelectItem>
                                    <SelectItem value="irrigation">Irrigation</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                                placeholder="e.g. North Field"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-2 font-medium text-sm text-gray-700">
                            {getIconForType(type)}
                            <span>Condition Logic</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Select value={condition} onValueChange={setCondition}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="greater_than">Greater Than</SelectItem>
                                    <SelectItem value="less_than">Less Than</SelectItem>
                                    <SelectItem value="equals">Equals</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    value={threshold}
                                    onChange={(e) => setThreshold(Number(e.target.value))}
                                />
                                <span className="text-xs text-gray-500">
                                    {type === 'weather' ? 'mm/°C' : type === 'market' ? '%' : 'units'}
                                </span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Label className="text-xs text-gray-500 mb-2 block">SENSITIVITY</Label>
                            <Slider
                                defaultValue={[50]}
                                max={100}
                                step={1}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Notification Channels</Label>
                        <div className="flex flex-wrap gap-4 mt-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="push"
                                    checked={channels.includes('push')}
                                    onCheckedChange={() => handleChannelToggle('push')}
                                />
                                <label htmlFor="push" className="text-sm">Push</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="sms"
                                    checked={channels.includes('sms')}
                                    onCheckedChange={() => handleChannelToggle('sms')}
                                />
                                <label htmlFor="sms" className="text-sm">SMS</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="email"
                                    checked={channels.includes('email')}
                                    onCheckedChange={() => handleChannelToggle('email')}
                                />
                                <label htmlFor="email" className="text-sm">Email</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="whatsapp"
                                    checked={channels.includes('whatsapp')}
                                    onCheckedChange={() => handleChannelToggle('whatsapp')}
                                />
                                <label htmlFor="whatsapp" className="text-sm">WhatsApp</label>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}>Create Rule</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
