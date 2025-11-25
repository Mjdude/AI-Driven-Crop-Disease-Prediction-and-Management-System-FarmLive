import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareStoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: (story: any) => void;
}

export const ShareStoryDialog: React.FC<ShareStoryDialogProps> = ({
    open,
    onOpenChange,
    onSuccess
}) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        achievement: '',
        story: '',
        location: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const newStory = {
                id: Date.now().toString(),
                name: 'You',
                location: formData.location || 'Your Location',
                avatar: 'YO',
                title: formData.title,
                story: formData.story,
                achievement: formData.achievement,
                image: '🏆',
                likes: 0,
                featured: false
            };

            onSuccess(newStory);
            onOpenChange(false);
            setFormData({ title: '', achievement: '', story: '', location: '' });
            toast.success('Story shared successfully! It will be reviewed by moderators.');
        } catch (error) {
            toast.error('Failed to share story');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Share Your Success Story</DialogTitle>
                    <DialogDescription>
                        Inspire others by sharing your farming achievements and journey
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Story Title</Label>
                        <Input
                            id="title"
                            required
                            placeholder="e.g., How I doubled my crop yield"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="achievement">Key Achievement</Label>
                        <Input
                            id="achievement"
                            required
                            placeholder="e.g., Increased revenue by 50%"
                            value={formData.achievement}
                            onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Farm Location</Label>
                        <Input
                            id="location"
                            required
                            placeholder="e.g., Punjab, India"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="story">Your Journey</Label>
                        <Textarea
                            id="story"
                            required
                            placeholder="Tell us about your challenges, solutions, and success..."
                            rows={6}
                            value={formData.story}
                            onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                        />
                    </div>

                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Upload photos of your farm or achievement</p>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Story
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
