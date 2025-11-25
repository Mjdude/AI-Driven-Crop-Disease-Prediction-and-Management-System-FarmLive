import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, Calendar, User, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface ActivityLogDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface Activity {
    id: string;
    type: 'crop' | 'irrigation' | 'health' | 'harvest' | 'fertilizer' | 'pesticide';
    title: string;
    description: string;
    user: string;
    location: string;
    timestamp: Date;
    status: 'completed' | 'pending' | 'scheduled';
}

export const ActivityLogDialog: React.FC<ActivityLogDialogProps> = ({
    open,
    onOpenChange
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    // Mock activity data
    const activities: Activity[] = [
        {
            id: '1',
            type: 'crop',
            title: 'Rice Crop Planted',
            description: 'Planted Basmati rice in North Field, 5 acres',
            user: 'John Doe',
            location: 'North Field',
            timestamp: new Date('2024-11-22T10:30:00'),
            status: 'completed'
        },
        {
            id: '2',
            type: 'irrigation',
            title: 'Irrigation Scheduled',
            description: 'Drip irrigation scheduled for 2.5 hours, 5000 liters',
            user: 'John Doe',
            location: 'North Field',
            timestamp: new Date('2024-11-22T09:15:00'),
            status: 'scheduled'
        },
        {
            id: '3',
            type: 'health',
            title: 'Crop Health Check',
            description: 'AI analysis completed - Health score: 92%',
            user: 'System',
            location: 'South Field',
            timestamp: new Date('2024-11-21T14:20:00'),
            status: 'completed'
        },
        {
            id: '4',
            type: 'fertilizer',
            title: 'Fertilizer Applied',
            description: 'Applied nitrogen-rich fertilizer (Urea) - 50kg',
            user: 'John Doe',
            location: 'East Field',
            timestamp: new Date('2024-11-20T08:00:00'),
            status: 'completed'
        },
        {
            id: '5',
            type: 'pesticide',
            title: 'Pest Control',
            description: 'Sprayed neem oil solution for aphid control',
            user: 'Jane Smith',
            location: 'West Field',
            timestamp: new Date('2024-11-19T16:45:00'),
            status: 'completed'
        }
    ];

    const getTypeColor = (type: string) => {
        const colors = {
            crop: 'bg-green-100 text-green-800',
            irrigation: 'bg-blue-100 text-blue-800',
            health: 'bg-purple-100 text-purple-800',
            harvest: 'bg-yellow-100 text-yellow-800',
            fertilizer: 'bg-orange-100 text-orange-800',
            pesticide: 'bg-red-100 text-red-800'
        };
        return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const getStatusColor = (status: string) => {
        const colors = {
            completed: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            scheduled: 'bg-blue-100 text-blue-800'
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const filteredActivities = activities.filter(activity => {
        const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            activity.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || activity.type === filterType;
        const matchesStatus = filterStatus === 'all' || activity.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const handleExport = () => {
        const data = JSON.stringify(filteredActivities, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `activity-log-${format(new Date(), 'yyyy-MM-dd')}.json`;
        a.click();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Activity Log</DialogTitle>
                    <DialogDescription>
                        Complete history of all farm activities
                    </DialogDescription>
                </DialogHeader>

                {/* Filters */}
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search activities..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="w-[180px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="crop">Crop</SelectItem>
                                <SelectItem value="irrigation">Irrigation</SelectItem>
                                <SelectItem value="health">Health</SelectItem>
                                <SelectItem value="harvest">Harvest</SelectItem>
                                <SelectItem value="fertilizer">Fertilizer</SelectItem>
                                <SelectItem value="pesticide">Pesticide</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Activity List */}
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {filteredActivities.length > 0 ? (
                            filteredActivities.map((activity) => (
                                <div key={activity.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold">{activity.title}</h4>
                                                <Badge className={getTypeColor(activity.type)}>
                                                    {activity.type}
                                                </Badge>
                                                <Badge className={getStatusColor(activity.status)}>
                                                    {activity.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600">{activity.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {format(activity.timestamp, 'PPp')}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            {activity.user}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {activity.location}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <p>No activities found matching your filters</p>
                            </div>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="border-t pt-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{filteredActivities.length}</div>
                                <div className="text-sm text-gray-600">Total Activities</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-600">
                                    {filteredActivities.filter(a => a.status === 'completed').length}
                                </div>
                                <div className="text-sm text-gray-600">Completed</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {filteredActivities.filter(a => a.status === 'scheduled').length}
                                </div>
                                <div className="text-sm text-gray-600">Scheduled</div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                    <Button onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Log
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
