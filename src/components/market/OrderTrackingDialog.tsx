import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Truck, Package, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface OrderTrackingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: any;
}

export const OrderTrackingDialog: React.FC<OrderTrackingDialogProps> = ({
    open,
    onOpenChange,
    order
}) => {
    if (!order) return null;

    const steps = [
        { status: 'confirmed', label: 'Order Confirmed', date: order.orderDate, icon: CheckCircle },
        { status: 'shipped', label: 'Shipped', date: '2024-11-21T10:00:00Z', icon: Package },
        { status: 'out_for_delivery', label: 'Out for Delivery', date: null, icon: Truck },
        { status: 'delivered', label: 'Delivered', date: null, icon: MapPin }
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.status) || 1; // Mock logic

    const handleDownloadInvoice = () => {
        toast.success('Invoice downloaded successfully');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Track Order #{order.orderNumber}</DialogTitle>
                    <DialogDescription>
                        Expected Delivery: {new Date(order.expectedDelivery).toLocaleDateString()}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6">
                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

                        <div className="space-y-8 relative">
                            {steps.map((step, index) => {
                                const isCompleted = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;
                                const Icon = step.icon;

                                return (
                                    <div key={step.status} className="flex gap-4 items-start">
                                        <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${isCompleted ? 'bg-green-50 border-green-500 text-green-600' : 'bg-white border-gray-200 text-gray-300'
                                            }`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <div className="pt-1">
                                            <h4 className={`font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                                                {step.label}
                                            </h4>
                                            {step.date && isCompleted && (
                                                <p className="text-sm text-gray-500">
                                                    {new Date(step.date).toLocaleString()}
                                                </p>
                                            )}
                                            {isCurrent && (
                                                <Badge variant="secondary" className="mt-1 bg-blue-100 text-blue-800">
                                                    In Progress
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" className="w-full sm:w-auto" onClick={handleDownloadInvoice}>
                        Download Invoice
                    </Button>
                    <Button className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
