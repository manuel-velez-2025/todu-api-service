import { Router } from 'express';
import { GeoController } from './geoController';

export function createGeoRouter(geoController: GeoController): Router {
  const router = Router();

  router.get('/cercanos', geoController.searchNearby);

  return router;
}
