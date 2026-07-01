import { Request, Response } from 'express';
import { GeoService } from '../../application/geoService';

export class GeoController {
  constructor(private geoService: GeoService) {}

  searchNearby = async (req: Request, res: Response): Promise<void> => {
    try {
      const { lat, lng, radius, type, keyword } = req.query;

      if (!lat || !lng) {
        res.status(400).json({ mensaje: 'lat y lng son requeridos' });
        return;
      }

      const latNum = parseFloat(String(lat));
      const lngNum = parseFloat(String(lng));

      if (isNaN(latNum) || isNaN(lngNum)) {
        res.status(400).json({ mensaje: 'lat y lng deben ser numeros validos' });
        return;
      }

      const result = await this.geoService.searchNearby({
        lat: latNum,
        lng: lngNum,
        radius: radius ? parseInt(radius as string, 10) : undefined,
        type: type as string,
        keyword: keyword as string,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('Error en searchNearby:', error);
      res.status(500).json({ mensaje: 'Error al buscar lugares cercanos' });
    }
  };
}
