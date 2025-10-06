import React, { useEffect, useRef, useState } from 'react';
import { Loader, MapPin } from 'lucide-react';
import { SensorData, aqiConfig, statusConfig } from '@/types/map';

interface LeafletMap {
    setView: (center: [number, number], zoom: number) => any;
    on: (event: string, handler: (e: any) => void) => void;
    remove: () => void;
}

interface LeafletMarker {
    setLatLng: (latlng: [number, number]) => any;
    addTo: (map: LeafletMap | null) => any;
    remove: () => void;
}

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        L: {
            map: (id: string) => LeafletMap;
            tileLayer: (url: string, options: any) => any;
            marker: (latlng: [number, number], options?: any) => LeafletMarker;
            icon: (options: any) => any;
            divIcon: (options: any) => any;
        };
    }
}

const SensorsMapComponent: React.FC<{
    sensors: SensorData[];
    onSensorHover: (sensor: SensorData | null, position?: { x: number; y: number }) => void;
    onSensorClick: (sensor: SensorData) => void;
}> = ({ sensors, onSensorHover, onSensorClick }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<LeafletMap | null>(null);
    const markersRef = useRef<LeafletMarker[]>([]);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [mapError, setMapError] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Ensure component only renders on client side
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Load Leaflet dynamically with multiple CDN fallbacks
    const loadLeaflet = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            // Check if Leaflet is already loaded
            if (window.L) {
                resolve();
                return;
            }

            const cdnUrls = [
                {
                    css: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
                    js: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
                },
                {
                    css: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css',
                    js: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'
                },
                {
                    css: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css',
                    js: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js'
                }
            ];

            let currentCdnIndex = 0;

            const tryLoadFromCdn = () => {
                if (currentCdnIndex >= cdnUrls.length) {
                    reject(new Error('Failed to load Leaflet from all CDN sources'));
                    return;
                }

                const cdn = cdnUrls[currentCdnIndex];
                console.log(`Attempting to load Leaflet from CDN ${currentCdnIndex + 1}:`, cdn.js);

                // Remove any existing leaflet elements
                const existingCss = document.querySelector('link[href*="leaflet"]');
                const existingJs = document.querySelector('script[src*="leaflet"]');
                if (existingCss) existingCss.remove();
                if (existingJs) existingJs.remove();

                const cssLink = document.createElement('link');
                cssLink.rel = 'stylesheet';
                cssLink.href = cdn.css;
                cssLink.crossOrigin = 'anonymous';
                document.head.appendChild(cssLink);

                const script = document.createElement('script');
                script.src = cdn.js;
                script.crossOrigin = 'anonymous';
                script.async = true;

                const timeout = setTimeout(() => {
                    console.warn(`Timeout loading from CDN ${currentCdnIndex + 1}, trying next...`);
                    currentCdnIndex++;
                    tryLoadFromCdn();
                }, 10000); // 10 second timeout

                script.onload = () => {
                    clearTimeout(timeout);
                    if (window.L) {
                        console.log(`Successfully loaded Leaflet from CDN ${currentCdnIndex + 1}`);
                        resolve();
                    } else {
                        console.warn(`Script loaded but Leaflet not available from CDN ${currentCdnIndex + 1}`);
                        currentCdnIndex++;
                        tryLoadFromCdn();
                    }
                };

                script.onerror = (error) => {
                    clearTimeout(timeout);
                    console.warn(`Failed to load from CDN ${currentCdnIndex + 1}:`, error);
                    currentCdnIndex++;
                    tryLoadFromCdn();
                };

                document.head.appendChild(script);
            };

            tryLoadFromCdn();
        });
    };

    // Initialize map
    const initializeMap = async () => {
        try {
            setIsLoading(true);
            setMapError(null);

            console.log('Starting sensors map initialization...');
            await loadLeaflet();
            console.log('Leaflet loaded successfully');

            if (!mapRef.current || !window.L) {
                throw new Error('Map container or Leaflet not available');
            }

            // Create map centered on Sri Lanka
            console.log('Creating sensors map instance...');
            const map = window.L.map(mapRef.current.id).setView([7.8731, 80.7718], 8);
            mapInstanceRef.current = map;

            // Add tile layer
            console.log('Adding tile layer...');
            const tileLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18,
                minZoom: 6,
                errorTileUrl: 'data:image/svg+xml;base64,' + btoa(`
          <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
            <rect width="256" height="256" fill="#f3f4f6"/>
            <text x="128" y="128" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="14" fill="#6b7280">
              Tile not available
            </text>
          </svg>
        `)
            });

            tileLayer.addTo(map);

            console.log('Sensors map initialization completed successfully');
            setIsMapLoaded(true);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to initialize sensors map:', error);
            setMapError(`Failed to load map: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setIsLoading(false);
        }
    };

    // Initialize map on component mount
    useEffect(() => {
        if (!isMounted) return;

        const mapId = `sensors-map-${Math.random().toString(36).substr(2, 9)}`;
        if (mapRef.current) {
            mapRef.current.id = mapId;
        }

        initializeMap();

        // Cleanup on unmount
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
            }
        };
    }, [isMounted]);

    // Update markers when sensors change
    useEffect(() => {
        if (!isMapLoaded || !mapInstanceRef.current || !window.L) return;

        console.log(`Updating ${sensors.length} sensor markers...`);

        // Clear existing markers
        markersRef.current.forEach(marker => {
            try {
                marker.remove();
            } catch (error) {
                console.warn('Error removing marker:', error);
            }
        });
        markersRef.current = [];

        // Add new markers
        sensors.forEach(sensor => {
            try {
                const aqiData = aqiConfig[sensor.aqiCategory];
                const statusData = statusConfig[sensor.status];

                if (!aqiData || !statusData) {
                    console.warn('Missing config for sensor:', sensor.sensorId);
                    return;
                }

                // Create custom marker icon
                const markerIcon = window.L.divIcon({
                    html: `
            <div style="position: relative; width: 32px; height: 32px;">
              <div style="
                width: 32px; 
                height: 32px; 
                border-radius: 50%; 
                border: 2px solid white; 
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                color: white; 
                font-weight: bold; 
                font-size: 11px;
                background-color: ${aqiData.color};
                cursor: pointer;
                transition: transform 0.2s ease;
              " 
              onmouseover="this.style.transform='scale(1.1)'" 
              onmouseout="this.style.transform='scale(1)'">
                ${sensor.aqiValue}
              </div>
              <div style="
                position: absolute; 
                top: -2px; 
                right: -2px; 
                width: 12px; 
                height: 12px; 
                border-radius: 50%; 
                border: 1px solid white;
                background-color: ${statusData.color};
              "></div>
            </div>
          `,
                    className: 'custom-sensor-marker',
                    iconSize: [32, 32],
                    iconAnchor: [16, 16]
                });


                const marker = window.L.marker([sensor.latitude, sensor.longitude], {
                    icon: markerIcon
                }).addTo(mapInstanceRef.current!);

                // Add hover events
                marker.on('mouseover', (e: any) => {
                    const rect = mapRef.current?.getBoundingClientRect();
                    if (rect) {
                        onSensorHover(sensor, {
                            x: e.originalEvent.clientX - rect.left,
                            y: e.originalEvent.clientY - rect.top
                        });
                    }
                });

                marker.on('mouseout', () => {
                    // Don't hide immediately to allow interaction with popup
                    setTimeout(() => onSensorHover(null), 1200);
                });

                marker.on('click', () => {
                    onSensorClick(sensor);
                });

                markersRef.current.push(marker);
            } catch (error) {
                console.warn('Failed to create marker for sensor:', sensor.sensorId, error);
            }
        });

        console.log(`Successfully added ${markersRef.current.length} markers`);
    }, [sensors, isMapLoaded]);

    if (!isMounted) {
        return (
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-orange-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-8 h-8 text-lime-600 animate-spin mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">Initializing map...</p>
                </div>
            </div>
        );
    }

    if (mapError) {
        return (
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-orange-100 rounded-xl flex items-center justify-center">
                <div className="text-center p-6">
                    <MapPin className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                    <p className="text-orange-500 font-medium mb-2">Map failed to load</p>
                    <p className="text-gray-500 text-sm mb-4">{mapError}</p>
                    <button
                        onClick={initializeMap}
                        className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-emerald-950 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative rounded-xl overflow-hidden">
            <div ref={mapRef} className="w-full h-full" />

            {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-orange-100 flex items-center justify-center">
                    <div className="text-center">
                        <Loader className="w-8 h-8 text-lime-600 animate-spin mx-auto mb-2" />
                        <p className="text-gray-600 font-medium">Loading sensors map...</p>
                    </div>
                </div>
            )}

            {isMapLoaded && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                    <p className="text-xs text-gray-600 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {sensors.length} sensors displayed
                    </p>
                </div>
            )}
        </div>
    );
};

export default SensorsMapComponent;