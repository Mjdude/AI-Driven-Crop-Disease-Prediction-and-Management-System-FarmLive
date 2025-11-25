import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Camera } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const UserProfileDialog: React.FC<UserProfileDialogProps> = ({
    open,
    onOpenChange
}) => {
    const [profile, setProfile] = useState({
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@farmliveinnovations.com',
        phone: '+91 98765 43210',
        location: 'Punjab, India',
        role: 'Farmer',
        farmName: 'Green Valley Farm',
        farmSize: '25 acres',
        experience: '15 years',
        bio: 'Experienced farmer specializing in wheat and rice cultivation. Passionate about sustainable farming practices.'
    });

    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            // Save to localStorage
            localStorage.setItem('userProfile', JSON.stringify(profile));
            await new Promise(resolve => setTimeout(resolve, 500));
            toast.success('Profile updated successfully!');
            onOpenChange(false);
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = () => {
        toast.info('Image upload feature - select a profile picture');
        // TODO: Implement actual image upload
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>User Profile</DialogTitle>
                    <DialogDescription>
                        Manage your personal information and farm details
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src="" alt={profile.name} />
                            <AvatarFallback className="bg-farm-green-100 text-farm-green-600 text-2xl">
                                {profile.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" onClick={handleImageUpload}>
                            <Camera className="mr-2 h-4 w-4" />
                            Change Photo
                        </Button>
                    </div>

                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Personal Information</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    <User className="inline h-4 w-4 mr-1" />
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">
                                    <Briefcase className="inline h-4 w-4 mr-1" />
                                    Role
                                </Label>
                                <Input
                                    id="role"
                                    value={profile.role}
                                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    <Mail className="inline h-4 w-4 mr-1" />
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">
                                    <Phone className="inline h-4 w-4 mr-1" />
                                    Phone
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">
                                <MapPin className="inline h-4 w-4 mr-1" />
                                Location
                            </Label>
                            <Input
                                id="location"
                                value={profile.location}
                                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Farm Information */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="font-semibold text-lg">Farm Information</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="farmName">Farm Name</Label>
                                <Input
                                    id="farmName"
                                    value={profile.farmName}
                                    onChange={(e) => setProfile({ ...profile, farmName: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="farmSize">Farm Size</Label>
                                <Input
                                    id="farmSize"
                                    value={profile.farmSize}
                                    onChange={(e) => setProfile({ ...profile, farmSize: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="experience">
                                <Calendar className="inline h-4 w-4 mr-1" />
                                Farming Experience
                            </Label>
                            <Input
                                id="experience"
                                value={profile.experience}
                                onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                rows={3}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
