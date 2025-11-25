import React, { useState } from 'react';
import { Search, Menu, Settings, Bell, User, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';
import { UserProfileDialog } from './UserProfileDialog';
import { FarmSettingsDialog } from '../dashboard/FarmSettingsDialog';
import { NotificationsManagementDialog } from '../dashboard/NotificationsManagementDialog';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeSection: string;
  setActiveSection?: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeSection,
  setActiveSection
}) => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' }
  ];

  const getSectionTitle = (section: string) => {
    const titles = {
      dashboard: t('sidebar.dashboard'),
      'crop-monitoring': t('sidebar.crop_monitoring'),
      market: t('sidebar.market_intelligence'),
      weather: t('sidebar.weather_advisory'),
      community: t('sidebar.community'),
      'ai-assistant': t('sidebar.ai_assistant'),
      'she-farms': t('sidebar.she_farms'),
      'government-schemes': t('sidebar.gov_schemes'),
      'crop-trading': t('sidebar.crop_trading'),
      'financial-assistance': t('sidebar.finance'),
      'alerts-notifications': t('sidebar.alerts')
    };
    return titles[section as keyof typeof titles] || t('app.title');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement actual search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  const handleNotifications = () => {
    setShowNotificationsDialog(true);
  };

  const handleSettings = () => {
    setShowSettingsDialog(true);
  };

  const handleProfile = () => {
    setShowProfileDialog(true);
  };

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100"
              title="Toggle sidebar"
            >
              <Menu size={20} />
            </Button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-farm-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 font-poppins">
                  {t('app.title')}
                </h1>
                <p className="text-sm text-gray-600">{getSectionTitle(activeSection)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={t('header.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-green-500 focus:border-transparent transition-all"
              />
            </form>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-gray-100" title={t('header.language')}>
                  <Globe size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={i18n.language === lang.code ? 'bg-gray-100 font-medium' : ''}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              className="relative hover:bg-gray-100"
              onClick={handleNotifications}
              title={t('header.notifications')}
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSettings}
              className="hover:bg-gray-100"
              title={t('sidebar.settings')}
            >
              <Settings size={20} />
            </Button>

            <button
              onClick={handleProfile}
              className="flex items-center space-x-2 pl-2 border-l border-gray-200 hover:bg-gray-50 rounded-r-lg pr-2 py-1 transition-colors"
              title={t('header.profile')}
            >
              <div className="w-8 h-8 bg-farm-green-100 rounded-full flex items-center justify-center">
                <User size={16} className="text-farm-green-600" />
              </div>
              <div className="text-sm text-left">
                <p className="font-medium text-gray-900">Rajesh Kumar</p>
                <p className="text-gray-500">Farmer</p>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Dialogs */}
      <UserProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
      />

      <FarmSettingsDialog
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        onSuccess={() => console.log('Settings saved')}
      />

      <NotificationsManagementDialog
        open={showNotificationsDialog}
        onOpenChange={setShowNotificationsDialog}
      />
    </>
  );
};
