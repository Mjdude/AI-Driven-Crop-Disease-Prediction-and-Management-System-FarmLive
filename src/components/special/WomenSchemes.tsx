import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, FileText, DollarSign, Users, Zap, AlertCircle, Heart, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { TrainingEnrollmentDialog } from './TrainingEnrollmentDialog';

interface WomenScheme {
    id: string;
    name: string;
    description: string;
    eligibility: string[];
    benefits: string;
    applicationDeadline: string;
    category: string;
    matchScore: number;
    status: 'eligible' | 'partially-eligible' | 'not-eligible';
    documents: string[];
    applicationUrl?: string;
}

interface WomenFarmerProfile {
    name: string;
    location: string;
    farmSize: number;
    cropTypes: string[];
    farmingExperience: number;
    annualIncome: number;
    landOwnership: 'owned' | 'leased' | 'both';
    category: 'small' | 'marginal' | 'medium' | 'large';
    hasKCC: boolean;
    bankAccount: boolean;
    age: number;
    education: string;
    maritalStatus: string;
}

export const WomenSchemes: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const mockWomenSchemes: WomenScheme[] = [
        {
            id: '1',
            name: t('she_farms.schemes.1.name'),
            description: t('she_farms.schemes.1.description'),
            eligibility: ['Women farmers', 'Age 18-60 years', 'Valid Aadhaar card', 'Land ownership or lease agreement'],
            benefits: t('she_farms.schemes.1.benefits'),
            applicationDeadline: '2024-12-31',
            category: 'Empowerment',
            matchScore: 95,
            status: 'eligible',
            documents: ['Aadhaar Card', 'Bank Account Details', 'Land Records', 'Age Proof', 'Photograph'],
            applicationUrl: 'https://nrlm.gov.in/'
        },
        {
            id: '2',
            name: t('she_farms.schemes.2.name'),
            description: t('she_farms.schemes.2.description'),
            eligibility: ['Women land owners', 'Small & Marginal farmers', 'Valid bank account'],
            benefits: t('she_farms.schemes.2.benefits'),
            applicationDeadline: 'Ongoing',
            category: 'Income Support',
            matchScore: 92,
            status: 'eligible',
            documents: ['Aadhaar Card', 'Bank Account', 'Land Records', 'Mobile Number'],
            applicationUrl: 'https://pmkisan.gov.in/'
        },
        {
            id: '3',
            name: t('she_farms.schemes.3.name'),
            description: t('she_farms.schemes.3.description'),
            eligibility: ['Women SHG members', 'Rural areas', 'Group formation certificate'],
            benefits: t('she_farms.schemes.3.benefits'),
            applicationDeadline: 'Ongoing',
            category: 'Group Support',
            matchScore: 88,
            status: 'eligible',
            documents: ['SHG Certificate', 'Member List', 'Bank Account', 'Project Proposal'],
            applicationUrl: 'https://nrlm.gov.in/'
        },
        {
            id: '4',
            name: t('she_farms.schemes.4.name'),
            description: t('she_farms.schemes.4.description'),
            eligibility: ['Women entrepreneurs', 'Age 21-55 years', 'Business plan', 'Basic education'],
            benefits: t('she_farms.schemes.4.benefits'),
            applicationDeadline: '2024-12-15',
            category: 'Entrepreneurship',
            matchScore: 85,
            status: 'eligible',
            documents: ['Aadhaar Card', 'PAN Card', 'Business Plan', 'Educational Certificate', 'Bank Account'],
            applicationUrl: 'https://www.startupindia.gov.in'
        },
        {
            id: '5',
            name: t('she_farms.schemes.5.name'),
            description: t('she_farms.schemes.5.description'),
            eligibility: ['Women farmers', 'Commitment to organic farming', 'Minimum 1 acre land'],
            benefits: t('she_farms.schemes.5.benefits'),
            applicationDeadline: '2024-11-25',
            category: 'Organic Farming',
            matchScore: 80,
            status: 'partially-eligible',
            documents: ['Land Records', 'Aadhaar Card', 'Organic Farming Commitment Letter', 'Bank Account'],
            applicationUrl: 'https://pgsindia-ncof.gov.in'
        },
        {
            id: '6',
            name: t('she_farms.schemes.6.name'),
            description: t('she_farms.schemes.6.description'),
            eligibility: ['Women farmers', 'Interest in dairy farming', 'Space for cattle'],
            benefits: t('she_farms.schemes.6.benefits'),
            applicationDeadline: 'Ongoing',
            category: 'Livestock',
            matchScore: 78,
            status: 'eligible',
            documents: ['Aadhaar Card', 'Bank Account', 'Veterinary Certificate', 'Space Proof'],
            applicationUrl: 'https://dahd.nic.in'
        }
    ];

    const [schemes, setSchemes] = useState<WomenScheme[]>(mockWomenSchemes);
    const [selectedScheme, setSelectedScheme] = useState<WomenScheme | null>(null);
    const [farmerProfile, setFarmerProfile] = useState<WomenFarmerProfile>({
        name: '',
        location: '',
        farmSize: 0,
        cropTypes: [],
        farmingExperience: 0,
        annualIncome: 0,
        landOwnership: 'owned',
        category: 'small',
        hasKCC: false,
        bankAccount: true,
        age: 0,
        education: '',
        maritalStatus: ''
    });
    const [profileComplete, setProfileComplete] = useState(false);
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [showTraining, setShowTraining] = useState(false);

    useEffect(() => {
        // Check if profile is complete
        const isComplete = farmerProfile.name && farmerProfile.location && farmerProfile.farmSize > 0;
        setProfileComplete(isComplete);

        if (isComplete) {
            // Recalculate match scores based on profile
            const updatedSchemes = schemes.map(scheme => ({
                ...scheme,
                matchScore: calculateMatchScore(scheme, farmerProfile)
            })).sort((a, b) => b.matchScore - a.matchScore);
            setSchemes(updatedSchemes);
        }
    }, [farmerProfile]);

    const calculateMatchScore = (scheme: WomenScheme, profile: WomenFarmerProfile): number => {
        let score = 70; // Base score

        // Farm size matching
        if (scheme.eligibility.some(e => e.includes('Small & Marginal')) && profile.category === 'small') {
            score += 15;
        }

        // Income matching
        if (profile.annualIncome < 200000 && scheme.category === 'Income Support') {
            score += 10;
        }

        // Experience matching
        if (profile.farmingExperience > 3 && scheme.category === 'Empowerment') {
            score += 10;
        }

        // Age matching
        if (profile.age >= 18 && profile.age <= 60) {
            score += 5;
        }

        return Math.min(score, 100);
    };

    const handleEasyApply = (scheme: WomenScheme) => {
        if (!profileComplete) {
            toast.error('Please complete your farmer profile first');
            return;
        }

        // Navigate to application page with scheme data
        navigate('/women-scheme-application', { state: { scheme, farmerProfile } });
    };

    const filteredSchemes = filterCategory === 'all'
        ? schemes
        : schemes.filter(scheme => scheme.category === filterCategory);

    const categories = ['all', ...Array.from(new Set(schemes.map(s => s.category)))];

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-pink-500 to-pink-400 rounded-2xl p-8 text-white">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Heart className="h-8 w-8" />
                            <h1 className="text-3xl font-bold font-poppins">{t('she_farms.title')}</h1>
                        </div>
                        <p className="text-pink-100 text-lg">{t('she_farms.subtitle')}</p>
                    </div>
                    <Button
                        variant="secondary"
                        className="bg-white text-pink-600 hover:bg-pink-50"
                        onClick={() => setShowTraining(true)}
                    >
                        <Users className="h-4 w-4 mr-2" />
                        {t('she_farms.training_programs')}
                    </Button>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{t('she_farms.available_schemes')}</h2>
                    <p className="text-gray-600 mt-2">{t('she_farms.ai_recommendation')}</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {t('she_farms.update_profile')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{t('she_farms.profile_dialog.title')}</DialogTitle>
                            <DialogDescription>
                                {t('she_farms.profile_dialog.description')}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t('she_farms.profile_dialog.labels.name')}</Label>
                                <Input
                                    id="name"
                                    value={farmerProfile.name}
                                    onChange={(e) => setFarmerProfile(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder={t('she_farms.profile_dialog.placeholders.name')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">{t('she_farms.profile_dialog.labels.location')}</Label>
                                <Input
                                    id="location"
                                    value={farmerProfile.location}
                                    onChange={(e) => setFarmerProfile(prev => ({ ...prev, location: e.target.value }))}
                                    placeholder={t('she_farms.profile_dialog.placeholders.location')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="age">{t('she_farms.profile_dialog.labels.age')}</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    value={farmerProfile.age || ''}
                                    onChange={(e) => setFarmerProfile(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                                    placeholder={t('she_farms.profile_dialog.placeholders.age')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="farmSize">{t('she_farms.profile_dialog.labels.farm_size')}</Label>
                                <Input
                                    id="farmSize"
                                    type="number"
                                    value={farmerProfile.farmSize || ''}
                                    onChange={(e) => setFarmerProfile(prev => ({ ...prev, farmSize: parseFloat(e.target.value) || 0 }))}
                                    placeholder={t('she_farms.profile_dialog.placeholders.farm_size')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="experience">{t('she_farms.profile_dialog.labels.experience')}</Label>
                                <Input
                                    id="experience"
                                    type="number"
                                    value={farmerProfile.farmingExperience || ''}
                                    onChange={(e) => setFarmerProfile(prev => ({ ...prev, farmingExperience: parseInt(e.target.value) || 0 }))}
                                    placeholder={t('she_farms.profile_dialog.placeholders.experience')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="income">{t('she_farms.profile_dialog.labels.income')}</Label>
                                <Input
                                    id="income"
                                    type="number"
                                    value={farmerProfile.annualIncome || ''}
                                    onChange={(e) => setFarmerProfile(prev => ({ ...prev, annualIncome: parseFloat(e.target.value) || 0 }))}
                                    placeholder={t('she_farms.profile_dialog.placeholders.income')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">{t('she_farms.profile_dialog.labels.category')}</Label>
                                <Select
                                    value={farmerProfile.category}
                                    onValueChange={(value: 'small' | 'marginal' | 'medium' | 'large') =>
                                        setFarmerProfile(prev => ({ ...prev, category: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="marginal">{t('she_farms.profile_dialog.categories.marginal')}</SelectItem>
                                        <SelectItem value="small">{t('she_farms.profile_dialog.categories.small')}</SelectItem>
                                        <SelectItem value="medium">{t('she_farms.profile_dialog.categories.medium')}</SelectItem>
                                        <SelectItem value="large">{t('she_farms.profile_dialog.categories.large')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="education">{t('she_farms.profile_dialog.labels.education')}</Label>
                                <Input
                                    id="education"
                                    value={farmerProfile.education}
                                    onChange={(e) => setFarmerProfile(prev => ({ ...prev, education: e.target.value }))}
                                    placeholder={t('she_farms.profile_dialog.placeholders.education')}
                                />
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {!profileComplete && (
                <Card className="border-pink-200 bg-pink-50">
                    <CardContent className="flex items-center gap-3 pt-6">
                        <AlertCircle className="h-5 w-5 text-pink-600" />
                        <div>
                            <p className="text-pink-800 font-medium">{t('she_farms.alert.complete_profile')}</p>
                            <p className="text-pink-600 text-sm">{t('she_farms.alert.update_profile')}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex gap-4 items-center">
                <Label>{t('she_farms.filter_label')}</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-48">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(category => (
                            <SelectItem key={category} value={category}>
                                {category === 'all' ? t('she_farms.all_categories') : category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-6">
                {filteredSchemes.map((scheme) => (
                    <Card key={scheme.id} className="hover:shadow-lg transition-shadow border-pink-100">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <CardTitle className="text-xl">{scheme.name}</CardTitle>
                                        <Badge
                                            variant={scheme.status === 'eligible' ? 'default' :
                                                scheme.status === 'partially-eligible' ? 'secondary' : 'destructive'}
                                            className="bg-pink-500"
                                        >
                                            {scheme.matchScore}% {t('she_farms.match_score')}
                                        </Badge>
                                    </div>
                                    <CardDescription className="text-base">{scheme.description}</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" onClick={() => setSelectedScheme(scheme)}>
                                                <FileText className="h-4 w-4 mr-2" />
                                                {t('she_farms.details')}
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle>{scheme.name}</DialogTitle>
                                                <DialogDescription>{scheme.description}</DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-semibold mb-2">{t('she_farms.scheme_details.eligibility')}</h4>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        {scheme.eligibility.map((criteria, index) => (
                                                            <li key={index} className="text-sm text-gray-600">{criteria}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-2">{t('she_farms.scheme_details.benefits')}</h4>
                                                    <p className="text-sm text-gray-600">{scheme.benefits}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-2">{t('she_farms.scheme_details.documents')}</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {scheme.documents.map((doc, index) => (
                                                            <Badge key={index} variant="outline">{doc}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        {t('she_farms.scheme_details.deadline')} {scheme.applicationDeadline}
                                                    </div>
                                                    <Badge className="bg-pink-500">{scheme.category}</Badge>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    {scheme.applicationUrl && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(scheme.applicationUrl, '_blank')}
                                        >
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            {t('she_farms.official_website')}
                                        </Button>
                                    )}
                                    <Button
                                        className="bg-pink-500 hover:bg-pink-600"
                                        size="sm"
                                        onClick={() => handleEasyApply(scheme)}
                                    >
                                        <Zap className="h-4 w-4 mr-2" />
                                        {t('she_farms.easy_apply')}
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1 text-green-600">
                                        <DollarSign className="h-4 w-4" />
                                        <span>{scheme.benefits.substring(0, 50)}...</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-gray-600">
                                    <Clock className="h-4 w-4" />
                                    <span>{t('she_farms.scheme_details.deadline')} {scheme.applicationDeadline}</span>
                                </div>
                            </div>
                            {profileComplete && (
                                <div className="mt-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">{t('she_farms.match_score')}</span>
                                        <span className="text-sm font-semibold text-pink-600">{scheme.matchScore}%</span>
                                    </div>
                                    <Progress value={scheme.matchScore} className="h-2" />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
            <TrainingEnrollmentDialog
                open={showTraining}
                onOpenChange={setShowTraining}
            />
        </div>
    );
};
