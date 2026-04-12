export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** Greedy matching: nearest resource with coordinates */
export function nearestResourceId(
  lat: number,
  lng: number,
  resources: Array<{ _id: { toString(): string }; lat: number; lng: number }>,
): string | null {
  if (!resources.length) return null;
  let best = resources[0];
  let bestD = haversineKm(lat, lng, best.lat, best.lng);
  for (let i = 1; i < resources.length; i++) {
    const r = resources[i];
    const d = haversineKm(lat, lng, r.lat, r.lng);
    if (d < bestD) {
      best = r;
      bestD = d;
    }
  }
  return best._id.toString();
}
