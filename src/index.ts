import express from 'express';
import rutas from './infrastructure/http/routes';

const app = express();
app.use(express.json());
app.use('/api', rutas);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Todú API corriendo en http://localhost:${PORT}`);
});