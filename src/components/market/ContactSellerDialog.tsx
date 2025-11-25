import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

interface ContactSellerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    listingId: string;
    sellerName: string;
}

export const ContactSellerDialog: React.FC<ContactSellerDialogProps> = ({
    open,
    onOpenChange,
    listingId,
    sellerName
}) => {
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) return;

        setSending(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success(`Message sent to ${sellerName}`);
            setMessage('');
            onOpenChange(false);
        } catch (error) {
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Contact Seller</DialogTitle>
                    <DialogDescription>
                        Send a message to {sellerName} about this listing
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar>
                            <AvatarImage src="" />
                            <AvatarFallback>{sellerName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{sellerName}</p>
                            <p className="text-xs text-gray-500">Typically replies within 1 hour</p>
                        </div>
                    </div>

                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Hi, I'm interested in your listing. Is it still available?"
                        rows={5}
                        className="resize-none"
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSend} disabled={!message.trim() || sending}>
                        {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Send Message
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
