import express from 'express';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', servicio: 'robot-service' });
});

app.listen(3004, () => {
  console.log('✅ robot-service corriendo en http://localhost:3004');
});

export default app;
