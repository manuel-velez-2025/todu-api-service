import { db } from './db';
import { placeSummaries } from './schema';
import { IPlaceSummaryRepository, PlaceSummaryCache } from '../../application/IPlaceSummaryRepository';
import { eq } from 'drizzle-orm';

export class PlaceSummaryRepository implements IPlaceSummaryRepository {
  async findByPlaceId(placeId: string): Promise<PlaceSummaryCache | null> {
    const result = await db
      .select()
      .from(placeSummaries)
      .where(eq(placeSummaries.placeId, placeId))
      .limit(1);

    if (result.length === 0) return null;

    const row = result[0];
    return {
      placeId: row.placeId,
      name: row.name,
      address: row.address,
      tip: row.tip,
    };
  }

  async save(summary: PlaceSummaryCache): Promise<void> {
    await db
      .insert(placeSummaries)
      .values({
        placeId: summary.placeId,
        name: summary.name,
        address: summary.address,
        tip: summary.tip,
      })
      .onConflictDoUpdate({
        target: placeSummaries.placeId,
        set: {
          tip: summary.tip,
          updatedAt: new Date(),
        },
      });
  }
}
