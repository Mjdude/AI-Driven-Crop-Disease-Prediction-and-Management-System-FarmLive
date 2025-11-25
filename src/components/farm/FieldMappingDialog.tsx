import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Droplet, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface FieldMappingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface Field {
    id: string;
    name: string;
    crop: string;
    area: string;
    status: 'Healthy' | 'Attention' | 'Critical';
    moisture: string;
    lastIrrigated: string;
    coordinates: [number, number]; // Lat, Lng
}

const mockFields: Field[] = [
    {
        id: '1',
        name: 'North Field',
        crop: 'Wheat',
        area: '2.5 Acres',
        status: 'Healthy',
        moisture: '65%',
        lastIrrigated: '2 days ago',
        coordinates: [28.6139, 77.2090] // Example: New Delhi
    },
    {
        id: '2',
        name: 'East Plot',
        crop: 'Rice',
        area: '1.8 Acres',
        status: 'Attention',
        moisture: '45%',
        lastIrrigated: '5 days ago',
        coordinates: [28.6129, 77.2110]
    },
    {
        id: '3',
        name: 'South Garden',
        crop: 'Tomato',
        area: '0.5 Acres',
        status: 'Critical',
        moisture: '30%',
        lastIrrigated: '1 week ago',
        coordinates: [28.6149, 77.2070]
    }
];

export const FieldMappingDialog: React.FC<FieldMappingDialogProps> = ({ open, onOpenChange }) => {
    const { t } = useTranslation();
    const [selectedField, setSelectedField] = useState<Field | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Healthy': return 'bg-green-500';
            case 'Attention': return 'bg-yellow-500';
            case 'Critical': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'Healthy': return t('crop_monitoring.field_mapping.legend.healthy');
            case 'Attention': return t('crop_monitoring.field_mapping.legend.needs_attention');
            case 'Critical': return t('crop_monitoring.field_mapping.legend.critical');
            default: return status;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{t('crop_monitoring.field_mapping.dialog_title')}</DialogTitle>
                    <DialogDescription>
                        {t('crop_monitoring.field_mapping.dialog_desc')}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 flex gap-6 min-h-0">
                    {/* Map Area */}
                    <div className="flex-1 rounded-xl overflow-hidden border-2 border-green-100 relative z-0">
                        <MapContainer center={[28.6139, 77.2090]} zoom={15} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {mockFields.map((field) => (
                                <Marker
                                    key={field.id}
                                    position={field.coordinates}
                                    eventHandlers={{
                                        click: () => setSelectedField(field),
                                    }}
                                >
                                    <Popup>
                                        <div className="font-bold">{field.name}</div>
                                        <div className={`text-xs ${getStatusColor(field.status).replace('bg-', 'text-')}`}>
                                            {field.status}
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>

                    {/* Sidebar Details */}
                    <div className="w-80 bg-gray-50 rounded-xl p-4 border overflow-y-auto">
                        {selectedField ? (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{selectedField.name}</h3>
                                    <Badge className={`mt-2 ${getStatusColor(selectedField.status)}`}>
                                        {getStatusLabel(selectedField.status)}
                                    </Badge>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-white p-3 rounded-lg shadow-sm">
                                        <div className="text-sm text-gray-500 mb-1">{t('crop_monitoring.field_mapping.details.crop_type')}</div>
                                        <div className="font-semibold">{selectedField.crop}</div>
                                    </div>

                                    <div className="bg-white p-3 rounded-lg shadow-sm">
                                        <div className="text-sm text-gray-500 mb-1">{t('crop_monitoring.field_mapping.details.area_size')}</div>
                                        <div className="font-semibold">{selectedField.area}</div>
                                    </div>

                                    <div className="bg-white p-3 rounded-lg shadow-sm">
                                        <div className="text-sm text-gray-500 mb-1">{t('crop_monitoring.field_mapping.details.soil_moisture')}</div>
                                        <div className="flex items-center gap-2">
                                            <Droplet className="h-4 w-4 text-blue-500" />
                                            <span className="font-semibold">{selectedField.moisture}</span>
                                        </div>
                                    </div>

                                    <div className="bg-white p-3 rounded-lg shadow-sm">
                                        <div className="text-sm text-gray-500 mb-1">{t('crop_monitoring.field_mapping.details.last_irrigated')}</div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <span className="font-semibold">{selectedField.lastIrrigated}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <Button className="w-full">{t('crop_monitoring.field_mapping.details.view_report')}</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center">
                                <MapPin className="h-12 w-12 mb-3 opacity-20" />
                                <p>{t('crop_monitoring.field_mapping.details.select_prompt')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
