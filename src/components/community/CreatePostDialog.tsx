import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Image, MapPin, Video, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CreatePostDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: (post: any) => void;
}

export const CreatePostDialog: React.FC<CreatePostDialogProps> = ({
    open,
    onOpenChange,
    onSuccess
}) => {
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('General');
    const [location, setLocation] = useState('');
    const [media, setMedia] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handlePost = async () => {
        if (!content.trim()) return;

        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newPost = {
                id: Date.now().toString(),
                author: {
                    name: 'You',
                    avatar: 'YO',
                    location: location || 'Your Location',
                    verified: false
                },
                content,
                image: media,
                likes: 0,
                comments: 0,
                shares: 0,
                timestamp: new Date().toISOString(),
                category,
                read: true
            };

            onSuccess(newPost);
            setContent('');
            setCategory('General');
            setLocation('');
            setMedia(null);
            onOpenChange(false);
            toast.success('Post created successfully!');
        } catch (error) {
            toast.error('Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    const handleMediaUpload = () => {
        // Simulate media upload
        const emojis = ['🌾', '🚜', '🥬', '🌽', '🍅', '🥔'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        setMedia(randomEmoji);
        toast.success('Image added');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Post</DialogTitle>
                    <DialogDescription>
                        Share your thoughts, questions, or updates with the community
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="General">General</SelectItem>
                                <SelectItem value="Question">Question</SelectItem>
                                <SelectItem value="Success Story">Success Story</SelectItem>
                                <SelectItem value="Event">Event</SelectItem>
                                <SelectItem value="Market Update">Market Update</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Content</Label>
                        <Textarea
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={5}
                            className="resize-none"
                        />
                    </div>

                    {media && (
                        <div className="relative bg-gray-100 rounded-lg p-8 text-center text-6xl">
                            {media}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 bg-white/80 hover:bg-white rounded-full"
                                onClick={() => setMedia(null)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleMediaUpload} type="button">
                            <Image className="h-4 w-4 mr-2" />
                            Photo
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleMediaUpload} type="button">
                            <Video className="h-4 w-4 mr-2" />
                            Video
                        </Button>
                        <Button
                            variant={location ? "secondary" : "outline"}
                            size="sm"
                            onClick={() => setLocation(location ? '' : 'Punjab, India')}
                            type="button"
                        >
                            <MapPin className="h-4 w-4 mr-2" />
                            {location ? 'Location Added' : 'Add Location'}
                        </Button>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handlePost} disabled={!content.trim() || loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Post
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
