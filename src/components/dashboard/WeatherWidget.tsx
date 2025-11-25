
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cloud, Sun, CloudRain, Wind } from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  const { t } = useTranslation();

  const weatherData = {
    current: {
      temperature: 28,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      icon: Cloud
    },
    forecast: [
      { day: t('common.today'), high: 32, low: 24, icon: Sun, condition: 'Sunny' },
      { day: t('common.tomorrow'), high: 29, low: 22, icon: CloudRain, condition: 'Light Rain' },
      { day: 'Wed', high: 26, low: 20, icon: CloudRain, condition: 'Rainy' },
      { day: 'Thu', high: 30, low: 23, icon: Cloud, condition: 'Cloudy' },
    ]
  };

  const CurrentIcon = weatherData.current.icon;

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.weather_advisory')}</h3>
        <span className="text-xs text-gray-500">Pune, Maharashtra</span>
      </div>

      {/* Current Weather */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center justify-center w-16 h-16 bg-sky-gradient rounded-full">
          <CurrentIcon className="text-white" size={32} />
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-900">{weatherData.current.temperature}°C</div>
          <div className="text-gray-600">{weatherData.current.condition}</div>
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Cloud size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">{t('weather.humidity')}: {weatherData.current.humidity}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <Wind size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">{t('weather.wind')}: {weatherData.current.windSpeed} km/h</span>
        </div>
      </div>

      {/* 4-Day Forecast */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">{t('weather.forecast_4_day')}</h4>
        {weatherData.forecast.map((day, index) => {
          const DayIcon = day.icon;
          return (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <DayIcon size={20} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{day.day}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-900 font-medium">{day.high}°</span>
                <span className="text-sm text-gray-500">{day.low}°</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weather Alert */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <CloudRain size={16} className="text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">{t('weather.alert_rain_title')}</span>
        </div>
        <p className="text-xs text-yellow-700 mt-1">
          {t('weather.alert_rain_desc')}
        </p>
      </div>
    </div>
  );
};
