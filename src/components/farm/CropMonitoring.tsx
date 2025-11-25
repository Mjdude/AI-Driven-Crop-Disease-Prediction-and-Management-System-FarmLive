import React, { useState, useRef } from 'react';
import { Camera, MapPin, Calendar, TrendingUp, Upload, AlertCircle, CheckCircle, Loader, X, Sprout, Calculator, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FieldMap } from './FieldMap';
import { GrowthStageDialog } from './GrowthStageDialog';
import { YieldPredictionDialog } from './YieldPredictionDialog';
import { Button } from '@/components/ui/button';

export const CropMonitoring: React.FC = () => {
  const { t } = useTranslation();
  // Existing State for Disease Detection
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New State for Dialogs
  const [showFieldMap, setShowFieldMap] = useState(false);
  const [showGrowthStage, setShowGrowthStage] = useState(false);
  const [showYieldPrediction, setShowYieldPrediction] = useState(false);

  // Existing Handlers for Disease Detection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setPrediction(null);
      setError(null);
      setShowModal(true);
    }
  };

  const handlePrediction = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setPrediction(result);
      } else {
        setError(result.error || t('crop_monitoring.disease_detection.prediction_failed'));
      }
    } catch (err) {
      setError(t('crop_monitoring.disease_detection.server_connection_error'));
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setPrediction(null);
    setError(null);
    setShowModal(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-green-400 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold font-poppins mb-2">{t('crop_monitoring.title')}</h1>
        <p className="text-green-100 text-lg">{t('crop_monitoring.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Disease Detection Card (Existing) */}
        <div className="metric-card">
          <div className="flex items-center space-x-3 mb-4">
            <Camera className="text-green-500" size={24} />
            <h3 className="text-lg font-semibold">{t('crop_monitoring.disease_detection.title')}</h3>
          </div>
          <p className="text-gray-600 mb-4">{t('crop_monitoring.disease_detection.description')}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <button
            onClick={openFileDialog}
            className="farm-button w-full flex items-center justify-center space-x-2"
          >
            <Upload size={20} />
            <span>{t('crop_monitoring.disease_detection.upload_button')}</span>
          </button>
        </div>

        {/* Field Mapping Card (Updated) */}
        <div className="metric-card">
          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="text-blue-500" size={24} />
            <h3 className="text-lg font-semibold">{t('crop_monitoring.field_mapping.title')}</h3>
          </div>
          <p className="text-gray-600 mb-4">{t('crop_monitoring.field_mapping.description')}</p>
          <button
            onClick={() => setShowFieldMap(!showFieldMap)}
            className={`farm-button w-full flex items-center justify-center gap-2 ${showFieldMap ? 'bg-blue-600 text-white' : ''}`}
          >
            {showFieldMap ? (
              <>
                <ChevronUp size={18} />
                {t('crop_monitoring.field_mapping.hide_maps') || 'Hide Maps'}
              </>
            ) : (
              <>
                <ChevronDown size={18} />
                {t('crop_monitoring.field_mapping.view_maps')}
              </>
            )}
          </button>
        </div>

        {/* Health Analytics Card (Updated) */}
        <div className="metric-card">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="text-purple-500" size={24} />
            <h3 className="text-lg font-semibold">{t('crop_monitoring.health_analytics.title')}</h3>
          </div>
          <p className="text-gray-600 mb-4">{t('crop_monitoring.health_analytics.description')}</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowGrowthStage(true)}
            >
              <Sprout className="mr-2 h-4 w-4" />
              {t('crop_monitoring.health_analytics.growth_button')}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowYieldPrediction(true)}
            >
              <Calculator className="mr-2 h-4 w-4" />
              {t('crop_monitoring.health_analytics.yield_button')}
            </Button>
          </div>
        </div>
      </div>

      {/* Embedded Field Map Section */}
      {showFieldMap && (
        <div className="bg-white rounded-xl shadow-md p-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <FieldMap onClose={() => setShowFieldMap(false)} />
        </div>
      )}

      {/* Recent Scans Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{t('crop_monitoring.health_analytics.recent_scans')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 bg-green-50">
            <div className="text-sm text-gray-500 mb-1">{t('common.today')}, 2:30 PM</div>
            <div className="font-semibold text-green-700">Tomato - {t('crop_monitoring.field_mapping.legend.healthy')}</div>
            <div className="text-sm text-gray-600">{t('crop_monitoring.health_analytics.confidence')}: 94%</div>
          </div>
          <div className="border rounded-lg p-4 bg-yellow-50">
            <div className="text-sm text-gray-500 mb-1">{t('common.today')}, 4:15 PM</div>
            <div className="font-semibold text-yellow-700">Potato - Early Blight</div>
            <div className="text-sm text-gray-600">{t('crop_monitoring.health_analytics.confidence')}: 89%</div>
          </div>
          <div className="border rounded-lg p-4 bg-red-50">
            <div className="text-sm text-gray-500 mb-1">2 days ago, 1:20 PM</div>
            <div className="font-semibold text-red-700">Tomato - Late Blight</div>
            <div className="text-sm text-gray-600">{t('crop_monitoring.health_analytics.confidence')}: 96%</div>
          </div>
        </div>
      </div>

      {/* Disease Detection Modal (Existing) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{t('crop_monitoring.disease_detection.results_title')}</h2>
                <button onClick={resetModal} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              {imagePreview && (
                <div className="mb-6 text-center">
                  <img
                    src={imagePreview}
                    alt="Uploaded crop"
                    className="max-w-md max-h-80 mx-auto rounded-lg shadow-md object-contain"
                  />
                </div>
              )}

              {!prediction && !loading && (
                <div className="text-center mb-6">
                  <button
                    onClick={handlePrediction}
                    disabled={loading}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    {t('crop_monitoring.disease_detection.analyze_button')}
                  </button>
                </div>
              )}

              {loading && (
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader className="animate-spin text-green-600" size={24} />
                    <span className="text-lg font-medium text-gray-700">{t('crop_monitoring.disease_detection.analyzing')}</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="text-red-500 mr-2" size={20} />
                    <span className="text-red-700">{error}</span>
                  </div>
                </div>
              )}

              {prediction && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <CheckCircle className="text-green-500 mr-2" size={24} />
                      <h3 className="text-xl font-semibold">{t('crop_monitoring.disease_detection.analysis_complete')}</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">{t('crop_monitoring.disease_detection.detected_condition')}:</h4>
                        <p className="text-lg font-bold text-gray-900 mb-4">
                          {prediction.disease.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
                        </p>

                        <h4 className="font-semibold text-gray-700 mb-2">{t('crop_monitoring.disease_detection.confidence_level')}:</h4>
                        <div className="flex items-center mb-4">
                          <div className="w-full bg-gray-200 rounded-full h-3 mr-3">
                            <div
                              className={`h-3 rounded-full ${prediction.confidence > 80 ? 'bg-green-500' :
                                prediction.confidence > 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                              style={{ width: `${prediction.confidence}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">
                            {prediction.confidence}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">{t('crop_monitoring.disease_detection.recommended_treatment')}:</h4>
                        <p className="text-gray-600 mb-4 bg-blue-50 p-3 rounded-lg">
                          {prediction.treatment}
                        </p>

                        {prediction.recommendations && (
                          <>
                            <h4 className="font-semibold text-gray-700 mb-2">{t('crop_monitoring.disease_detection.additional_steps')}:</h4>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                              {prediction.recommendations.map((rec: string, index: number) => (
                                <li key={index}>{rec}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={resetModal}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      {t('crop_monitoring.disease_detection.close')}
                    </button>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      {t('crop_monitoring.disease_detection.save_history')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Dialogs */}
      <GrowthStageDialog open={showGrowthStage} onOpenChange={setShowGrowthStage} />
      <YieldPredictionDialog open={showYieldPrediction} onOpenChange={setShowYieldPrediction} />
    </div>
  );
};