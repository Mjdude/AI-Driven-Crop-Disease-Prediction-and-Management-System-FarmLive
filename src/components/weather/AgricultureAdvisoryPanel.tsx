import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    Droplets,
    Bug,
    Tractor,
    AlertCircle,
    CheckCircle,
    Clock,
    TrendingUp,
    Shield,
    Calendar
} from 'lucide-react';

interface AdvisoryData {
    irrigation: {
        recommendation: string;
        reason: string;
        nextIrrigation: string;
        waterRequirement: string;
    };
    pestDisease: {
        level: string;
        risks: string[];
        preventiveMeasures: string[];
    };
    fieldWork: {
        suitable: string[];
        postpone: string[];
        bestTime: string;
    };
    recommendations: string[];
}

interface AgricultureAdvisoryPanelProps {
    advisory: AdvisoryData;
    cropType?: string;
}

export const AgricultureAdvisoryPanel: React.FC<AgricultureAdvisoryPanelProps> = ({
    advisory,
    cropType
}) => {
    const getRiskLevelConfig = (level: string) => {
        switch (level.toLowerCase()) {
            case 'high':
                return { color: 'bg-red-100 text-red-800 border-red-300', icon: AlertCircle, iconColor: 'text-red-600' };
            case 'medium':
                return { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: AlertCircle, iconColor: 'text-yellow-600' };
            default:
                return { color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle, iconColor: 'text-green-600' };
        }
    };

    const riskConfig = getRiskLevelConfig(advisory.pestDisease.level);
    const RiskIcon = riskConfig.icon;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Agricultural Advisory
                </CardTitle>
                {cropType && (
                    <CardDescription>
                        Recommendations for <span className="font-semibold">{cropType}</span>
                    </CardDescription>
                )}
            </CardHeader>

            <CardContent>
                <Tabs defaultValue="irrigation" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="irrigation" className="flex items-center gap-1">
                            <Droplets className="h-4 w-4" />
                            <span className="hidden sm:inline">Irrigation</span>
                        </TabsTrigger>
                        <TabsTrigger value="pest" className="flex items-center gap-1">
                            <Bug className="h-4 w-4" />
                            <span className="hidden sm:inline">Pest Risk</span>
                        </TabsTrigger>
                        <TabsTrigger value="fieldwork" className="flex items-center gap-1">
                            <Tractor className="h-4 w-4" />
                            <span className="hidden sm:inline">Field Work</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Irrigation Tab */}
                    <TabsContent value="irrigation" className="space-y-4 mt-4">
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <Droplets className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-semibold text-blue-900 mb-1">
                                        Recommendation:
                                        <Badge className="ml-2" variant={advisory.irrigation.recommendation === 'proceed' ? 'default' : 'secondary'}>
                                            {advisory.irrigation.recommendation.toUpperCase()}
                                        </Badge>
                                    </p>
                                    <p className="text-sm text-blue-800">{advisory.irrigation.reason}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="p-3 bg-gray-50 rounded-lg border">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="h-4 w-4 text-gray-600" />
                                        <p className="text-xs font-semibold text-gray-600">Next Irrigation</p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">{advisory.irrigation.nextIrrigation}</p>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-lg border">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Droplets className="h-4 w-4 text-gray-600" />
                                        <p className="text-xs font-semibold text-gray-600">Water Requirement</p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">{advisory.irrigation.waterRequirement}</p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Pest & Disease Tab */}
                    <TabsContent value="pest" className="space-y-4 mt-4">
                        <div className="space-y-3">
                            <div className={`flex items-start gap-3 p-4 rounded-lg border ${riskConfig.color}`}>
                                <RiskIcon className={`h-5 w-5 mt-0.5 ${riskConfig.iconColor}`} />
                                <div className="flex-1">
                                    <p className="font-semibold mb-1">
                                        Risk Level: {advisory.pestDisease.level.toUpperCase()}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Bug className="h-4 w-4 text-orange-600" />
                                        <p className="text-sm font-semibold text-orange-900">Identified Risks</p>
                                    </div>
                                    <ul className="space-y-1">
                                        {advisory.pestDisease.risks.map((risk, index) => (
                                            <li key={index} className="text-sm text-orange-800 flex items-start">
                                                <span className="mr-2">•</span>
                                                <span>{risk}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield className="h-4 w-4 text-green-600" />
                                        <p className="text-sm font-semibold text-green-900">Preventive Measures</p>
                                    </div>
                                    <ul className="space-y-1">
                                        {advisory.pestDisease.preventiveMeasures.map((measure, index) => (
                                            <li key={index} className="text-sm text-green-800 flex items-start">
                                                <CheckCircle className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
                                                <span>{measure}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Field Work Tab */}
                    <TabsContent value="fieldwork" className="space-y-4 mt-4">
                        <div className="space-y-3">
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <p className="font-semibold text-green-900">Suitable Activities</p>
                                </div>
                                <ul className="space-y-2">
                                    {advisory.fieldWork.suitable.map((activity, index) => (
                                        <li key={index} className="text-sm text-green-800 flex items-center gap-2">
                                            <div className="h-2 w-2 bg-green-600 rounded-full" />
                                            {activity}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                    <p className="font-semibold text-red-900">Activities to Postpone</p>
                                </div>
                                <ul className="space-y-2">
                                    {advisory.fieldWork.postpone.map((activity, index) => (
                                        <li key={index} className="text-sm text-red-800 flex items-center gap-2">
                                            <div className="h-2 w-2 bg-red-600 rounded-full" />
                                            {activity}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                    <p className="text-sm">
                                        <span className="font-semibold text-blue-900">Best Time: </span>
                                        <span className="text-blue-800">{advisory.fieldWork.bestTime}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* General Recommendations */}
                {advisory.recommendations.length > 0 && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                        <p className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            General Recommendations
                        </p>
                        <ul className="space-y-2">
                            {advisory.recommendations.map((rec, index) => (
                                <li key={index} className="text-sm text-gray-700 flex items-start">
                                    <span className="text-green-600 mr-2">✓</span>
                                    <span>{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
