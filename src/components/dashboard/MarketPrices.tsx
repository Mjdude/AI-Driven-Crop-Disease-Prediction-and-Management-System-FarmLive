
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const MarketPrices: React.FC = () => {
  const { t } = useTranslation();

  const marketData = [
    {
      commodity: t('commodities.wheat'),
      price: '₹2,850',
      unit: t('market.per_quintal'),
      change: '+5.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      commodity: t('commodities.rice'),
      price: '₹3,200',
      unit: t('market.per_quintal'),
      change: '-2.1%',
      trend: 'down',
      icon: TrendingDown,
      color: 'text-red-500'
    },
    {
      commodity: t('commodities.corn'),
      price: '₹2,100',
      unit: t('market.per_quintal'),
      change: '0.0%',
      trend: 'stable',
      icon: Minus,
      color: 'text-gray-500'
    },
    {
      commodity: t('commodities.tomatoes'),
      price: '₹45',
      unit: t('market.per_kg'),
      change: '+12.8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      commodity: t('commodities.onions'),
      price: '₹35',
      unit: t('market.per_kg'),
      change: '+8.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-500'
    }
  ];

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.market_prices')}</h3>
        <span className="text-xs text-gray-500">{t('dashboard.last_updated')}</span>
      </div>

      <div className="space-y-3">
        {marketData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-farm-earth-100 rounded-lg flex items-center justify-center">
                  <span className="text-farm-earth-600 font-medium text-sm">
                    {item.commodity.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{item.commodity}</div>
                  <div className="text-sm text-gray-500">{item.unit}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-gray-900">{item.price}</div>
                <div className={`flex items-center space-x-1 text-sm ${item.color}`}>
                  <Icon size={14} />
                  <span>{item.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-farm-sky-50 border border-farm-sky-200 rounded-lg">
        <div className="text-sm font-medium text-farm-sky-800">{t('dashboard.market_insight')}</div>
        <div className="text-xs text-farm-sky-700 mt-1">
          {t('dashboard.market_insight_text')}
        </div>
      </div>
    </div>
  );
};
