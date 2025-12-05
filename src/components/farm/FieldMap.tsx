import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Droplet, Calendar, X, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GoogleMap, LoadScript, Marker, InfoWindow, Circle } from '@react-google-maps/api';

interface Field {
    id: string;
    name: string;
    crop: string;
    area: string;
    status: 'Healthy' | 'Attention' | 'Critical';
    moisture: string;
    lastIrrigated: string;
    coordinates: { lat: number; lng: number };
    diseaseRisk?: string;
}

interface DiseaseOutbreak {
    id: string;
    name: string;
    disease: string;
    severity: 'Low' | 'Medium' | 'High';
    affectedArea: string;
    coordinates: { lat: number; lng: number };
    radius: number; // in meters
    detectedDate: string;
    cropType: string;
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
        coordinates: { lat: 15.8156, lng: 74.8692 }, // Bailhongal - rural wheat fields outside Belgaum city
        diseaseRisk: 'Low'
    },
    {
        id: '2',
        name: 'East Plot',
        crop: 'Rice',
        area: '1.8 Acres',
        status: 'Attention',
        moisture: '45%',
        lastIrrigated: '5 days ago',
        coordinates: { lat: 12.6450, lng: 76.6850 }, // Pandavapura - rural paddy fields in Mandya district
        diseaseRisk: 'Medium'
    },
    {
        id: '3',
        name: 'South Garden',
        crop: 'Tomato',
        area: '0.5 Acres',
        status: 'Critical',
        moisture: '30%',
        lastIrrigated: '1 week ago',
        coordinates: { lat: 13.0394, lng: 75.7847 }, // Sakleshpur - rural vegetable farms outside Hassan city
        diseaseRisk: 'High'
    }
];

const mockDiseaseOutbreaks: DiseaseOutbreak[] = [
    {
        id: 'd1',
        name: 'Blight Warning Zone',
        disease: 'Late Blight',
        severity: 'High',
        affectedArea: '1.2 Acres',
        coordinates: { lat: 13.0450, lng: 75.7900 }, // Near Sakleshpur tomato fields
        radius: 500,
        detectedDate: '2024-03-10',
        cropType: 'Tomato'
    },
    {
        id: 'd2',
        name: 'Rust Watch Area',
        disease: 'Wheat Rust',
        severity: 'Medium',
        affectedArea: '3.5 Acres',
        coordinates: { lat: 15.8200, lng: 74.8750 }, // Near Bailhongal wheat fields
        radius: 800,
        detectedDate: '2024-03-12',
        cropType: 'Wheat'
    },
    {
        id: 'd3',
        name: 'Blast Monitor Zone',
        disease: 'Rice Blast',
        severity: 'Low',
        affectedArea: '0.8 Acres',
        coordinates: { lat: 12.6500, lng: 76.6900 }, // Near Pandavapura rice fields
        radius: 400,
        detectedDate: '2024-03-14',
        cropType: 'Rice'
    }
];

const mapContainerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '600px'
};

const center = {
    lat: 13.8000, // Rural agricultural area in central Karnataka
    lng: 75.8000
};

const mapOptions = {
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: true,
    fullscreenControl: true,
    mapTypeId: 'satellite' as google.maps.MapTypeId,
};

interface FieldMapProps {
    onClose?: () => void;
}

export const FieldMap: React.FC<FieldMapProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const [selectedField, setSelectedField] = useState<Field | null>(null);
    const [selectedDisease, setSelectedDisease] = useState<DiseaseOutbreak | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Healthy': return 'bg-green-500';
            case 'Attention': return 'bg-yellow-500';
            case 'Critical': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getDiseaseColor = (severity: string) => {
        switch (severity) {
            case 'Low': return '#fcd34d'; // yellow-300
            case 'Medium': return '#f97316'; // orange-500
            case 'High': return '#ef4444'; // red-500
            default: return '#9ca3af';
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

    const getMarkerColor = (status: string): string => {
        switch (status) {
            case 'Healthy': return '#22c55e';
            case 'Attention': return '#eab308';
            case 'Critical': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const handleFieldClick = (field: Field) => {
        setSelectedField(field);
        setSelectedDisease(null);
    };

    const handleDiseaseClick = (disease: DiseaseOutbreak) => {
        setSelectedDisease(disease);
        setSelectedField(null);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{t('crop_monitoring.field_mapping.dialog_title')}</h2>
                {onClose && (
                    <Button variant="ghost" onClick={onClose}>
                        <X className="h-6 w-6" />
                    </Button>
                )}
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-[600px]">
                {/* Map Area */}
                <div className="flex-1 rounded-xl overflow-hidden border-2 border-green-100 relative min-h-[600px]">
                    <LoadScript googleMapsApiKey="AIzaSyC_oMgDNR5OXxCtitsFFpUYH8vdeEBo3pk">
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={center}
                            zoom={9}
                            options={mapOptions}>
                            {mockFields.map((field) => (
                                <Marker
                                    key={field.id}
                                    position={field.coordinates}
                                    onClick={() => handleFieldClick(field)}
                                    icon={{
                                        path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                                        scale: 12,
                                        fillColor: getMarkerColor(field.status),
                                        fillOpacity: 1,
                                        strokeColor: '#ffffff',
                                        strokeWeight: 3,
                                    }}
                                />
                            ))}

                            {mockDiseaseOutbreaks.map((outbreak) => (
                                <Circle
                                    key={outbreak.id}
                                    center={outbreak.coordinates}
                                    radius={outbreak.radius}
                                    options={{
                                        fillColor: getDiseaseColor(outbreak.severity),
                                        fillOpacity: 0.3,
                                        strokeColor: getDiseaseColor(outbreak.severity),
                                        strokeOpacity: 0.8,
                                        strokeWeight: 2,
                                        clickable: true,
                                    }}
                                    onClick={() => handleDiseaseClick(outbreak)}
                                />
                            ))}

                            {selectedField && (
                                <InfoWindow
                                    position={selectedField.coordinates}
                                    onCloseClick={() => setSelectedField(null)}>
                                    <div className="p-2">
                                        <h3 className="font-bold text-gray-900">{selectedField.name}</h3>
                                        <p className={`text-sm font-semibold ${getStatusColor(selectedField.status).replace('bg-', 'text-')}`}>
                                            {selectedField.status}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">{selectedField.crop}</p>
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </LoadScript>

                    {/* Map Legend */}
                    <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md text-xs z-10">
                        <h4 className="font-bold mb-2 text-gray-800">Map Legend</h4>
                        <div className="space-y-2">
                            <div>
                                <div className="font-semibold text-gray-600 mb-1">Field Status</div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span>Healthy</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <span>Attention</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <span>Critical</span>
                                </div>
                            </div>
                            <div className="pt-2 border-t">
                                <div className="font-semibold text-gray-600 mb-1">Disease Risk</div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500 opacity-50 border border-red-600"></div>
                                    <span>High Risk</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-orange-500 opacity-50 border border-orange-600"></div>
                                    <span>Medium Risk</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-yellow-300 opacity-50 border border-yellow-400"></div>
                                    <span>Low Risk</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Details */}
                <div className="w-full lg:w-80 bg-gray-50 rounded-xl p-4 border overflow-y-auto">
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
                                    <div className="text-sm text-gray-500 mb-1">Disease Risk</div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${selectedField.diseaseRisk === 'High' ? 'bg-red-500' :
                                            selectedField.diseaseRisk === 'Medium' ? 'bg-orange-500' : 'bg-green-500'
                                            }`} />
                                        <div className="font-semibold">{selectedField.diseaseRisk || 'Low'}</div>
                                    </div>
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
                    ) : selectedDisease ? (
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2 text-red-600">
                                    <AlertTriangle className="h-5 w-5" />
                                    <h4 className="font-bold uppercase tracking-wider text-sm">Disease Outbreak Alert</h4>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{selectedDisease.name}</h3>
                                <Badge className="mt-2" style={{ backgroundColor: getDiseaseColor(selectedDisease.severity) }}>
                                    {selectedDisease.severity} Severity
                                </Badge>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-red-500">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Disease Detected</div>
                                            <div className="font-bold text-red-700">{selectedDisease.disease}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="text-sm text-gray-500 mb-1">Affected Crop</div>
                                    <div className="font-semibold">{selectedDisease.cropType}</div>
                                </div>

                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="text-sm text-gray-500 mb-1">Affected Area</div>
                                    <div className="font-semibold">{selectedDisease.affectedArea}</div>
                                </div>

                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="text-sm text-gray-500 mb-1">Detected On</div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="font-semibold">{selectedDisease.detectedDate}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <Button className="w-full bg-red-600 hover:bg-red-700">View Treatment Plan</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col">
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-center p-4 border-b">
                                <MapPin className="h-12 w-12 mb-3 opacity-20" />
                                <p>{t('crop_monitoring.field_mapping.details.select_prompt')}</p>
                            </div>

                            <div className="p-4 bg-red-50">
                                <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    Active Outbreaks
                                </h4>
                                <div className="space-y-3">
                                    {mockDiseaseOutbreaks.map(outbreak => (
                                        <div
                                            key={outbreak.id}
                                            className="bg-white p-3 rounded-lg shadow-sm border border-red-100 cursor-pointer hover:border-red-300 transition-colors"
                                            onClick={() => handleDiseaseClick(outbreak)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="font-semibold text-gray-800">{outbreak.disease}</div>
                                                <Badge style={{ backgroundColor: getDiseaseColor(outbreak.severity) }} className="text-[10px]">
                                                    {outbreak.severity}
                                                </Badge>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                Near {outbreak.cropType} Fields
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
