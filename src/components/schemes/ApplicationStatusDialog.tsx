import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';

interface Application {
    id: string;
    schemeName: string;
    date: string;
    status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
    applicationId: string;
}

interface ApplicationStatusDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    applications: Application[];
}

export const ApplicationStatusDialog: React.FC<ApplicationStatusDialogProps> = ({
    open,
    onOpenChange,
    applications
}) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            case 'Under Review': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Approved': return <CheckCircle className="h-4 w-4" />;
            case 'Rejected': return <AlertCircle className="h-4 w-4" />;
            case 'Under Review': return <Clock className="h-4 w-4" />;
            default: return <FileText className="h-4 w-4" />;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>My Applications</DialogTitle>
                    <DialogDescription>
                        Track the status of your submitted scheme applications
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[400px] pr-4">
                    {applications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                            <FileText className="h-10 w-10 mb-2 opacity-20" />
                            <p>No applications submitted yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {applications.map((app) => (
                                <div key={app.id} className="border rounded-lg p-4 bg-white shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-gray-900">{app.schemeName}</h4>
                                        <Badge className={getStatusColor(app.status)} variant="outline">
                                            <span className="flex items-center gap-1">
                                                {getStatusIcon(app.status)}
                                                {app.status}
                                            </span>
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-gray-500 space-y-1">
                                        <p>Application ID: <span className="font-mono text-gray-700">{app.applicationId}</span></p>
                                        <p>Submitted on: {new Date(app.date).toLocaleDateString()}</p>
                                    </div>

                                    {/* Status Timeline (Simplified) */}
                                    <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-gray-400">
                                        <div className={`flex flex-col items-center ${['Submitted', 'Under Review', 'Approved'].includes(app.status) ? 'text-blue-600' : ''}`}>
                                            <div className="w-2 h-2 rounded-full bg-current mb-1" />
                                            Submitted
                                        </div>
                                        <div className="h-[1px] flex-1 bg-gray-200 mx-2" />
                                        <div className={`flex flex-col items-center ${['Under Review', 'Approved'].includes(app.status) ? 'text-blue-600' : ''}`}>
                                            <div className="w-2 h-2 rounded-full bg-current mb-1" />
                                            Review
                                        </div>
                                        <div className="h-[1px] flex-1 bg-gray-200 mx-2" />
                                        <div className={`flex flex-col items-center ${app.status === 'Approved' ? 'text-green-600' : app.status === 'Rejected' ? 'text-red-600' : ''}`}>
                                            <div className="w-2 h-2 rounded-full bg-current mb-1" />
                                            Decision
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};
