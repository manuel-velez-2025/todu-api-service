import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares obligatorios para la materia AWOS
app.use(cors()); // Permite que el cliente de Next.js se conecte
app.use(express.json()); // El servidor solo habla y entiende JSON

// Endpoint de prueba (El contrato inicial)
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'El cerebro de Todú está en línea y funcionando.',
    timestamp: new Date()
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
});
