import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, MessageCircle, Share2, Send, Clock, MapPin, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';

interface Comment {
    id: string;
    author: string;
    avatar: string;
    content: string;
    timestamp: string;
    likes: number;
}

interface PostDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    post: any;
    onLike: (postId: string) => void;
}

export const PostDetailsDialog: React.FC<PostDetailsDialogProps> = ({
    open,
    onOpenChange,
    post,
    onLike
}) => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<Comment[]>([
        {
            id: '1',
            author: 'Rahul Singh',
            avatar: 'RS',
            content: 'This is really inspiring! Great work.',
            timestamp: '2 hours ago',
            likes: 5
        },
        {
            id: '2',
            author: 'Meera Reddy',
            avatar: 'MR',
            content: 'Could you share more details about the fertilizers used?',
            timestamp: '1 hour ago',
            likes: 2
        }
    ]);

    if (!post) return null;

    const handleSendComment = () => {
        if (!comment.trim()) return;

        const newComment: Comment = {
            id: Date.now().toString(),
            author: 'You',
            avatar: 'YO',
            content: comment,
            timestamp: 'Just now',
            likes: 0
        };

        setComments([...comments, newComment]);
        setComment('');
        toast.success('Comment added');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback className="bg-purple-100 text-purple-700">
                                    {post.author.avatar}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold text-base">{post.author.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span>{post.author.location}</span>
                                    <span>•</span>
                                    <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 pt-2">
                    <div className="mb-4">
                        <Badge className="mb-2 bg-purple-100 text-purple-800 hover:bg-purple-100">
                            {post.category}
                        </Badge>
                        <p className="text-gray-800 text-lg leading-relaxed">{post.content}</p>
                        {post.image && (
                            <div className="mt-4 text-6xl text-center py-8 bg-gray-50 rounded-lg">
                                {post.image}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between py-3 border-y border-gray-100 mb-4">
                        <div className="flex gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-600 hover:text-blue-600"
                                onClick={() => onLike(post.id)}
                            >
                                <ThumbsUp className="h-4 w-4 mr-2" />
                                {post.likes} Likes
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                {comments.length} Comments
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm text-gray-900">Comments</h4>
                        {comments.map((c) => (
                            <div key={c.id} className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                                        {c.avatar}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-sm">{c.author}</span>
                                        <span className="text-xs text-gray-500">{c.timestamp}</span>
                                    </div>
                                    <p className="text-sm text-gray-700">{c.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t bg-white">
                    <div className="flex gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">YO</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 relative">
                            <Input
                                placeholder="Write a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="pr-10"
                                onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                            />
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={handleSendComment}
                                disabled={!comment.trim()}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
