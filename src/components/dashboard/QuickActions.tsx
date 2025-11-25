import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Camera, Calendar, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { AddCropRecordDialog } from './AddCropRecordDialog';
import { CropHealthCheckDialog } from './CropHealthCheckDialog';
import { ScheduleIrrigationDialog } from './ScheduleIrrigationDialog';
import { FarmSettingsDialog } from './FarmSettingsDialog';

export const QuickActions: React.FC = () => {
  const { t } = useTranslation();
  const [showAddCropDialog, setShowAddCropDialog] = useState(false);
  const [showHealthCheckDialog, setShowHealthCheckDialog] = useState(false);
  const [showIrrigationDialog, setShowIrrigationDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  const handleAddCropRecord = () => {
    setShowAddCropDialog(true);
  };

  const handleCropHealthCheck = () => {
    setShowHealthCheckDialog(true);
  };

  const handleScheduleIrrigation = () => {
    setShowIrrigationDialog(true);
  };

  const handleFarmSettings = () => {
    setShowSettingsDialog(true);
  };

  const handleCropRecordSuccess = () => {
    // Refresh dashboard or update state as needed
    console.log('Crop record added successfully');
  };

  const actions = [
    {
      title: t('actions.add_crop'),
      description: t('actions.add_crop_desc'),
      icon: Plus,
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-white',
      onClick: handleAddCropRecord
    },
    {
      title: t('actions.health_check'),
      description: t('actions.health_check_desc'),
      icon: Camera,
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-white',
      onClick: handleCropHealthCheck
    },
    {
      title: t('actions.schedule_irrigation'),
      description: t('actions.schedule_irrigation_desc'),
      icon: Calendar,
      color: 'bg-cyan-500 hover:bg-cyan-600',
      textColor: 'text-white',
      onClick: handleScheduleIrrigation
    },
    {
      title: t('actions.farm_settings'),
      description: t('actions.farm_settings_desc'),
      icon: Settings,
      color: 'bg-gray-500 hover:bg-gray-600',
      textColor: 'text-white',
      onClick: handleFarmSettings
    },
  ];

  return (
    <>
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.quick_actions')}</h3>

        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.onClick}
                className={`${action.color} ${action.textColor} rounded-lg p-4 text-left transition-all duration-200 transform hover:scale-105 shadow-sm`}
              >
                <Icon size={24} className="mb-2" />
                <div className="text-sm font-medium">{action.title}</div>
                <div className="text-xs opacity-90 mt-1">{action.description}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-farm-green-50 border border-farm-green-200 rounded-lg">
          <div className="text-sm font-medium text-farm-green-800">{t('dashboard.todays_recommendation')}</div>
          <div className="text-xs text-farm-green-700 mt-1">
            {t('dashboard.recommendation_text')}
          </div>
        </div>
      </div>

      {/* Add Crop Record Dialog */}
      <AddCropRecordDialog
        open={showAddCropDialog}
        onOpenChange={setShowAddCropDialog}
        onSuccess={handleCropRecordSuccess}
      />

      {/* Crop Health Check Dialog */}
      <CropHealthCheckDialog
        open={showHealthCheckDialog}
        onOpenChange={setShowHealthCheckDialog}
        onSuccess={() => console.log('Health check saved')}
      />

      {/* Schedule Irrigation Dialog */}
      <ScheduleIrrigationDialog
        open={showIrrigationDialog}
        onOpenChange={setShowIrrigationDialog}
        onSuccess={() => console.log('Irrigation scheduled')}
      />

      {/* Farm Settings Dialog */}
      <FarmSettingsDialog
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        onSuccess={() => console.log('Settings saved')}
      />
    </>
  );
};
