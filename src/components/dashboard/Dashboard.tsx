
import React from 'react';
import { useTranslation } from 'react-i18next';
import { WeatherWidget } from './WeatherWidget';
import { FarmOverview } from './FarmOverview';
import { QuickActions } from './QuickActions';
import { RecentActivities } from './RecentActivities';
import { MarketPrices } from './MarketPrices';
import { CropHealth } from './CropHealth';
import { NotificationsCenter } from './NotificationsCenter';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-farm-green-500 to-farm-green-400 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-poppins mb-2">
              {t('dashboard.welcome_title')}
            </h1>
            <p className="text-farm-green-100 text-lg">
              {t('dashboard.welcome_subtitle')}
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/20 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-right">
                <p className="text-2xl font-bold">₹2,45,000</p>
                <p className="text-farm-green-100">{t('dashboard.expected_revenue')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Row - Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FarmOverview />
        </div>
        <div>
          <WeatherWidget />
        </div>
      </div>

      {/* Middle Row - Actions and Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickActions />
        <CropHealth />
        <NotificationsCenter />
      </div>

      {/* Bottom Row - Market and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketPrices />
        <RecentActivities />
      </div>
    </div>
  );
};
