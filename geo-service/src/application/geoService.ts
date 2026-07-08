import { PlacesQueryDTO, Place, PlacesResponse } from '../domain/geo';
import { IGeoProvider } from './IGeoProvider';
import { ITipGenerator } from './ITipGenerator';
import { IPlaceSummaryRepository } from './IPlaceSummaryRepository';

export class GeoService {
  constructor(
    private geoProvider: IGeoProvider,
    private tipGenerator: ITipGenerator,
    private summaryCache: IPlaceSummaryRepository,
  ) {}

  async searchNearby(query: PlacesQueryDTO): Promise<PlacesResponse> {
    const places = await this.geoProvider.searchNearby(query);

    const placesConTips = await Promise.all(
      places.map(async (place) => {
        const tip = await this.obtenerTip(place);
        return { ...place, tip };
      }),
    );

    return {
      places: placesConTips,
      totalResults: places.length,
      query,
    };
  }

  private async obtenerTip(place: Place): Promise<string> {
    try {
      const cached = await this.summaryCache.findByPlaceId(place.id);
      if (cached) {
        return cached.tip;
      }
      const result = await this.tipGenerator.generateTip(
        place.name,
        place.address,
        place.types,
        place.rating,
      );
      this.summaryCache.save({
        placeId: place.id,
        name: place.name,
        address: place.address,
        tip: result.tip,
      }).catch(err => console.error('Error al guardar tip en caché:', err));

      return result.tip;
    } catch (error) {
      console.error(`Error al obtener tip para ${place.name}:`, error);
      return `${place.name} — ${place.types[0] || 'lugar'} recomendado. ⭐ ${place.rating}/5`;
    }
  }
}
