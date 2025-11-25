import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, BellOff, Trash2, Check, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface NotificationsManagementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface Notification {
    id: string;
    type: 'weather' | 'irrigation' | 'market' | 'health' | 'system';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    priority: 'low' | 'medium' | 'high';
}

export const NotificationsManagementDialog: React.FC<NotificationsManagementDialogProps> = ({
    open,
    onOpenChange
}) => {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            type: 'weather',
            title: 'Heavy Rain Alert',
            message: 'Heavy rainfall expected in next 24 hours. Postpone irrigation.',
            timestamp: new Date('2024-11-22T08:00:00'),
            read: false,
            priority: 'high'
        },
        {
            id: '2',
            type: 'irrigation',
            title: 'Irrigation Reminder',
            message: 'Scheduled irrigation for North Field starts in 2 hours.',
            timestamp: new Date('2024-11-22T07:30:00'),
            read: false,
            priority: 'medium'
        },
        {
            id: '3',
            type: 'health',
            title: 'Crop Health Check Due',
            message: 'Recommended health check for Tomato crop in South Field.',
            timestamp: new Date('2024-11-21T16:00:00'),
            read: true,
            priority: 'medium'
        },
        {
            id: '4',
            type: 'market',
            title: 'Price Alert',
            message: 'Wheat prices increased by 5%. Good time to sell.',
            timestamp: new Date('2024-11-21T12:00:00'),
            read: true,
            priority: 'high'
        },
        {
            id: '5',
            type: 'system',
            title: 'System Update',
            message: 'New features available: AI crop recommendations.',
            timestamp: new Date('2024-11-20T10:00:00'),
            read: true,
            priority: 'low'
        }
    ]);

    const [filterType, setFilterType] = useState('all');
    const [filterRead, setFilterRead] = useState('all');

    const getTypeIcon = (type: string) => {
        const icons = {
            weather: AlertTriangle,
            irrigation: Info,
            market: CheckCircle,
            health: AlertTriangle,
            system: Bell
        };
        return icons[type as keyof typeof icons] || Bell;
    };

    const getTypeColor = (type: string) => {
        const colors = {
            weather: 'bg-blue-100 text-blue-800',
            irrigation: 'bg-cyan-100 text-cyan-800',
            market: 'bg-green-100 text-green-800',
            health: 'bg-purple-100 text-purple-800',
            system: 'bg-gray-100 text-gray-800'
        };
        return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const getPriorityColor = (priority: string) => {
        const colors = {
            low: 'bg-gray-100 text-gray-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-red-100 text-red-800'
        };
        return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const filteredNotifications = notifications.filter(notif => {
        const matchesType = filterType === 'all' || notif.type === filterType;
        const matchesRead = filterRead === 'all' ||
            (filterRead === 'unread' && !notif.read) ||
            (filterRead === 'read' && notif.read);
        return matchesType && matchesRead;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
        toast.success('Notification marked as read');
    };

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        toast.success('All notifications marked as read');
    };

    const handleDelete = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
        toast.success('Notification deleted');
    };

    const handleClearAll = () => {
        setNotifications([]);
        toast.success('All notifications cleared');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications
                        {unreadCount > 0 && (
                            <Badge className="bg-red-500 text-white">{unreadCount} new</Badge>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        Manage your farm notifications and alerts
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="all" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
                        <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        {/* Filters */}
                        <div className="flex gap-3">
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="weather">Weather</SelectItem>
                                    <SelectItem value="irrigation">Irrigation</SelectItem>
                                    <SelectItem value="market">Market</SelectItem>
                                    <SelectItem value="health">Health</SelectItem>
                                    <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filterRead} onValueChange={setFilterRead}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="unread">Unread</SelectItem>
                                    <SelectItem value="read">Read</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                onClick={handleMarkAllAsRead}
                                disabled={unreadCount === 0}
                                className="ml-auto"
                            >
                                <Check className="mr-2 h-4 w-4" />
                                Mark All Read
                            </Button>
                        </div>

                        {/* Notifications List */}
                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {filteredNotifications.length > 0 ? (
                                filteredNotifications.map((notif) => {
                                    const Icon = getTypeIcon(notif.type);
                                    return (
                                        <div
                                            key={notif.id}
                                            className={`border rounded-lg p-4 ${!notif.read ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <Icon className="h-5 w-5 mt-0.5 text-gray-600" />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-semibold">{notif.title}</h4>
                                                            <Badge className={getTypeColor(notif.type)}>
                                                                {notif.type}
                                                            </Badge>
                                                            <Badge className={getPriorityColor(notif.priority)}>
                                                                {notif.priority}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-600">{notif.message}</p>
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            {format(notif.timestamp, 'PPp')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {!notif.read && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleMarkAsRead(notif.id)}
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(notif.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <BellOff className="h-12 w-12 mx-auto mb-2" />
                                    <p>No notifications found</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="unread" className="space-y-4">
                        <div className="space-y-2 max-h-[450px] overflow-y-auto">
                            {notifications.filter(n => !n.read).length > 0 ? (
                                notifications.filter(n => !n.read).map((notif) => {
                                    const Icon = getTypeIcon(notif.type);
                                    return (
                                        <div key={notif.id} className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <Icon className="h-5 w-5 mt-0.5 text-gray-600" />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-semibold">{notif.title}</h4>
                                                            <Badge className={getTypeColor(notif.type)}>{notif.type}</Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-600">{notif.message}</p>
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            {format(notif.timestamp, 'PPp')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleMarkAsRead(notif.id)}
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(notif.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                                    <p>All caught up! No unread notifications.</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-4">
                        <div className="space-y-4">
                            <h4 className="font-semibold">Notification Preferences</h4>
                            <p className="text-sm text-gray-600">
                                Manage your notification preferences in Farm Settings.
                            </p>
                            <Button onClick={() => {
                                onOpenChange(false);
                                // This would open farm settings
                                toast.info('Opening Farm Settings...');
                            }}>
                                Go to Farm Settings
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleClearAll}
                        disabled={notifications.length === 0}
                    >
                        Clear All
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
