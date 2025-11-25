import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Truck, CheckCircle, XCircle, Clock, MapPin, Phone, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface OrderManagementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface SellerOrder {
    id: string;
    orderNumber: string;
    buyer: string;
    location: string;
    product: string;
    quantity: string;
    amount: string;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    date: string;
}

const mockSellerOrders: SellerOrder[] = [
    {
        id: '1',
        orderNumber: 'ORD-2024-005',
        buyer: 'Rahul Singh',
        location: 'Amritsar, Punjab',
        product: 'Basmati Rice',
        quantity: '10 Quintal',
        amount: '₹53,000',
        status: 'pending',
        date: '2024-11-22'
    },
    {
        id: '2',
        orderNumber: 'ORD-2024-004',
        buyer: 'Priya Sharma',
        location: 'Ludhiana, Punjab',
        product: 'Wheat',
        quantity: '25 Quintal',
        amount: '₹65,000',
        status: 'confirmed',
        date: '2024-11-21'
    },
    {
        id: '3',
        orderNumber: 'ORD-2024-003',
        buyer: 'Green Grocers Ltd',
        location: 'Delhi',
        product: 'Tomatoes',
        quantity: '50 Quintal',
        amount: '₹1,45,000',
        status: 'shipped',
        date: '2024-11-20'
    }
];

export const OrderManagementDialog: React.FC<OrderManagementDialogProps> = ({
    open,
    onOpenChange
}) => {
    const [orders, setOrders] = useState<SellerOrder[]>(mockSellerOrders);
    const [activeTab, setActiveTab] = useState('pending');

    const handleUpdateStatus = (orderId: string, newStatus: SellerOrder['status']) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
        toast.success(`Order status updated to ${newStatus}`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'all') return true;
        if (activeTab === 'pending') return order.status === 'pending';
        if (activeTab === 'active') return ['confirmed', 'shipped'].includes(order.status);
        if (activeTab === 'completed') return ['delivered', 'cancelled'].includes(order.status);
        return true;
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Seller Order Management</DialogTitle>
                    <DialogDescription>
                        Manage incoming orders and update delivery status
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="pending" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="pending">New Orders</TabsTrigger>
                        <TabsTrigger value="active">In Progress</TabsTrigger>
                        <TabsTrigger value="completed">History</TabsTrigger>
                        <TabsTrigger value="all">All Orders</TabsTrigger>
                    </TabsList>

                    <ScrollArea className="flex-1 mt-4 pr-4">
                        <div className="space-y-4">
                            {filteredOrders.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                    <p>No orders found in this category</p>
                                </div>
                            ) : (
                                filteredOrders.map((order) => (
                                    <div key={order.id} className="border rounded-lg p-4 bg-white shadow-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="font-bold text-lg">{order.orderNumber}</h4>
                                                    <Badge className={getStatusColor(order.status)}>
                                                        {order.status.toUpperCase()}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-500">{order.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg">{order.amount}</p>
                                                <p className="text-sm text-gray-600">{order.quantity}</p>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase mb-1">Product</p>
                                                <p className="font-medium">{order.product}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase mb-1">Buyer</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{order.buyer}</span>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                                        <MessageSquare className="h-3 w-3" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                                        <Phone className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {order.location}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 pt-2 border-t">
                                            {order.status === 'pending' && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                                    >
                                                        <XCircle className="h-4 w-4 mr-2" />
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                        Accept Order
                                                    </Button>
                                                </>
                                            )}

                                            {order.status === 'confirmed' && (
                                                <Button
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                    onClick={() => handleUpdateStatus(order.id, 'shipped')}
                                                >
                                                    <Truck className="h-4 w-4 mr-2" />
                                                    Mark as Shipped
                                                </Button>
                                            )}

                                            {order.status === 'shipped' && (
                                                <Button
                                                    className="bg-green-600 hover:bg-green-700"
                                                    onClick={() => handleUpdateStatus(order.id, 'delivered')}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Mark as Delivered
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};
