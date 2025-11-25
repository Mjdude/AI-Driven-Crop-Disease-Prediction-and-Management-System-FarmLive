import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    AlertTriangle,
    AlertCircle,
    Info,
    X,
    MapPin,
    Clock
} from 'lucide-react';

interface WeatherAlert {
    id: string;
    title: string;
    description: string;
    severity: 'minor' | 'moderate' | 'severe' | 'extreme';
    urgency: 'immediate' | 'expected' | 'future';
    areas: string[];
    startTime: Date;
    endTime: Date;
    instructions: string[];
}

interface WeatherAlertCardProps {
    alert: WeatherAlert;
    onDismiss?: (id: string) => void;
}

export const WeatherAlertCard: React.FC<WeatherAlertCardProps> = ({
    alert,
    onDismiss
}) => {
    const getSeverityConfig = (severity: string) => {
        switch (severity) {
            case 'extreme':
                return {
                    color: 'bg-red-100 border-red-500 text-red-900',
                    badgeColor: 'bg-red-600 text-white',
                    icon: AlertTriangle,
                    iconColor: 'text-red-600'
                };
            case 'severe':
                return {
                    color: 'bg-orange-100 border-orange-500 text-orange-900',
                    badgeColor: 'bg-orange-600 text-white',
                    icon: AlertTriangle,
                    iconColor: 'text-orange-600'
                };
            case 'moderate':
                return {
                    color: 'bg-yellow-100 border-yellow-500 text-yellow-900',
                    badgeColor: 'bg-yellow-600 text-white',
                    icon: AlertCircle,
                    iconColor: 'text-yellow-600'
                };
            default:
                return {
                    color: 'bg-blue-100 border-blue-500 text-blue-900',
                    badgeColor: 'bg-blue-600 text-white',
                    icon: Info,
                    iconColor: 'text-blue-600'
                };
        }
    };

    const getUrgencyText = (urgency: string) => {
        switch (urgency) {
            case 'immediate':
                return 'Action Required Now';
            case 'expected':
                return 'Expected Soon';
            case 'future':
                return 'Future Alert';
            default:
                return urgency;
        }
    };

    const config = getSeverityConfig(alert.severity);
    const Icon = config.icon;

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleString('en-IN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Card className={`border-l-4 ${config.color}`}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                        <Icon className={`h-6 w-6 mt-1 ${config.iconColor}`} />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-lg font-bold">{alert.title}</CardTitle>
                                <Badge className={config.badgeColor}>
                                    {alert.severity.toUpperCase()}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    {getUrgencyText(alert.urgency)}
                                </Badge>
                            </div>
                            <p className="text-sm font-medium">{alert.description}</p>
                        </div>
                    </div>
                    {onDismiss && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDismiss(alert.id)}
                            className="ml-2"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Affected Areas */}
                <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                    <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">Affected Areas:</p>
                        <div className="flex flex-wrap gap-1">
                            {alert.areas.map((area, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                    {area}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Time Range */}
                <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 text-gray-500" />
                    <div className="text-xs">
                        <p className="font-semibold text-gray-600">Valid Period:</p>
                        <p className="text-gray-700">
                            {formatTime(alert.startTime)} - {formatTime(alert.endTime)}
                        </p>
                    </div>
                </div>

                {/* Instructions */}
                {alert.instructions.length > 0 && (
                    <div className="bg-white/50 rounded-lg p-3 space-y-2">
                        <p className="text-xs font-semibold text-gray-700">Safety Instructions:</p>
                        <ul className="space-y-1">
                            {alert.instructions.map((instruction, index) => (
                                <li key={index} className="text-xs text-gray-700 flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>{instruction}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
