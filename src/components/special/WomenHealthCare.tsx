import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Heart,
    Activity,
    AlertCircle,
    CheckCircle,
    TrendingUp,
    Video,
    Stethoscope,
    Apple,
    Droplet,
    Sun,
    Moon,
    Utensils
} from 'lucide-react';
import { toast } from 'sonner';

import { HealthBookingDialog } from './HealthBookingDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface YouTubeVideo {
    id: { videoId: string };
    snippet: {
        title: string;
        description: string;
        thumbnails: { medium: { url: string } };
    };
}

interface HealthData {
    age: number;
    weight: number;
    height: number;
    bloodPressure: string;
    lastCheckup: string;
    chronicConditions: string[];
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
    sleepHours: number;
    waterIntake: number;
}

interface HealthAssessment {
    bmi: number;
    bmiCategory: string;
    healthScore: number;
    riskLevel: 'low' | 'moderate' | 'high';
    suggestions: string[];
}

interface HealthVideo {
    id: string;
    title: string;
    description: string;
    duration: string;
    category: string;
    thumbnail: string;
    videoUrl: string;
}

const healthVideos: HealthVideo[] = [
    {
        id: '1',
        title: 'Nutrition for Women Farmers',
        description: 'Essential nutrients and balanced diet tips for women working in agriculture',
        duration: '12:30',
        category: 'Nutrition',
        thumbnail: '🥗',
        videoUrl: 'https://example.com/nutrition'
    },
    {
        id: '2',
        title: 'Preventing Back Pain in Farm Work',
        description: 'Proper posture and exercises to prevent back pain during farming activities',
        duration: '8:45',
        category: 'Physical Health',
        thumbnail: '🧘‍♀️',
        videoUrl: 'https://example.com/backpain'
    },
    {
        id: '3',
        title: 'Managing Stress and Mental Health',
        description: 'Techniques to manage stress and maintain mental well-being',
        duration: '15:20',
        category: 'Mental Health',
        thumbnail: '🧠',
        videoUrl: 'https://example.com/mental-health'
    },
    {
        id: '4',
        title: 'Sun Protection and Skin Care',
        description: 'Protecting your skin from sun damage while working outdoors',
        duration: '10:15',
        category: 'Skin Care',
        thumbnail: '☀️',
        videoUrl: 'https://example.com/skincare'
    },
    {
        id: '5',
        title: 'Reproductive Health Awareness',
        description: 'Important information about reproductive health for women farmers',
        duration: '18:00',
        category: 'Reproductive Health',
        thumbnail: '💗',
        videoUrl: 'https://example.com/reproductive'
    },
    {
        id: '6',
        title: 'Hydration and Heat Management',
        description: 'Staying hydrated and managing heat exposure during farm work',
        duration: '9:30',
        category: 'Physical Health',
        thumbnail: '💧',
        videoUrl: 'https://example.com/hydration'
    }
];

export const WomenHealthCare: React.FC = () => {
    const { t } = useTranslation();
    const [healthData, setHealthData] = useState<HealthData>({
        age: 0,
        weight: 0,
        height: 0,
        bloodPressure: '',
        lastCheckup: '',
        chronicConditions: [],
        activityLevel: 'moderate',
        sleepHours: 7,
        waterIntake: 2
    });

    const [assessment, setAssessment] = useState<HealthAssessment | null>(null);
    const [showAssessment, setShowAssessment] = useState(false);
    const [showBooking, setShowBooking] = useState(false);
    const [videoSuggestions, setVideoSuggestions] = useState<YouTubeVideo[]>([]);
    const [showVideoDialog, setShowVideoDialog] = useState(false);
    const [loadingVideos, setLoadingVideos] = useState(false);

    const fetchVideos = async (query: string) => {
        setLoadingVideos(true);
        setShowVideoDialog(true);
        try {
            const API_KEY = 'AIzaSyDpeCQD6jixnn5cblRdwdmH3GVvNtpM7v8';
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${encodeURIComponent(query)}&key=${API_KEY}&type=video`);
            const data = await response.json();
            if (data.items) {
                setVideoSuggestions(data.items);
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
            toast.error(t('she_farms.health.messages.fetch_error'));
        } finally {
            setLoadingVideos(false);
        }
    };

    const calculateBMI = (weight: number, height: number): number => {
        if (weight <= 0 || height <= 0) return 0;
        const heightInMeters = height / 100;
        return weight / (heightInMeters * heightInMeters);
    };

    const getBMICategory = (bmi: number): string => {
        if (bmi < 18.5) return 'underweight';
        if (bmi < 25) return 'normal';
        if (bmi < 30) return 'overweight';
        return 'obese';
    };

    const calculateHealthScore = (data: HealthData, bmi: number): number => {
        let score = 100;

        // BMI impact
        if (bmi < 18.5 || bmi >= 30) score -= 20;
        else if (bmi >= 25) score -= 10;

        // Age factor
        if (data.age > 50) score -= 5;

        // Activity level
        if (data.activityLevel === 'sedentary') score -= 15;
        else if (data.activityLevel === 'light') score -= 5;
        else if (data.activityLevel === 'active') score += 5;

        // Sleep
        if (data.sleepHours < 6 || data.sleepHours > 9) score -= 10;

        // Water intake
        if (data.waterIntake < 2) score -= 10;

        // Chronic conditions
        score -= data.chronicConditions.length * 10;

        return Math.max(0, Math.min(100, score));
    };

    const getRiskLevel = (score: number): 'low' | 'moderate' | 'high' => {
        if (score >= 80) return 'low';
        if (score >= 60) return 'moderate';
        return 'high';
    };

    const generateSuggestions = (data: HealthData, bmi: number, score: number): string[] => {
        const suggestions: string[] = [];

        // BMI-based suggestions
        if (bmi < 18.5) {
            suggestions.push('she_farms.health.assessment.dynamic_suggestions.underweight.1');
            suggestions.push('she_farms.health.assessment.dynamic_suggestions.underweight.2');
        } else if (bmi >= 25 && bmi < 30) {
            suggestions.push('she_farms.health.assessment.dynamic_suggestions.overweight.1');
            suggestions.push('she_farms.health.assessment.dynamic_suggestions.overweight.2');
        } else if (bmi >= 30) {
            suggestions.push('she_farms.health.assessment.dynamic_suggestions.obese.1');
            suggestions.push('she_farms.health.assessment.dynamic_suggestions.obese.2');
        }

        // Activity level suggestions
        if (data.activityLevel === 'sedentary') {
            suggestions.push('she_farms.health.assessment.dynamic_suggestions.sedentary.1');
            suggestions.push('she_farms.health.assessment.dynamic_suggestions.sedentary.2');
        }

        // Sleep suggestions
        if (data.sleepHours < 6) {
            suggestions.push('she_farms.health.assessment.dynamic_suggestions.sleep_low.1');
            suggestions.push('she_farms.health.assessment.dynamic_suggestions.sleep_low.2');
        } else if (data.sleepHours > 9) {
            suggestions.push('she_farms.health.assessment.dynamic_suggestions.sleep_high.1');
        }

        // Water intake suggestions
        if (data.waterIntake < 2) {
            suggestions.push('she_farms.health.assessment.dynamic_suggestions.water_low.1');
            suggestions.push('she_farms.health.assessment.dynamic_suggestions.water_low.2');
        }

        // Age-specific suggestions
        if (data.age > 40) {
            suggestions.push('she_farms.health.assessment.dynamic_suggestions.age_40.1');
            suggestions.push('she_farms.health.assessment.dynamic_suggestions.age_40.2');
        }

        // General suggestions
        suggestions.push('she_farms.health.assessment.dynamic_suggestions.general.1');
        suggestions.push('she_farms.health.assessment.dynamic_suggestions.general.2');
        suggestions.push('she_farms.health.assessment.dynamic_suggestions.general.3');
        suggestions.push('she_farms.health.assessment.dynamic_suggestions.general.4');

        return suggestions;
    };

    const handleAssessment = () => {
        if (healthData.age <= 0 || healthData.weight <= 0 || healthData.height <= 0) {
            toast.error(t('she_farms.health.messages.fill_required'));
            return;
        }

        const bmi = calculateBMI(healthData.weight, healthData.height);
        const bmiCategory = getBMICategory(bmi);
        const healthScore = calculateHealthScore(healthData, bmi);
        const riskLevel = getRiskLevel(healthScore);
        const suggestions = generateSuggestions(healthData, bmi, healthScore);

        setAssessment({
            bmi: parseFloat(bmi.toFixed(1)),
            bmiCategory,
            healthScore,
            riskLevel,
            suggestions
        });

        setShowAssessment(true);
        toast.success(t('she_farms.health.messages.assessment_complete'));
    };

    const handleInputChange = (field: keyof HealthData, value: any) => {
        setHealthData(prev => ({ ...prev, [field]: value }));
        setShowAssessment(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-8 text-white">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Heart className="h-8 w-8" />
                            <h1 className="text-3xl font-bold font-poppins">{t('she_farms.health.title')}</h1>
                        </div>
                        <p className="text-pink-100 text-lg">{t('she_farms.health.subtitle')}</p>
                    </div>
                    <Button
                        variant="secondary"
                        className="bg-white text-pink-600 hover:bg-pink-50"
                        onClick={() => setShowBooking(true)}
                    >
                        <Stethoscope className="h-4 w-4 mr-2" />
                        {t('she_farms.health.book_appointment')}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="assessment" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="assessment">{t('she_farms.health.tabs.assessment')}</TabsTrigger>
                    <TabsTrigger value="videos">{t('she_farms.health.tabs.videos')}</TabsTrigger>
                </TabsList>

                {/* Health Assessment Tab */}
                <TabsContent value="assessment" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Stethoscope className="h-5 w-5 text-pink-500" />
                                {t('she_farms.health.assessment.title')}
                            </CardTitle>
                            <CardDescription>
                                {t('she_farms.health.assessment.description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Basic Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="age">{t('she_farms.health.assessment.labels.age')}</Label>
                                    <Input
                                        id="age"
                                        type="number"
                                        value={healthData.age || ''}
                                        onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                                        placeholder={t('she_farms.health.assessment.placeholders.age')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="weight">{t('she_farms.health.assessment.labels.weight')}</Label>
                                    <Input
                                        id="weight"
                                        type="number"
                                        step="0.1"
                                        value={healthData.weight || ''}
                                        onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                                        placeholder={t('she_farms.health.assessment.placeholders.weight')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="height">{t('she_farms.health.assessment.labels.height')}</Label>
                                    <Input
                                        id="height"
                                        type="number"
                                        value={healthData.height || ''}
                                        onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || 0)}
                                        placeholder={t('she_farms.health.assessment.placeholders.height')}
                                    />
                                </div>
                            </div>

                            {/* Lifestyle Factors */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="activityLevel">{t('she_farms.health.assessment.labels.activity_level')}</Label>
                                    <select
                                        id="activityLevel"
                                        value={healthData.activityLevel}
                                        onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md"
                                    >
                                        <option value="sedentary">{t('she_farms.health.assessment.activity_levels.sedentary')}</option>
                                        <option value="light">{t('she_farms.health.assessment.activity_levels.light')}</option>
                                        <option value="moderate">{t('she_farms.health.assessment.activity_levels.moderate')}</option>
                                        <option value="active">{t('she_farms.health.assessment.activity_levels.active')}</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bloodPressure">{t('she_farms.health.assessment.labels.bp')}</Label>
                                    <Input
                                        id="bloodPressure"
                                        value={healthData.bloodPressure}
                                        onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                                        placeholder={t('she_farms.health.assessment.placeholders.bp')}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sleepHours" className="flex items-center gap-2">
                                        <Moon className="h-4 w-4" />
                                        {t('she_farms.health.assessment.labels.sleep')}
                                    </Label>
                                    <Input
                                        id="sleepHours"
                                        type="number"
                                        value={healthData.sleepHours || ''}
                                        onChange={(e) => handleInputChange('sleepHours', parseInt(e.target.value) || 0)}
                                        placeholder={t('she_farms.health.assessment.placeholders.sleep')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="waterIntake" className="flex items-center gap-2">
                                        <Droplet className="h-4 w-4" />
                                        {t('she_farms.health.assessment.labels.water')}
                                    </Label>
                                    <Input
                                        id="waterIntake"
                                        type="number"
                                        step="0.5"
                                        value={healthData.waterIntake || ''}
                                        onChange={(e) => handleInputChange('waterIntake', parseFloat(e.target.value) || 0)}
                                        placeholder={t('she_farms.health.assessment.placeholders.water')}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastCheckup">{t('she_farms.health.assessment.labels.last_checkup')}</Label>
                                <Input
                                    id="lastCheckup"
                                    type="date"
                                    value={healthData.lastCheckup}
                                    onChange={(e) => handleInputChange('lastCheckup', e.target.value)}
                                />
                            </div>

                            <Button
                                onClick={handleAssessment}
                                className="w-full bg-pink-500 hover:bg-pink-600"
                                size="lg"
                            >
                                <Activity className="h-5 w-5 mr-2" />
                                {t('she_farms.health.assessment.button')}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Assessment Results */}
                    {showAssessment && assessment && (
                        <div className="space-y-6">
                            {/* Health Score Card */}
                            <Card className="border-2 border-pink-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-pink-500" />
                                        {t('she_farms.health.assessment.results.title')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* BMI */}
                                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                                            <div className="text-3xl font-bold text-blue-600">{assessment.bmi}</div>
                                            <div className="text-sm text-gray-600 mt-1">{t('she_farms.health.assessment.results.bmi')}</div>
                                            <Badge className="mt-2" variant={
                                                assessment.bmiCategory === 'normal' ? 'default' : 'secondary'
                                            }>
                                                {t(`she_farms.health.assessment.bmi_categories.${assessment.bmiCategory}`)}
                                            </Badge>
                                        </div>

                                        {/* Health Score */}
                                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                                            <div className="text-3xl font-bold text-green-600">{assessment.healthScore}</div>
                                            <div className="text-sm text-gray-600 mt-1">{t('she_farms.health.assessment.results.score')}</div>
                                            <Progress value={assessment.healthScore} className="mt-2" />
                                        </div>

                                        {/* Risk Level */}
                                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                                            <div className={`text-3xl font-bold ${assessment.riskLevel === 'low' ? 'text-green-600' :
                                                assessment.riskLevel === 'moderate' ? 'text-yellow-600' : 'text-red-600'
                                                }`}>
                                                {t(`she_farms.health.assessment.risk_levels.${assessment.riskLevel}`)}
                                            </div>
                                            <div className="text-sm text-gray-600 mt-1">{t('she_farms.health.assessment.results.risk_level')}</div>
                                            {assessment.riskLevel === 'low' && <CheckCircle className="h-6 w-6 text-green-600 mx-auto mt-2" />}
                                            {assessment.riskLevel !== 'low' && <AlertCircle className="h-6 w-6 text-yellow-600 mx-auto mt-2" />}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Health Suggestions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Apple className="h-5 w-5 text-pink-500" />
                                        {t('she_farms.health.assessment.suggestions.title')}
                                    </CardTitle>
                                    <CardDescription>
                                        {t('she_farms.health.assessment.suggestions.description')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {assessment.suggestions.map((suggestion, index) => (
                                            <div key={index} className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg">
                                                <CheckCircle className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
                                                <p className="text-sm text-gray-700">{t(suggestion)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Common Health Issues */}
                            <Card className="bg-gradient-to-br from-orange-50 to-pink-50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-orange-500" />
                                        {t('she_farms.health.assessment.common_issues.title')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-white rounded-lg">
                                            <h4 className="font-semibold text-gray-800 mb-2">{t('she_farms.health.assessment.common_issues.musculoskeletal.title')}</h4>
                                            <p className="text-sm text-gray-600">{t('she_farms.health.assessment.common_issues.musculoskeletal.desc')}</p>
                                        </div>
                                        <div className="p-4 bg-white rounded-lg">
                                            <h4 className="font-semibold text-gray-800 mb-2">{t('she_farms.health.assessment.common_issues.skin.title')}</h4>
                                            <p className="text-sm text-gray-600">{t('she_farms.health.assessment.common_issues.skin.desc')}</p>
                                        </div>
                                        <div className="p-4 bg-white rounded-lg">
                                            <h4 className="font-semibold text-gray-800 mb-2">{t('she_farms.health.assessment.common_issues.respiratory.title')}</h4>
                                            <p className="text-sm text-gray-600">{t('she_farms.health.assessment.common_issues.respiratory.desc')}</p>
                                        </div>
                                        <div className="p-4 bg-white rounded-lg">
                                            <h4 className="font-semibold text-gray-800 mb-2">{t('she_farms.health.assessment.common_issues.reproductive.title')}</h4>
                                            <p className="text-sm text-gray-600">{t('she_farms.health.assessment.common_issues.reproductive.desc')}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </TabsContent>

                {/* Health Videos Tab */}
                <TabsContent value="videos" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Video className="h-5 w-5 text-pink-500" />
                                {t('she_farms.health.videos.title')}
                            </CardTitle>
                            <CardDescription>
                                {t('she_farms.health.videos.description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {healthVideos.map((video) => (
                                    <Card key={video.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                                        <CardHeader>
                                            <div className="text-6xl text-center mb-4">{video.thumbnail}</div>
                                            <CardTitle className="text-lg">{t(`she_farms.health.videos.list.${video.id}.title`)}</CardTitle>
                                            <CardDescription className="line-clamp-2">{t(`she_farms.health.videos.list.${video.id}.desc`)}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center justify-between">
                                                <Badge variant="outline">{video.category}</Badge>
                                                <span className="text-sm text-gray-500">{video.duration}</span>
                                            </div>
                                            <Button
                                                className="w-full mt-4 bg-pink-500 hover:bg-pink-600"
                                                onClick={() => fetchVideos(t(`she_farms.health.videos.list.${video.id}.title`))}
                                            >
                                                <Video className="h-4 w-4 mr-2" />
                                                {t('she_farms.health.videos.watch')}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Health Tips */}
                    <Card className="bg-gradient-to-r from-pink-50 to-purple-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sun className="h-5 w-5 text-yellow-500" />
                                {t('she_farms.health.videos.tips.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <Utensils className="h-5 w-5 text-pink-500 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{t('she_farms.health.videos.tips.balanced_meals.title')}</h4>
                                        <p className="text-sm text-gray-600">{t('she_farms.health.videos.tips.balanced_meals.desc')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Droplet className="h-5 w-5 text-blue-500 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{t('she_farms.health.videos.tips.hydration.title')}</h4>
                                        <p className="text-sm text-gray-600">{t('she_farms.health.videos.tips.hydration.desc')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Activity className="h-5 w-5 text-green-500 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{t('she_farms.health.videos.tips.exercise.title')}</h4>
                                        <p className="text-sm text-gray-600">{t('she_farms.health.videos.tips.exercise.desc')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Moon className="h-5 w-5 text-purple-500 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{t('she_farms.health.videos.tips.sleep.title')}</h4>
                                        <p className="text-sm text-gray-600">{t('she_farms.health.videos.tips.sleep.desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            <HealthBookingDialog
                open={showBooking}
                onOpenChange={setShowBooking}
            />

            <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{t('she_farms.health.videos.recommended.title')}</DialogTitle>
                        <DialogDescription>
                            {t('she_farms.health.videos.recommended.description')}
                        </DialogDescription>
                    </DialogHeader>

                    {loadingVideos ? (
                        <div className="flex justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {videoSuggestions.map((video) => (
                                <Card key={video.id.videoId} className="overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="aspect-video relative">
                                        <img
                                            src={video.snippet.thumbnails.medium.url}
                                            alt={video.snippet.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <a
                                            href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity group"
                                        >
                                            <div className="bg-white/90 rounded-full p-3">
                                                <Video className="h-6 w-6 text-red-600" />
                                            </div>
                                        </a>
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold text-sm line-clamp-2 mb-2" title={video.snippet.title}>
                                            {video.snippet.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 line-clamp-2">
                                            {video.snippet.description}
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full mt-3"
                                            onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id.videoId}`, '_blank')}
                                        >
                                            {t('she_farms.health.videos.watch_youtube')}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
