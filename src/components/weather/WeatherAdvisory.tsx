import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Eye,
  Gauge,
  MapPin,
  RefreshCw,
  Download,
  Share2,
  Settings,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Thermometer
} from 'lucide-react';
import { WeatherForecastCard } from './WeatherForecastCard';
import { WeatherAlertCard } from './WeatherAlertCard';
import { AgricultureAdvisoryPanel } from './AgricultureAdvisoryPanel';
import { WeatherChart } from './WeatherChart';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Location {
  name: string;
  lat: number;
  lon: number;
  state?: string;
}

export const WeatherAdvisory: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [advisory, setAdvisory] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location>({
    name: 'Delhi',
    lat: 28.6139,
    lon: 77.2090,
    state: 'Delhi'
  });
  const [selectedCrop, setSelectedCrop] = useState<string>('rice');

  // Sample locations
  const locations: Location[] = [
    { name: 'Delhi', lat: 28.6139, lon: 77.2090, state: 'Delhi' },
    { name: 'Mumbai', lat: 19.0760, lon: 72.8777, state: 'Maharashtra' },
    { name: 'Bangalore', lat: 12.9716, lon: 77.5946, state: 'Karnataka' },
    { name: 'Pune', lat: 18.5204, lon: 73.8567, state: 'Maharashtra' },
    { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, state: 'Telangana' },
  ];

  const crops = ['rice', 'wheat', 'tomato', 'cotton', 'sugarcane', 'maize'];

  const setMockData = () => {
    // Mock current weather
    setCurrentWeather({
      temperature: 28,
      humidity: 65,
      windSpeed: 12,
      windDirection: 180,
      pressure: 1013,
      visibility: 10,
      uvIndex: 6,
      condition: 'Partly Cloudy',
      description: 'partly cloudy',
      icon: '02d',
      location: {
        name: selectedLocation.name,
        country: 'IN',
        region: selectedLocation.state
      },
      timestamp: new Date()
    });

    // Mock forecast
    const mockForecast = Array.from({ length: 7 }, (_, i) => ({
      datetime: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
      temperature: {
        current: 28 + Math.random() * 5,
        min: 22 + Math.random() * 3,
        max: 32 + Math.random() * 4,
        feelsLike: 30 + Math.random() * 3
      },
      humidity: 60 + Math.random() * 20,
      windSpeed: 10 + Math.random() * 10,
      windDirection: Math.random() * 360,
      condition: i % 3 === 0 ? 'Rain' : i % 2 === 0 ? 'Cloudy' : 'Clear',
      description: i % 3 === 0 ? 'light rain' : i % 2 === 0 ? 'partly cloudy' : 'clear sky',
      icon: '02d',
      precipitation: {
        probability: i % 3 === 0 ? 70 + Math.random() * 20 : Math.random() * 40,
        amount: i % 3 === 0 ? 5 + Math.random() * 10 : Math.random() * 2
      }
    }));
    setForecast(mockForecast);

    // Mock alerts
    setAlerts([
      {
        id: 'alert_001',
        title: 'Heavy Rainfall Warning',
        description: 'Heavy to very heavy rainfall expected over the next 24-48 hours',
        severity: 'severe',
        urgency: 'immediate',
        areas: [selectedLocation.state || 'Delhi'],
        startTime: new Date(),
        endTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
        instructions: [
          'Avoid unnecessary travel',
          'Secure loose objects and livestock',
          'Monitor water levels in low-lying areas',
          'Keep emergency supplies ready'
        ]
      }
    ]);

    // Mock advisory
    setAdvisory({
      currentConditions: currentWeather,
      forecast: mockForecast,
      recommendations: [
        'High humidity: Monitor for fungal diseases and ensure good ventilation',
        'Rain expected: Postpone spraying activities and ensure proper drainage'
      ],
      irrigation: {
        recommendation: 'postpone',
        reason: 'Rain expected (15.5mm in next 3 days)',
        nextIrrigation: 'After rainfall stops',
        waterRequirement: 'Medium (15-20mm)'
      },
      pestDisease: {
        level: 'medium',
        risks: ['Fungal diseases (leaf spot, blight)', 'Insect pests (aphids, thrips)'],
        preventiveMeasures: [
          'Apply fungicide spray as preventive measure',
          'Ensure proper field drainage',
          'Monitor crop regularly for pest infestation'
        ]
      },
      fieldWork: {
        suitable: ['Indoor activities only'],
        postpone: ['Spraying (rain expected)', 'Harvesting (rain expected)'],
        bestTime: 'After rain stops'
      }
    });
  };

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      // Fetch current weather
      const currentData = await api.getCurrentWeather({
        lat: selectedLocation.lat,
        lon: selectedLocation.lon
      });
      setCurrentWeather(currentData.data?.weather || null);

      // Fetch forecast
      const forecastData = await api.getWeatherForecast({
        lat: selectedLocation.lat,
        lon: selectedLocation.lon,
        days: 7
      });
      setForecast(forecastData.data?.forecast || []);

      // Fetch alerts
      const alertsData = await api.getWeatherAlerts({
        state: selectedLocation.state
      });
      setAlerts(alertsData.data?.alerts || []);

      // Fetch agricultural advisory
      const advisoryData = await api.getAgricultureAdvisory({
        lat: selectedLocation.lat,
        lon: selectedLocation.lon,
        cropType: selectedCrop
      });
      setAdvisory(advisoryData.data?.advisory || null);

      toast.success('Weather data updated successfully');
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast.error('Failed to fetch weather data');
      // Set mock data for development
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [selectedLocation, selectedCrop]);

  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition?.toLowerCase() || '';
    if (conditionLower.includes('rain')) return CloudRain;
    if (conditionLower.includes('cloud')) return Cloud;
    return Sun;
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= 35) return 'text-red-600';
    if (temp >= 30) return 'text-orange-500';
    if (temp >= 25) return 'text-yellow-600';
    if (temp >= 20) return 'text-green-600';
    return 'text-blue-500';
  };

  const prepareChartData = () => {
    return forecast.slice(0, 7).map((day, index) => ({
      name: new Date(day.datetime).toLocaleDateString('en-IN', { weekday: 'short' }),
      temperature: Math.round(day.temperature.current),
      precipitation: day.precipitation.amount,
      precipitationProb: Math.round(day.precipitation.probability),
      humidity: Math.round(day.humidity),
      windSpeed: Math.round(day.windSpeed)
    }));
  };

  const handleExport = () => {
    try {
      const exportData = {
        location: selectedLocation.name,
        crop: selectedCrop,
        exportDate: new Date().toISOString(),
        currentWeather,
        forecast: forecast.slice(0, 7),
        alerts,
        advisory
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `weather-report-${selectedLocation.name}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Weather report exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export weather report');
    }
  };

  const handleShare = async () => {
    try {
      const shareText = `Weather Advisory for ${selectedLocation.name}
Current: ${currentWeather?.temperature}°C, ${currentWeather?.description}
Humidity: ${currentWeather?.humidity}%
Wind: ${currentWeather?.windSpeed} km/h

${alerts.length > 0 ? `⚠️ Active Alerts: ${alerts.length}` : '✅ No active alerts'}

View full forecast at: ${window.location.href}`;

      if (navigator.share) {
        await navigator.share({
          title: 'Weather Advisory',
          text: shareText,
        });
        toast.success('Shared successfully');
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        toast.success('Weather info copied to clipboard');
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Share error:', error);
        toast.error('Failed to share weather info');
      }
    }
  };

  const WeatherIcon = currentWeather ? getWeatherIcon(currentWeather.condition) : Cloud;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-poppins mb-2">Weather Advisory Center</h1>
            <p className="text-sky-100 text-lg">Hyperlocal forecasts and agricultural weather insights</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchWeatherData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Location and Crop Selection */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                <MapPin className="h-4 w-4 inline mr-1" />
                Select Location
              </label>
              <Select
                value={selectedLocation.name}
                onValueChange={(value) => {
                  const location = locations.find(loc => loc.name === value);
                  if (location) setSelectedLocation(location);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc.name} value={loc.name}>
                      {loc.name}, {loc.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                <TrendingUp className="h-4 w-4 inline mr-1" />
                Select Crop Type
              </label>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {crops.map((crop) => (
                    <SelectItem key={crop} value={crop}>
                      {crop.charAt(0).toUpperCase() + crop.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Weather */}
      {currentWeather && (
        <Card className="bg-gradient-to-br from-blue-50 to-sky-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Current Weather
              <Badge variant="secondary" className="ml-2">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Main Temperature */}
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-4">
                  <WeatherIcon className={`h-16 w-16 ${getTemperatureColor(currentWeather.temperature)}`} />
                  <div>
                    <div className={`text-5xl font-bold ${getTemperatureColor(currentWeather.temperature)}`}>
                      {Math.round(currentWeather.temperature)}°
                    </div>
                    <p className="text-gray-600 capitalize mt-1">{currentWeather.description}</p>
                  </div>
                </div>
              </div>

              {/* Weather Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 col-span-1 md:col-span-2 lg:col-span-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Droplets className="h-4 w-4" />
                    <span className="text-xs font-medium">Humidity</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{currentWeather.humidity}%</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Wind className="h-4 w-4" />
                    <span className="text-xs font-medium">Wind Speed</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{Math.round(currentWeather.windSpeed)} km/h</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Gauge className="h-4 w-4" />
                    <span className="text-xs font-medium">Pressure</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{currentWeather.pressure} hPa</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Eye className="h-4 w-4" />
                    <span className="text-xs font-medium">Visibility</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{currentWeather.visibility} km</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Sun className="h-4 w-4" />
                    <span className="text-xs font-medium">UV Index</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{currentWeather.uvIndex}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Wind className="h-4 w-4" />
                    <span className="text-xs font-medium">Direction</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{currentWeather.windDirection}°</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weather Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-900">Active Weather Alerts</h2>
            <Badge variant="destructive">{alerts.length}</Badge>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {alerts.map((alert) => (
              <WeatherAlertCard
                key={alert.id}
                alert={alert}
                onDismiss={(id) => setAlerts(alerts.filter(a => a.id !== id))}
              />
            ))}
          </div>
        </div>
      )}

      {/* Forecast and Charts */}
      <Tabs defaultValue="forecast" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="forecast">
            <Calendar className="h-4 w-4 mr-2" />
            7-Day Forecast
          </TabsTrigger>
          <TabsTrigger value="charts">
            <TrendingUp className="h-4 w-4 mr-2" />
            Weather Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forecast" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {forecast.slice(0, 7).map((day, index) => (
              <WeatherForecastCard key={index} forecast={day} isDaily={true} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeatherChart
              data={prepareChartData()}
              type="temperature"
              title="Temperature Trend"
            />
            <WeatherChart
              data={prepareChartData()}
              type="precipitation"
              title="Precipitation Forecast"
            />
            <WeatherChart
              data={prepareChartData()}
              type="humidity"
              title="Humidity Levels"
            />
            <WeatherChart
              data={prepareChartData()}
              type="wind"
              title="Wind Speed"
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Agricultural Advisory */}
      {advisory && (
        <AgricultureAdvisoryPanel
          advisory={advisory}
          cropType={selectedCrop}
        />
      )}
    </div>
  );
};
