import express from 'express';
import { authRouter } from './infrastructure/http/routes'; 

const app = express();
app.use(express.json());

app.use('/auth', authRouter); 

app.listen(3001, () => {
  console.log('User-service corriendo en http://localhost:3001');
});