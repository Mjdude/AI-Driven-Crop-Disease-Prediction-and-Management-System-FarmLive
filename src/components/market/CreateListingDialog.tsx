import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CreateListingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: (listing: any) => void;
}

export const CreateListingDialog: React.FC<CreateListingDialogProps> = ({
    open,
    onOpenChange,
    onSuccess
}) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        product: '',
        category: '',
        quantity: '',
        unit: 'quintal',
        pricePerUnit: '',
        quality: '',
        minOrder: '',
        availableFrom: '',
        description: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            const newListing = {
                id: Date.now().toString(),
                ...formData,
                seller: {
                    name: 'You',
                    location: 'Your Farm',
                    rating: 5.0,
                    verified: true
                },
                image: '🌾', // Placeholder
                totalPrice: Number(formData.quantity) * Number(formData.pricePerUnit),
                saved: false
            };

            toast.success('Listing created successfully!');
            onSuccess?.(newListing);
            onOpenChange(false);

            // Reset form
            setFormData({
                product: '',
                category: '',
                quantity: '',
                unit: 'quintal',
                pricePerUnit: '',
                quality: '',
                minOrder: '',
                availableFrom: '',
                description: ''
            });
        } catch (error) {
            toast.error('Failed to create listing');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Listing</DialogTitle>
                    <DialogDescription>
                        List your produce on the marketplace
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="product">Product Name</Label>
                            <Input
                                id="product"
                                required
                                value={formData.product}
                                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                                placeholder="e.g. Basmati Rice"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(val) => setFormData({ ...formData, category: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Grains">Grains</SelectItem>
                                    <SelectItem value="Vegetables">Vegetables</SelectItem>
                                    <SelectItem value="Fruits">Fruits</SelectItem>
                                    <SelectItem value="Pulses">Pulses</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity Available</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="quantity"
                                    type="number"
                                    required
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                />
                                <Select
                                    value={formData.unit}
                                    onValueChange={(val) => setFormData({ ...formData, unit: val })}
                                >
                                    <SelectTrigger className="w-24">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="quintal">Quintal</SelectItem>
                                        <SelectItem value="kg">Kg</SelectItem>
                                        <SelectItem value="ton">Ton</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price per Unit (₹)</Label>
                            <Input
                                id="price"
                                type="number"
                                required
                                value={formData.pricePerUnit}
                                onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="quality">Quality Grade</Label>
                            <Select
                                value={formData.quality}
                                onValueChange={(val) => setFormData({ ...formData, quality: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select grade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Premium">Premium</SelectItem>
                                    <SelectItem value="Grade A">Grade A</SelectItem>
                                    <SelectItem value="Grade B">Grade B</SelectItem>
                                    <SelectItem value="Standard">Standard</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="minOrder">Minimum Order</Label>
                            <Input
                                id="minOrder"
                                type="number"
                                value={formData.minOrder}
                                onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                                placeholder="Min quantity"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="available">Available From</Label>
                        <Input
                            id="available"
                            type="date"
                            required
                            value={formData.availableFrom}
                            onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe your produce..."
                            rows={3}
                        />
                    </div>

                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Click to upload product images</p>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Listing
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
