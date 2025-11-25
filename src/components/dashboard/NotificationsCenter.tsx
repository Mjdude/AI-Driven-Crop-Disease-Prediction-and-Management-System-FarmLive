import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { NotificationsManagementDialog } from './NotificationsManagementDialog';

export const NotificationsCenter: React.FC = () => {
  const { t } = useTranslation();
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false);

  const handleViewAllNotifications = () => {
    setShowNotificationsDialog(true);
  };

  const notifications = [
    {
      title: t('notifications.heavy_rain'),
      message: t('notifications.rain_expected'),
      type: 'warning',
      icon: AlertCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      title: t('notifications.irrigation_reminder'),
      message: t('notifications.north_field_irrigation'),
      type: 'info',
      icon: Info,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: t('notifications.crop_health_check'),
      message: t('notifications.tomato_inspection'),
      type: 'info',
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <>
      <div className="metric-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.notifications')}</h3>
          <div className="relative">
            <Bell size={18} className="text-gray-400" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {notifications.map((notification, index) => {
            const Icon = notification.icon;
            return (
              <div
                key={index}
                className={`${notification.bgColor} border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow`}
              >
                <div className="flex items-start space-x-3">
                  <Icon size={18} className={notification.color} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">
                      {notification.title}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {notification.message}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleViewAllNotifications}
          className="w-full mt-4 text-farm-green-600 hover:text-farm-green-700 font-medium py-2 px-4 border border-farm-green-200 rounded-lg hover:bg-farm-green-50 transition-colors duration-200"
        >
          {t('dashboard.view_all_notifications')}
        </button>
      </div>

      <NotificationsManagementDialog
        open={showNotificationsDialog}
        onOpenChange={setShowNotificationsDialog}
      />
    </>
  );
};
