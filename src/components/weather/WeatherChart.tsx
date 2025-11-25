import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { TrendingUp, Droplets, Wind } from 'lucide-react';

interface ChartData {
    name: string;
    temperature?: number;
    precipitation?: number;
    humidity?: number;
    windSpeed?: number;
    precipitationProb?: number;
}

interface WeatherChartProps {
    data: ChartData[];
    type: 'temperature' | 'precipitation' | 'humidity' | 'wind';
    title: string;
}

export const WeatherChart: React.FC<WeatherChartProps> = ({ data, type, title }) => {
    const getIcon = () => {
        switch (type) {
            case 'temperature':
                return <TrendingUp className="h-5 w-5 text-orange-600" />;
            case 'precipitation':
                return <Droplets className="h-5 w-5 text-blue-600" />;
            case 'humidity':
                return <Droplets className="h-5 w-5 text-cyan-600" />;
            case 'wind':
                return <Wind className="h-5 w-5 text-gray-600" />;
            default:
                return null;
        }
    };

    const renderChart = () => {
        switch (type) {
            case 'temperature':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12 }}
                                stroke="#666"
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                stroke="#666"
                                label={{ value: '°C', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="temperature"
                                stroke="#f97316"
                                strokeWidth={3}
                                dot={{ fill: '#f97316', r: 4 }}
                                activeDot={{ r: 6 }}
                                name="Temperature (°C)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'precipitation':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12 }}
                                stroke="#666"
                            />
                            <YAxis
                                yAxisId="left"
                                tick={{ fontSize: 12 }}
                                stroke="#666"
                                label={{ value: 'mm', angle: -90, position: 'insideLeft' }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tick={{ fontSize: 12 }}
                                stroke="#666"
                                label={{ value: '%', angle: 90, position: 'insideRight' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend />
                            <Bar
                                yAxisId="left"
                                dataKey="precipitation"
                                fill="#3b82f6"
                                name="Rainfall (mm)"
                                radius={[8, 8, 0, 0]}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="precipitationProb"
                                stroke="#0ea5e9"
                                strokeWidth={2}
                                dot={{ fill: '#0ea5e9', r: 3 }}
                                name="Probability (%)"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                );

            case 'humidity':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12 }}
                                stroke="#666"
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                stroke="#666"
                                label={{ value: '%', angle: -90, position: 'insideLeft' }}
                                domain={[0, 100]}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="humidity"
                                stroke="#06b6d4"
                                fill="#06b6d4"
                                fillOpacity={0.3}
                                strokeWidth={2}
                                name="Humidity (%)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                );

            case 'wind':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12 }}
                                stroke="#666"
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                stroke="#666"
                                label={{ value: 'km/h', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="windSpeed"
                                stroke="#6b7280"
                                strokeWidth={2}
                                dot={{ fill: '#6b7280', r: 4 }}
                                name="Wind Speed (km/h)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );

            default:
                return null;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    {getIcon()}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {renderChart()}
            </CardContent>
        </Card>
    );
};
