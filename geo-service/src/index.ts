import express from 'express';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', servicio: 'geo-service' });
});

app.listen(3005, () => {
  console.log('geo-service corriendo en http://localhost:3005');
});

export default app;
