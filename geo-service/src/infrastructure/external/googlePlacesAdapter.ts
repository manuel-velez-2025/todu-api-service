import { Place, PlacesQueryDTO } from '../../domain/geo';
import { IGeoProvider } from '../../application/IGeoProvider';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';
const PLACES_API_BASE = 'https://maps.googleapis.com/maps/api/place';

interface GooglePlacesResult {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  types: string[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: { photo_reference: string }[];
  opening_hours?: { open_now: boolean };
}

export class GooglePlacesAdapter implements IGeoProvider {
  async searchNearby(query: PlacesQueryDTO): Promise<Place[]> {
    const radius = query.radius ?? 1500;
    const type = query.type ? `&type=${query.type}` : '';
    const keyword = query.keyword ? `&keyword=${encodeURIComponent(query.keyword)}` : '';

    const url = `${PLACES_API_BASE}/nearbysearch/json?location=${query.lat},${query.lng}&radius=${radius}${type}${keyword}&key=${GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status, data.error_message);
      return [];
    }

    if (data.status === 'ZERO_RESULTS' || !data.results) {
      return [];
    }

    return data.results.map((result: GooglePlacesResult) => ({
      id: result.place_id,
      name: result.name,
      address: result.vicinity || '',
      rating: result.rating ?? 0,
      userRatingsTotal: result.user_ratings_total ?? 0,
      priceLevel: result.price_level,
      types: result.types,
      geometry: {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      },
      photoRef: result.photos?.[0]?.photo_reference,
      openNow: result.opening_hours?.open_now,
    }));
  }
}
