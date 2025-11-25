import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Sun,
    Cloud,
    CloudRain,
    CloudSnow,
    CloudDrizzle,
    Wind,
    Droplets,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

interface ForecastData {
    datetime: Date;
    temperature: {
        current: number;
        min: number;
        max: number;
        feelsLike: number;
    };
    humidity: number;
    windSpeed: number;
    windDirection: number;
    condition: string;
    description: string;
    icon: string;
    precipitation: {
        probability: number;
        amount: number;
    };
}

interface WeatherForecastCardProps {
    forecast: ForecastData;
    isDaily?: boolean;
}

export const WeatherForecastCard: React.FC<WeatherForecastCardProps> = ({
    forecast,
    isDaily = true
}) => {
    const [expanded, setExpanded] = useState(false);

    const getWeatherIcon = (condition: string) => {
        const conditionLower = condition.toLowerCase();
        if (conditionLower.includes('rain')) return CloudRain;
        if (conditionLower.includes('drizzle')) return CloudDrizzle;
        if (conditionLower.includes('snow')) return CloudSnow;
        if (conditionLower.includes('cloud')) return Cloud;
        return Sun;
    };

    const getTemperatureColor = (temp: number) => {
        if (temp >= 35) return 'text-red-600';
        if (temp >= 30) return 'text-orange-500';
        if (temp >= 25) return 'text-yellow-600';
        if (temp >= 20) return 'text-green-600';
        if (temp >= 15) return 'text-blue-500';
        return 'text-blue-700';
    };

    const getPrecipitationColor = (probability: number) => {
        if (probability >= 70) return 'bg-blue-600';
        if (probability >= 40) return 'bg-blue-400';
        return 'bg-blue-200';
    };

    const WeatherIcon = getWeatherIcon(forecast.condition);
    const date = new Date(forecast.datetime);
    const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' });
    const dateStr = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    return (
        <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-semibold">
                            {isDaily ? dayName : timeStr}
                        </CardTitle>
                        <p className="text-sm text-gray-500">{isDaily ? dateStr : dayName}</p>
                    </div>
                    <WeatherIcon className={`h-10 w-10 ${getTemperatureColor(forecast.temperature.current)}`} />
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Temperature */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className={`text-3xl font-bold ${getTemperatureColor(forecast.temperature.max)}`}>
                            {Math.round(forecast.temperature.max)}°
                        </span>
                        <span className="text-xl text-gray-400">
                            {Math.round(forecast.temperature.min)}°
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500">Feels like</p>
                        <p className="text-sm font-medium">{Math.round(forecast.temperature.feelsLike)}°C</p>
                    </div>
                </div>

                {/* Condition */}
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700 capitalize">
                        {forecast.description}
                    </p>
                </div>

                {/* Precipitation */}
                {forecast.precipitation.probability > 0 && (
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 flex items-center gap-1">
                                <Droplets className="h-3 w-3" />
                                Precipitation
                            </span>
                            <span className="font-medium">{Math.round(forecast.precipitation.probability)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${getPrecipitationColor(forecast.precipitation.probability)}`}
                                style={{ width: `${forecast.precipitation.probability}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Wind & Humidity */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                    <div className="flex items-center gap-1 text-xs">
                        <Wind className="h-3 w-3 text-gray-500" />
                        <span className="text-gray-600">{Math.round(forecast.windSpeed)} km/h</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                        <Droplets className="h-3 w-3 text-gray-500" />
                        <span className="text-gray-600">{forecast.humidity}%</span>
                    </div>
                </div>

                {/* Expand/Collapse for hourly details */}
                {isDaily && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? (
                            <>
                                <ChevronUp className="h-4 w-4 mr-1" />
                                Less Details
                            </>
                        ) : (
                            <>
                                <ChevronDown className="h-4 w-4 mr-1" />
                                More Details
                            </>
                        )}
                    </Button>
                )}

                {expanded && (
                    <div className="pt-3 space-y-2 border-t">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <p className="text-gray-500">Wind Direction</p>
                                <p className="font-medium">{forecast.windDirection}°</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Rainfall</p>
                                <p className="font-medium">{forecast.precipitation.amount.toFixed(1)} mm</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
