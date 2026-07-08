import express from 'express';
import { GooglePlacesAdapter } from './infrastructure/external/googlePlacesAdapter';
import { ClaudeTipAdapter } from './infrastructure/external/claudeTipAdapter';
import { PlaceSummaryRepository } from './infrastructure/database/placeSummaryRepository';
import { GeoService } from './application/geoService';
import { GeoController } from './infrastructure/http/geoController';
import { createGeoRouter } from './infrastructure/http/routes';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', servicio: 'geo-service' });
});

const geoProvider = new GooglePlacesAdapter();
const tipGenerator = new ClaudeTipAdapter();
const summaryCache = new PlaceSummaryRepository();
const geoService = new GeoService(geoProvider, tipGenerator, summaryCache);
const geoController = new GeoController(geoService);
const router = createGeoRouter(geoController);

app.use('/geo', router);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3005;

app.listen(PORT, () => {
  console.log(`geo-service corriendo en http://localhost:${PORT}`);
});

export default app;
