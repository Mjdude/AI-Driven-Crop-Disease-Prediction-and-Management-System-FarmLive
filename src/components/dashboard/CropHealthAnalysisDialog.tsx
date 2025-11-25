import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Droplets, Bug, Leaf } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CropHealthAnalysisDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cropId?: string;
}

export const CropHealthAnalysisDialog: React.FC<CropHealthAnalysisDialogProps> = ({
    open,
    onOpenChange,
    cropId
}) => {
    // Mock historical health data
    const healthHistory = [
        { date: 'Nov 1', score: 85, diseases: 0, pests: 1 },
        { date: 'Nov 5', score: 82, diseases: 1, pests: 1 },
        { date: 'Nov 10', score: 78, diseases: 1, pests: 2 },
        { date: 'Nov 15', score: 88, diseases: 0, pests: 1 },
        { date: 'Nov 20', score: 92, diseases: 0, pests: 0 },
        { date: 'Nov 22', score: 90, diseases: 0, pests: 0 }
    ];

    const environmentalData = [
        { factor: 'Temperature', value: 28, unit: '°C', status: 'optimal', icon: TrendingUp },
        { factor: 'Humidity', value: 65, unit: '%', status: 'optimal', icon: Droplets },
        { factor: 'Soil Moisture', value: 72, unit: '%', status: 'good', icon: Droplets },
        { factor: 'Sunlight', value: 8, unit: 'hrs/day', status: 'optimal', icon: Leaf }
    ];

    const detectedIssues = [
        {
            id: 1,
            type: 'Minor Nutrient Deficiency',
            severity: 'low',
            affected: '5%',
            treatment: 'Apply nitrogen-rich fertilizer',
            status: 'monitoring'
        }
    ];

    const recommendations = [
        'Continue current irrigation schedule',
        'Monitor for pest activity in next 3 days',
        'Apply organic fertilizer next week',
        'Maintain current pest control measures'
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detailed Crop Health Analysis</DialogTitle>
                    <DialogDescription>
                        Comprehensive health metrics and historical trends
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                        <TabsTrigger value="environment">Environment</TabsTrigger>
                        <TabsTrigger value="recommendations">Actions</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="border rounded-lg p-4 bg-green-50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Overall Health</span>
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <div className="text-3xl font-bold text-green-600">90%</div>
                                <div className="text-xs text-gray-600 mt-1">Excellent condition</div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Diseases</span>
                                    <Bug className="h-5 w-5 text-gray-400" />
                                </div>
                                <div className="text-3xl font-bold">0</div>
                                <div className="text-xs text-gray-600 mt-1">No active diseases</div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Pests</span>
                                    <Bug className="h-5 w-5 text-gray-400" />
                                </div>
                                <div className="text-3xl font-bold">0</div>
                                <div className="text-xs text-gray-600 mt-1">No pest activity</div>
                            </div>
                        </div>

                        {/* Current Issues */}
                        <div className="space-y-3">
                            <h4 className="font-semibold">Current Issues</h4>
                            {detectedIssues.length > 0 ? (
                                detectedIssues.map((issue) => (
                                    <div key={issue.id} className="border rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <h5 className="font-medium">{issue.type}</h5>
                                            <Badge variant="outline" className="bg-blue-50 text-blue-800">
                                                {issue.severity.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            <div>
                                                <span className="text-gray-600">Affected: </span>
                                                <span className="font-medium">{issue.affected}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Treatment: </span>
                                                <span className="font-medium">{issue.treatment}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Status: </span>
                                                <Badge variant="outline">{issue.status}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                                    <p>No issues detected. Crop is healthy!</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="space-y-4">
                        <div className="space-y-4">
                            <h4 className="font-semibold">Health Score Trend</h4>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={healthHistory}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="score" stroke="#10b981" name="Health Score" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-semibold">Issues Over Time</h4>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={healthHistory}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="diseases" fill="#ef4444" name="Diseases" />
                                    <Bar dataKey="pests" fill="#f59e0b" name="Pests" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </TabsContent>

                    {/* Environment Tab */}
                    <TabsContent value="environment" className="space-y-4">
                        <h4 className="font-semibold">Environmental Factors</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {environmentalData.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <div key={index} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-600">{item.factor}</span>
                                            <Icon className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="text-2xl font-bold">
                                            {item.value} <span className="text-sm font-normal text-gray-600">{item.unit}</span>
                                        </div>
                                        <Badge variant="outline" className="mt-2 bg-green-50 text-green-800">
                                            {item.status}
                                        </Badge>
                                    </div>
                                );
                            })}
                        </div>
                    </TabsContent>

                    {/* Recommendations Tab */}
                    <TabsContent value="recommendations" className="space-y-4">
                        <h4 className="font-semibold">Recommended Actions</h4>
                        <div className="space-y-2">
                            {recommendations.map((rec, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                    <span>{rec}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                            <h5 className="font-semibold text-blue-900 mb-2">Next Health Check</h5>
                            <p className="text-sm text-blue-800">
                                Recommended in 5 days (Nov 27, 2024) or sooner if you notice any changes in crop appearance.
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                    <Button onClick={() => {
                        // Export report logic
                        const report = { healthHistory, environmentalData, detectedIssues, recommendations };
                        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `crop-health-report-${Date.now()}.json`;
                        a.click();
                    }}>
                        Export Report
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
