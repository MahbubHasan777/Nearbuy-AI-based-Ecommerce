export declare class GeoService {
    haversine(lat1: number, lon1: number, lat2: number, lon2: number): number;
    filterByRadius<T extends {
        lat: number;
        lng: number;
    }>(items: T[], customerLat: number, customerLng: number, radiusMeters: number): (T & {
        distanceMeters: number;
    })[];
}
