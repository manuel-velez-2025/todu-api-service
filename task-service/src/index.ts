import express from 'express';

import { taskRouter } from './infrastructure/http/routes'; 

const app = express();
app.use(express.json());

app.use('/tareas', taskRouter); 

app.listen(3002, () => {
  console.log('Task-service corriendo en http://localhost:3002');
});
