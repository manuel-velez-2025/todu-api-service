import { PlacesQueryDTO, PlacesResponse } from '../domain/geo';
import { IGeoProvider } from './IGeoProvider';

export class GeoService {
  constructor(private geoProvider: IGeoProvider) {}

  async searchNearby(query: PlacesQueryDTO): Promise<PlacesResponse> {
    const places = await this.geoProvider.searchNearby(query);

    return {
      places,
      totalResults: places.length,
      query,
    };
  }
}
