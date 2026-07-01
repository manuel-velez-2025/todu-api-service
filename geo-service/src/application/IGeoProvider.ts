import { Place, PlacesQueryDTO } from '../domain/geo';

export interface IGeoProvider {
  searchNearby(query: PlacesQueryDTO): Promise<Place[]>;
}
