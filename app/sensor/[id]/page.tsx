'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Thermometer, Droplets, Wind, ArrowLeft, AlertCircle, Bell, BellOff, ArrowRight } from 'lucide-react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { ProtectedRoute } from '@/components/common/protectedRoute';
import SensorStatsGrid from '@/components/sensor/SensorStatsGrid';
import SensorChart from '@/components/sensor/SensorChart';
import { getSensorChartData, transformSensorData } from '@/service/admin/sensorChartApi';
import { getSensorById, getSensorDataByWeek, getSensorStats } from '@/service/admin/sensorChartApi';
import { getMySubscriptions, subscribeToSensor, unsubscribe } from '@/service/subscriptionApi';
import { Sensor, ChartData, SensorStats } from '@/types/sensors/admin';
import { SubscriptionResponse } from '@/types/subscription';
import ToastUtils from '@/utils/toastUtils';

export default function SensorDetails() {
  const params = useParams();
  const router = useRouter();
  const sensorId = params.id as string;

  const [sensor, setSensor] = useState<Sensor | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [stats, setStats] = useState<SensorStats | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //Single API call to get all data
  const fetchSensorData = useCallback(async () => {
    if (!sensorId) {
      setError('Invalid sensor ID');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`Fetching data for sensor ID: ${sensorId}`);
      
      // Try the new unified API first
      const backendData = await getSensorChartData(sensorId);
      console.log('Received backend data:', backendData);
      
      // validate response
      if (!backendData || !backendData.sensorDetails) {
        throw new Error('Invalid response from server');
      }

      //transform data to frontend format
      const { sensor: sensorData, chartData: chartDataTransformed, stats: statsData } = transformSensorData(backendData);

      console.log('Transformed data:', { sensorData, chartDataTransformed, statsData });

      setSensor(sensorData);
      setChartData(chartDataTransformed);
      setStats(statsData);

      // Fetch subscription data separately
      try {
        const subscriptionsResult = await getMySubscriptions();
        if (subscriptionsResult.success && subscriptionsResult.data) {
          const subscription = subscriptionsResult.data.find(sub => sub.sensorId === Number(sensorId));
          setCurrentSubscription(subscription || null);
        }
      } catch (subscriptionError) {
        console.error('Error fetching subscription data:', subscriptionError);
        // Don't throw here - subscription is optional
      }

    } catch (primaryError: any) {
      console.error('Error with unified API, trying fallback:', primaryError);
      
      // Fallback to individual API calls
      try {
        const [sensorResult, weekResult, statsResult, subscriptionsResult] = await Promise.all([
          getSensorById(sensorId),
          getSensorDataByWeek(sensorId),
          getSensorStats(sensorId),
          getMySubscriptions()
        ]);

        setSensor(sensorResult);
        setChartData(weekResult);
        setStats(statsResult);
        
        if (subscriptionsResult.success && subscriptionsResult.data) {
          const subscription = subscriptionsResult.data.find(sub => sub.sensorId === Number(sensorId));
          setCurrentSubscription(subscription || null);
        }

      } catch (fallbackError: any) {
        console.error('Error with fallback APIs:', fallbackError);
        
        // specific error messages
        if (fallbackError?.response?.status === 403) {
          setError('Access denied. Please check your authentication.');
        } else if (fallbackError?.response?.status === 404) {
          setError('Sensor not found. Please check the sensor ID.');
        } else if (fallbackError?.response?.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(fallbackError.message || 'Failed to load sensor data');
        }
        
        ToastUtils.error(fallbackError.message || 'Failed to load sensor data');
      }
    } finally {
      setIsLoading(false);
    }
  }, [sensorId]);

  useEffect(() => {
    fetchSensorData();
  }, [fetchSensorData]);

  const handleSubscribe = useCallback(async () => {
    setIsSubscribing(true);
    try {
      const response = await subscribeToSensor({ sensorId: Number(sensorId) });
      if (response.success && response.data) {
        setCurrentSubscription(response.data);
        ToastUtils.success('Successfully subscribed to sensor notifications');
      }
    } catch (subscribeError) {
      console.error('Subscribe error:', subscribeError);
      ToastUtils.error('Failed to subscribe to sensor');
    } finally {
      setIsSubscribing(false);
    }
  }, [sensorId]);

  const handleUnsubscribe = useCallback(async () => {
    if (!currentSubscription) return;
    setIsSubscribing(true);
    try {
      const response = await unsubscribe(currentSubscription.subscriptionId);
      if (response.success) {
        setCurrentSubscription(null);
        ToastUtils.success('Successfully unsubscribed from sensor notifications');
      }
    } catch (unsubscribeError) {
      console.error('Unsubscribe error:', unsubscribeError);
      ToastUtils.error('Failed to unsubscribe from sensor');
    } finally {
      setIsSubscribing(false);
    }
  }, [currentSubscription]);

  if (error) {
    return (
      <ProtectedRoute>
        <Header />
        <main className="min-h-screen bg-slate-50">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mt-20 text-center">
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Sensor</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-lime-600 text-white px-6 py-2 rounded-lg hover:bg-lime-700 transition"
                  >
                    Retry
                  </button>
                  <button
                    onClick={() => router.back()}
                    className="w-full bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Header />
      
      <main className="min-h-screen" style={{ background: "linear-gradient(to bottom, #064E3B 0%, #0F172A 30%, #FFFFFF 50%, #FFFFFF 100%)" }}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          
          {/* Back button */}
          <div className="mt-20 mb-6">
            <div className="flex justify-between items-center">
              <button
                onClick={() => router.back()}
                className="flex items-center text-white hover:text-lime-200 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>

              {/* --- ACTION BUTTONS GROUP --- */}
              <div className="flex items-center gap-2">
                {currentSubscription ? (
                   <button
                      onClick={handleUnsubscribe}
                      disabled={isSubscribing}
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-transparent rounded-lg hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <BellOff className="w-4 h-4 mr-2" />
                      {isSubscribing ? 'Processing...' : 'Unsubscribe'}
                    </button>
                ) : (
                  <button
                      onClick={handleSubscribe}
                      disabled={isSubscribing}
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-lime-600 border border-transparent rounded-lg hover:bg-lime-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lime-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      {isSubscribing ? 'Processing...' : 'Subscribe'}
                  </button>
                )}
                {/* --- NAVIGATION BUTTON TO SUBSCRIPTIONS PAGE --- */}
                <button
                  onClick={() => router.push('/subscriptions')}
                  title="Go to My Subscriptions"
                  className="p-2 text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lime-500"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sensor header */}
          <div className="text-center mb-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-lime-600">
              <div className="flex flex-col lg:flex-row items-center justify-center mb-6">
                <div className="bg-gradient-to-br from-lime-600 to-emerald-600 p-4 rounded-2xl mb-4 lg:mb-0 lg:mr-6 shadow-lg">
                  <Wind className="w-12 h-12 text-white" />
                </div>
                <div className="text-center lg:text-left">
                  <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2">
                    {isLoading ? 'Loading...' : sensor?.name || 'Unknown Sensor'}
                  </h1>
                  <div className="h-1 w-20 bg-gradient-to-r from-lime-600 to-emerald-600 rounded-full mx-auto lg:mx-0 mb-3"></div>
                  <div className="flex items-center justify-center lg:justify-start text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{isLoading ? 'Loading location...' : sensor?.location || 'Unknown Location'}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                Real-time air quality monitoring data including CO₂ levels and Air Quality Index measurements 
                from this sensor location. Data is updated continuously for accurate environmental monitoring.
              </p>
            </div>
          </div>

          <SensorStatsGrid 
            stats={stats || { todaysReadings: 0, sensorStatus: 'Loading...', lastAQIReading: 0, monitoring: 'Loading...' }}
            isLoading={isLoading}
          />

          {/* chart section */}
          <SensorChart 
            data={chartData || { labels: [], co2Data: [], aqiData: [] }}
            sensorName={sensor?.name || 'Sensor'}
            sensorLocation={sensor?.location}
            isLoading={isLoading}
          />

          {/* additional Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-lime-200/50">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <Thermometer className="w-5 h-5 mr-2 text-lime-600" />
                About CO₂ Monitoring
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>Carbon dioxide (CO₂) levels are measured in parts per million (ppm) and indicate air quality and ventilation effectiveness.</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-800">Good</div>
                    <div className="text-sm text-green-600">&lt;400 ppm</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="font-semibold text-yellow-800">Elevated</div>
                    <div className="text-sm text-yellow-600">400-1000 ppm</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-lime-200/50">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <Droplets className="w-5 h-5 mr-2 text-emerald-600" />
                Air Quality Index (AQI)
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>The AQI is a standardized way to measure and report daily air quality, helping you understand pollution levels.</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-800">Good</div>
                    <div className="text-sm text-green-600">0-50 AQI</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="font-semibold text-yellow-800">Moderate</div>
                    <div className="text-sm text-yellow-600">51-100 AQI</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </ProtectedRoute>
  );
}
