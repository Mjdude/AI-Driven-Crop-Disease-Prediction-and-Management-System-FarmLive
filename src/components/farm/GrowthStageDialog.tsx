import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, ArrowRight, Calendar, Sprout } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GrowthStageDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const cropStages = {
    wheat: {
        name: 'Wheat',
        currentStage: 3,
        totalStages: 5,
        stages: [
            { id: 1, name: 'Germination', days: '0-7', status: 'completed' },
            { id: 2, name: 'Tillering', days: '20-35', status: 'completed' },
            { id: 3, name: 'Jointing', days: '35-50', status: 'current' },
            { id: 4, name: 'Flowering', days: '60-75', status: 'upcoming' },
            { id: 5, name: 'Ripening', days: '100-120', status: 'upcoming' }
        ],
        nextAction: 'Apply second dose of nitrogen fertilizer',
        estimatedHarvest: 'April 15, 2025'
    },
    rice: {
        name: 'Rice',
        currentStage: 2,
        totalStages: 4,
        stages: [
            { id: 1, name: 'Seedling', days: '0-20', status: 'completed' },
            { id: 2, name: 'Vegetative', days: '20-60', status: 'current' },
            { id: 3, name: 'Reproductive', days: '60-90', status: 'upcoming' },
            { id: 4, name: 'Ripening', days: '90-120', status: 'upcoming' }
        ],
        nextAction: 'Maintain water level at 5cm',
        estimatedHarvest: 'June 20, 2025'
    }
};

export const GrowthStageDialog: React.FC<GrowthStageDialogProps> = ({ open, onOpenChange }) => {
    const { t } = useTranslation();
    const [selectedCrop, setSelectedCrop] = useState<keyof typeof cropStages>('wheat');
    const cropData = cropStages[selectedCrop];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{t('crop_monitoring.growth_stage.title')}</DialogTitle>
                    <DialogDescription>
                        {t('crop_monitoring.growth_stage.description')}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="flex items-center gap-4">
                        <div className="w-48">
                            <Select value={selectedCrop} onValueChange={(v) => setSelectedCrop(v as keyof typeof cropStages)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('crop_monitoring.growth_stage.select_crop')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="wheat">Wheat (North Field)</SelectItem>
                                    <SelectItem value="rice">Rice (East Plot)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1 text-right">
                            <span className="text-sm text-gray-500">{t('crop_monitoring.growth_stage.estimated_harvest')}</span>
                            <div className="font-semibold text-green-700 flex items-center justify-end gap-2">
                                <Calendar className="h-4 w-4" />
                                {cropData.estimatedHarvest}
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span>{t('crop_monitoring.growth_stage.progress')}</span>
                            <span>{Math.round((cropData.currentStage / cropData.totalStages) * 100)}%</span>
                        </div>
                        <Progress value={(cropData.currentStage / cropData.totalStages) * 100} className="h-2" />
                    </div>

                    {/* Timeline */}
                    <div className="relative border-l-2 border-gray-200 ml-4 space-y-8 py-2">
                        {cropData.stages.map((stage, index) => (
                            <div key={stage.id} className="relative pl-8">
                                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 
                  ${stage.status === 'completed' ? 'bg-green-500 border-green-500' :
                                        stage.status === 'current' ? 'bg-blue-500 border-blue-500 ring-4 ring-blue-100' :
                                            'bg-white border-gray-300'}`}>
                                    {stage.status === 'completed' && <CheckCircle className="h-3 w-3 text-white absolute top-0 left-0" />}
                                </div>

                                <div className={`flex justify-between items-start p-4 rounded-lg border transition-all
                  ${stage.status === 'current' ? 'bg-blue-50 border-blue-200 shadow-sm' :
                                        stage.status === 'completed' ? 'bg-gray-50 border-gray-100 opacity-70' :
                                            'bg-white border-gray-100'}`}>
                                    <div>
                                        <h4 className={`font-bold ${stage.status === 'current' ? 'text-blue-800' : 'text-gray-900'}`}>
                                            {stage.name}
                                        </h4>
                                        <p className="text-sm text-gray-500">{t('crop_monitoring.growth_stage.day')} {stage.days}</p>
                                    </div>
                                    {stage.status === 'current' && (
                                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                            {t('crop_monitoring.growth_stage.current_stage')}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Next Action */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                        <Sprout className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-yellow-800">{t('crop_monitoring.growth_stage.recommended_action')}</h4>
                            <p className="text-sm text-yellow-700">{cropData.nextAction}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
