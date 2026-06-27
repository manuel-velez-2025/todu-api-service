import 'dotenv/config';
import express from 'express';
import rutas from './infrastructure/http/routes';

const app = express();
app.use(express.json());

app.use('/api', rutas);

app.listen(3000, () => {
  console.log(' Todú API corriendo en http://localhost:3000');
});