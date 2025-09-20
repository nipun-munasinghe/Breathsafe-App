import React, {useEffect, useRef, useState} from 'react';
import {MapPin, Loader} from 'lucide-react';

interface MapSelectorProps {
    onLocationSelect: (lat: number, lng: number, address: string) => void;
    selectedLat?: number;
    selectedLng?: number;
    className?: string;
}

interface LeafletMap {
    setView: (center: [number, number], zoom: number) => any;
    on: (event: string, handler: (e: any) => void) => void;
    remove: () => void;
}

interface LeafletMarker {
    setLatLng: (latlng: [number, number]) => any;
    addTo: (map: LeafletMap) => any;
    remove: () => void;
}

// Declare Leaflet globals
declare global {
    interface Window {
        L: {
            map: (id: string) => LeafletMap;
            tileLayer: (url: string, options: any) => any;
            marker: (latlng: [number, number], options?: any) => LeafletMarker;
            icon: (options: any) => any;
        };
    }
}

const MapSelector: React.FC<MapSelectorProps> = ({
                                                     onLocationSelect,
                                                     selectedLat,
                                                     selectedLng,
                                                     className = "w-full h-64"
                                                 }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<LeafletMap | null>(null);
    const markerRef = useRef<LeafletMarker | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [mapError, setMapError] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Ensure component only renders on client side
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Reverse geocoding function (basic implementation)
    const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
        try {
            // Using Nominatim (OpenStreetMap's geocoding service)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
            );

            if (!response.ok) throw new Error('Geocoding failed');

            const data = await response.json();

            // Format address for Sri Lanka
            const parts = [];
            if (data.address?.road) parts.push(data.address.road);
            if (data.address?.suburb) parts.push(data.address.suburb);
            if (data.address?.city) parts.push(data.address.city);
            if (data.address?.town) parts.push(data.address.town);
            if (data.address?.county) parts.push(data.address.county);
            if (data.address?.state_district) parts.push(data.address.state_district);

            return parts.length > 0 ? parts.join(', ') + ', Sri Lanka' : 'Selected Location, Sri Lanka';
        } catch (error) {
            console.warn('Reverse geocoding failed:', error);
            return `Location (${lat.toFixed(4)}, ${lng.toFixed(4)}), Sri Lanka`;
        }
    };

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

                // Create CSS link
                const cssLink = document.createElement('link');
                cssLink.rel = 'stylesheet';
                cssLink.href = cdn.css;
                cssLink.crossOrigin = 'anonymous';
                document.head.appendChild(cssLink);

                // Create script tag
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

            console.log('Starting map initialization...');
            await loadLeaflet();
            console.log('Leaflet loaded successfully');

            if (!mapRef.current || !window.L) {
                throw new Error('Map container or Leaflet not available');
            }

            // Create map centered on Sri Lanka (Colombo)
            console.log('Creating map instance...');
            const map = window.L.map(mapRef.current.id).setView([6.9271, 79.8612], 8);
            mapInstanceRef.current = map;

            // Add tile layer with error handling
            console.log('Adding tile layer...');
            const tileLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
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

            // Custom marker icon
            const customIcon = window.L.icon({
                iconUrl: 'data:image/svg+xml;base64,' + btoa(`
          <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="#65A30D"/>
            <circle cx="12.5" cy="12.5" r="6" fill="white"/>
            <circle cx="12.5" cy="12.5" r="3" fill="#65A30D"/>
          </svg>
        `),
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
            });

            // Add existing marker if coordinates exist
            if (selectedLat && selectedLng) {
                console.log('Adding existing marker...');
                const marker = window.L.marker([selectedLat, selectedLng], {icon: customIcon}).addTo(map);
                markerRef.current = marker;
                map.setView([selectedLat, selectedLng], 13);
            }

            // Handle map clicks
            map.on('click', async (e: any) => {
                console.log('Map clicked at:', e.latlng);
                const {lat, lng} = e.latlng;

                // Remove existing marker
                if (markerRef.current) {
                    markerRef.current.remove();
                }

                // Add new marker
                const marker = window.L.marker([lat, lng], {icon: customIcon}).addTo(map);
                markerRef.current = marker;

                // Get address and call callback
                const address = await reverseGeocode(lat, lng);
                onLocationSelect(lat, lng, address);
            });

            console.log('Map initialization completed successfully');
            setIsMapLoaded(true);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to initialize map:', error);
            setMapError(`Failed to load map: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setIsLoading(false);
        }
    };

    // Initialize map on component mount
    useEffect(() => {
        if (!isMounted) return;

        const mapId = `map-${Math.random().toString(36).substr(2, 9)}`;
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

    // Update marker when coordinates change
    useEffect(() => {
        if (isMapLoaded && mapInstanceRef.current && selectedLat && selectedLng) {
            if (markerRef.current) {
                markerRef.current.setLatLng([selectedLat, selectedLng]);
            }
        }
    }, [selectedLat, selectedLng, isMapLoaded]);

    if (!isMounted) {
        return (
            <div
                className={`${className} bg-gradient-to-br from-green-100 to-orange-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center`}>
                <div className="text-center">
                    <Loader className="w-8 h-8 text-lime-600 animate-spin mx-auto mb-2"/>
                    <p className="text-gray-600 font-medium">Initializing map...</p>
                </div>
            </div>
        );
    }

    if (mapError) {
        return (
            <div
                className={`${className} bg-gradient-to-br from-green-100 to-orange-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center`}>
                <div className="text-center p-6">
                    <MapPin className="w-12 h-12 text-orange-500 mx-auto mb-2"/>
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
        <div
            className={`${className} relative rounded-lg overflow-hidden border-2 border-gray-300 hover:border-lime-600 transition-colors`}>
            <div ref={mapRef} className="w-full h-full"/>

            {isLoading && (
                <div
                    className="absolute inset-0 bg-gradient-to-br from-green-100 to-orange-100 flex items-center justify-center">
                    <div className="text-center">
                        <Loader className="w-8 h-8 text-lime-600 animate-spin mx-auto mb-2"/>
                        <p className="text-gray-600 font-medium">Loading map...</p>
                    </div>
                </div>
            )}

            {isMapLoaded && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                    <p className="text-xs text-gray-600 flex items-center">
                        <MapPin className="w-3 h-3 mr-1"/>
                        Click anywhere to select location
                    </p>
                </div>
            )}

            {selectedLat && selectedLng && isMapLoaded && (
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                    <p className="text-sm font-medium text-slate-900">Selected Location</p>
                    <p className="text-xs text-gray-600">
                        {selectedLat.toFixed(4)}, {selectedLng.toFixed(4)}
                    </p>
                </div>
            )}
        </div>
    );
};

export default MapSelector;