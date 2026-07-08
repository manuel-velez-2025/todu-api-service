export interface PlaceSummaryCache {
  placeId: string;
  name: string;
  address: string;
  tip: string;
}

export interface IPlaceSummaryRepository {
  findByPlaceId(placeId: string): Promise<PlaceSummaryCache | null>;
  save(summary: PlaceSummaryCache): Promise<void>;
}
