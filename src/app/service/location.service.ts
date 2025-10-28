import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface GeoLocation {
    lat: number;
    lon: number;
    accuracy?: number;
    source: 'gps' | 'ip';
    city?: string;
    country?: string;
    countryCode?: string;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
    constructor(private http: HttpClient) { }

    /** Try browser geolocation first, then fall back to IP-based lookup */
    async getLocation(timeoutMs: number = 6000): Promise<GeoLocation | null> {
        const gps = await this.getGpsPosition(timeoutMs).catch(() => null);
        if (gps) {
            return gps;
        }

        const ipLoc = await this.getIpLocation().catch(() => null);

        if (!ipLoc) {
            // For local development, provide a fallback location
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                return {
                    lat: 32.0853,
                    lon: 34.7818,
                    source: 'ip',
                    city: 'Tel Aviv',
                    country: 'Israel',
                    countryCode: 'IL'
                };
            }
        }
        return ipLoc;
    }

    private getGpsPosition(timeoutMs: number): Promise<GeoLocation> {
        if (!('geolocation' in navigator)) {
            return Promise.reject('no-geolocation');
        }
        return new Promise((resolve, reject) => {
            const onSuccess = async (pos: GeolocationPosition) => {
                const baseLocation = {
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude,
                    accuracy: pos.coords.accuracy,
                    source: 'gps' as const
                };

                // Try to get city/country via reverse geocoding
                try {
                    const geoData = await this.reverseGeocode(baseLocation.lat, baseLocation.lon);
                    resolve({ ...baseLocation, ...geoData });
                } catch {
                    // If reverse geocoding fails, return just coordinates
                    resolve(baseLocation);
                }
            };
            const onError = () => reject('gps-error');
            navigator.geolocation.getCurrentPosition(onSuccess, onError, {
                enableHighAccuracy: true,
                timeout: timeoutMs,
                maximumAge: 0
            });
        });
    }

    // Simple public IP geolocation fallback (no key). Replace with your backend proxy if desired.
    private async getIpLocation(): Promise<GeoLocation> {
        // Try ipapi.co first
        try {
            const data: any = await this.http.get('https://ipapi.co/json/').toPromise();
            if (data && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
                return {
                    lat: data.latitude,
                    lon: data.longitude,
                    source: 'ip',
                    city: data.city,
                    country: data.country_name,
                    countryCode: data.country_code
                };
            }
        } catch { }

        // Fallback to ip-api.com
        const data2: any = await this.http.get('https://ip-api.com/json').toPromise();
        if (data2 && typeof data2.lat === 'number' && typeof data2.lon === 'number') {
            return {
                lat: data2.lat,
                lon: data2.lon,
                source: 'ip',
                city: data2.city,
                country: data2.country,
                countryCode: data2.countryCode
            };
        }
        throw new Error('ip-geo-failed');
    }

    // Reverse geocoding for GPS coordinates
    private async reverseGeocode(lat: number, lon: number): Promise<{ city?: string; country?: string; countryCode?: string }> {
        try {
            // Use Nominatim (OpenStreetMap) for reverse geocoding
            const response: any = await this.http.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
            ).toPromise();

            if (response && response.address) {
                return {
                    city: response.address.city || response.address.town || response.address.village,
                    country: response.address.country,
                    countryCode: response.address.country_code?.toUpperCase()
                };
            }
        } catch { }

        return {};
    }
}


