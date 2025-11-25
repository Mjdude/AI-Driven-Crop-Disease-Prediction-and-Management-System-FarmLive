import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Star, MapPin, Briefcase, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface MentorProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mentor: any;
    onConnect: (mentorId: string) => void;
}

export const MentorProfileDialog: React.FC<MentorProfileDialogProps> = ({
    open,
    onOpenChange,
    mentor,
    onConnect
}) => {
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    if (!mentor) return null;

    const handleRequest = async () => {
        setSending(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            onConnect(mentor.id);
            onOpenChange(false);
            setMessage('');
        } finally {
            setSending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-purple-100 text-purple-700 text-xl">
                                {mentor.avatar}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <DialogTitle className="text-xl">{mentor.name}</DialogTitle>
                            <DialogDescription className="flex items-center gap-2 mt-1">
                                <MapPin className="h-3 w-3" />
                                {mentor.location}
                                <span>•</span>
                                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                {mentor.rating} Rating
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <Briefcase className="h-4 w-4" />
                                <span className="text-sm">Experience</span>
                            </div>
                            <p className="font-semibold">{mentor.experience} Years</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm">Availability</span>
                            </div>
                            <Badge variant="secondary" className={
                                mentor.availability === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }>
                                {mentor.availability.charAt(0).toUpperCase() + mentor.availability.slice(1)}
                            </Badge>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2 text-sm">Areas of Expertise</h4>
                        <div className="flex flex-wrap gap-2">
                            {mentor.expertise.map((exp: string) => (
                                <Badge key={exp} variant="outline">{exp}</Badge>
                            ))}
                        </div>
                    </div>

                    {!mentor.connected && (
                        <div className="space-y-2">
                            <h4 className="font-semibold mb-2 text-sm">Request Mentorship</h4>
                            <Textarea
                                placeholder="Briefly explain why you'd like to connect..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={3}
                            />
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                    {mentor.connected ? (
                        <Button variant="secondary" disabled className="bg-green-100 text-green-800">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Connected
                        </Button>
                    ) : (
                        <Button onClick={handleRequest} disabled={sending || !message.trim()}>
                            {sending ? 'Sending...' : 'Send Request'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
