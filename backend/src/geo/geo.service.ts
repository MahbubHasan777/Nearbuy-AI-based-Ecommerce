import { Injectable } from '@nestjs/common';

@Injectable()
export class GeoService {
  haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  filterByRadius<T extends { lat: number; lng: number }>(
    items: T[],
    customerLat: number,
    customerLng: number,
    radiusMeters: number,
  ): (T & { distanceMeters: number })[] {
    return items
      .map((item) => ({
        ...item,
        distanceMeters: this.haversine(customerLat, customerLng, item.lat, item.lng),
      }))
      .filter((item) => item.distanceMeters <= radiusMeters)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }
}
