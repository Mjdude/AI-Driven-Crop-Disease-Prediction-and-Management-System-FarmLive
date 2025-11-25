import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';

interface ReviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    targetName: string;
    targetType: 'seller' | 'product';
}

export const ReviewDialog: React.FC<ReviewDialogProps> = ({
    open,
    onOpenChange,
    targetName,
    targetType
}) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success(`Review submitted for ${targetName}`);
        setIsSubmitting(false);
        onOpenChange(false);
        setRating(0);
        setReview('');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Rate {targetType === 'seller' ? 'Seller' : 'Product'}</DialogTitle>
                    <DialogDescription>
                        Share your experience with {targetName}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-6">
                    <div className="flex flex-col items-center space-y-2">
                        <Label>Your Rating</Label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <Star
                                        className={`h-8 w-8 ${(hoverRating || rating) >= star
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 font-medium">
                            {rating === 1 && 'Poor'}
                            {rating === 2 && 'Fair'}
                            {rating === 3 && 'Good'}
                            {rating === 4 && 'Very Good'}
                            {rating === 5 && 'Excellent'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Write a Review (Optional)</Label>
                        <Textarea
                            placeholder="Tell us more about your experience..."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Button
                            variant="outline"
                            className={`flex-1 ${rating > 0 && rating < 3 ? 'border-red-200 bg-red-50 text-red-700' : ''}`}
                            onClick={() => setRating(1)}
                        >
                            <ThumbsDown className="h-4 w-4 mr-2" />
                            Not Good
                        </Button>
                        <Button
                            variant="outline"
                            className={`flex-1 ${rating >= 4 ? 'border-green-200 bg-green-50 text-green-700' : ''}`}
                            onClick={() => setRating(5)}
                        >
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Recommend
                        </Button>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
