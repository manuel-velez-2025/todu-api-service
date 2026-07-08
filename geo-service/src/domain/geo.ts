export interface Place {
  id: string;
  name: string;
  address: string;
  rating: number;
  userRatingsTotal: number;
  priceLevel?: number;
  types: string[];
  geometry: {
    lat: number;
    lng: number;
  };
  photoRef?: string;
  openNow?: boolean;
  tip?: string;
}

export interface PlacesQueryDTO {
  lat: number;
  lng: number;
  radius?: number;
  type?: string;
  keyword?: string;
}

export interface PlacesResponse {
  places: Place[];
  totalResults: number;
  query: PlacesQueryDTO;
}

export interface NearbyPlace {
  name: string;
  address: string;
  rating: number;
  type: string;
}
