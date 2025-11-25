import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface YieldPredictionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const YieldPredictionDialog: React.FC<YieldPredictionDialogProps> = ({ open, onOpenChange }) => {
    const { t } = useTranslation();
    const [calculating, setCalculating] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleCalculate = () => {
        setCalculating(true);
        // Simulate calculation
        setTimeout(() => {
            setResult({
                predictedYield: '4.2 Tons/Acre',
                confidence: '88%',
                comparison: '+5% vs Regional Avg',
                factors: [
                    'Optimal soil moisture (+)',
                    'Favorable weather forecast (+)',
                    'Slight pest risk (-)'
                ]
            });
            setCalculating(false);
        }, 1500);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{t('crop_monitoring.yield_prediction.title')}</DialogTitle>
                    <DialogDescription>
                        {t('crop_monitoring.yield_prediction.description')}
                    </DialogDescription>
                </DialogHeader>

                {!result ? (
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{t('crop_monitoring.yield_prediction.crop_type')}</Label>
                                <Select defaultValue="wheat">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="wheat">Wheat</SelectItem>
                                        <SelectItem value="rice">Rice</SelectItem>
                                        <SelectItem value="corn">Corn</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>{t('crop_monitoring.yield_prediction.variety')}</Label>
                                <Select defaultValue="hd2967">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hd2967">HD-2967</SelectItem>
                                        <SelectItem value="pbw343">PBW-343</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{t('crop_monitoring.yield_prediction.sowing_date')}</Label>
                            <Input type="date" />
                        </div>

                        <div className="space-y-2">
                            <Label>{t('crop_monitoring.yield_prediction.field_area')}</Label>
                            <Input type="number" placeholder="e.g. 2.5" />
                        </div>

                        <div className="space-y-2">
                            <Label>{t('crop_monitoring.yield_prediction.soil_moisture')}</Label>
                            <Input type="number" placeholder="e.g. 65" />
                        </div>
                    </div>
                ) : (
                    <div className="py-6 space-y-6">
                        <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
                            <h3 className="text-sm font-medium text-green-800 uppercase tracking-wide mb-2">{t('crop_monitoring.yield_prediction.predicted_yield')}</h3>
                            <div className="text-4xl font-bold text-green-700 mb-2">{result.predictedYield}</div>
                            <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                                <TrendingUp className="h-4 w-4" />
                                {result.comparison}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900">{t('crop_monitoring.yield_prediction.contributing_factors')}</h4>
                            {result.factors.map((factor: string, i: number) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                    <div className={`w-2 h-2 rounded-full ${factor.includes('(+)') ? 'bg-green-500' : 'bg-red-500'}`} />
                                    {factor}
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-yellow-50 p-3 rounded border border-yellow-100">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            {t('crop_monitoring.yield_prediction.disclaimer', { confidence: result.confidence })}
                        </div>
                    </div>
                )}

                <DialogFooter>
                    {result ? (
                        <Button onClick={() => setResult(null)} variant="outline" className="w-full">
                            {t('crop_monitoring.yield_prediction.calculate_another')}
                        </Button>
                    ) : (
                        <Button onClick={handleCalculate} disabled={calculating} className="w-full">
                            {calculating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t('crop_monitoring.yield_prediction.calculating')}
                                </>
                            ) : (
                                <>
                                    <Calculator className="mr-2 h-4 w-4" />
                                    {t('crop_monitoring.yield_prediction.predict_button')}
                                </>
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
