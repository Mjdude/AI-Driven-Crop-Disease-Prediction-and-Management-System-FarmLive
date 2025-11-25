
import React from 'react';
import {
  Calendar,
  BarChart3,
  Cloud,
  Users,
  Settings,
  Monitor,
  User,
  Database,
  Search,
  FileText,
  ShoppingCart,
  DollarSign,
  Bell
} from 'lucide-react';

import { useTranslation } from 'react-i18next';

interface SidebarProps {
  isOpen: boolean;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeSection, setActiveSection }) => {
  const { t } = useTranslation();

  const menuItems = [
    { id: 'dashboard', label: t('sidebar.dashboard'), icon: Monitor, color: 'text-blue-600' },
    { id: 'crop-monitoring', label: t('sidebar.crop_monitoring'), icon: Calendar, color: 'text-green-600' },
    { id: 'market', label: t('sidebar.market_intelligence'), icon: BarChart3, color: 'text-purple-600' },
    { id: 'weather', label: t('sidebar.weather_advisory'), icon: Cloud, color: 'text-sky-600' },
    { id: 'government-schemes', label: t('sidebar.gov_schemes'), icon: FileText, color: 'text-emerald-600' },
    { id: 'crop-trading', label: t('sidebar.crop_trading'), icon: ShoppingCart, color: 'text-amber-600' },
    { id: 'financial-assistance', label: t('sidebar.finance'), icon: DollarSign, color: 'text-teal-600' },
    { id: 'alerts-notifications', label: t('sidebar.alerts'), icon: Bell, color: 'text-red-600' },
    { id: 'community', label: t('sidebar.community'), icon: Users, color: 'text-orange-600' },
    { id: 'ai-assistant', label: t('sidebar.ai_assistant'), icon: Search, color: 'text-indigo-600' },
    { id: 'she-farms', label: t('sidebar.she_farms'), icon: User, color: 'text-pink-600' },
  ];

  const secondaryItems = [
    { id: 'analytics', label: t('sidebar.analytics'), icon: Database, color: 'text-gray-600' },
    { id: 'settings', label: t('sidebar.settings'), icon: Settings, color: 'text-gray-600' },
  ];

  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-40 ${isOpen ? 'w-64' : 'w-16'
      }`}>
      <div className="h-full overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full nav-item ${isActive ? 'bg-farm-green-50 text-farm-green-700 border-r-2 border-farm-green-500' : 'text-gray-700 hover:text-farm-green-600'
                }`}
            >
              <Icon size={20} className={isActive ? 'text-farm-green-600' : item.color} />
              {isOpen && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </button>
          );
        })}

        {isOpen && (
          <div className="pt-4 mt-4 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
              {t('sidebar.tools')}
            </p>
            {secondaryItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="w-full nav-item text-gray-700 hover:text-farm-green-600"
                >
                  <Icon size={20} className={item.color} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
