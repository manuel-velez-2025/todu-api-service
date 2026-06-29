export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  xpValor: number;
  estado: boolean;
  fechaCreacion: Date;
}

export interface CreateTaskDTO {
  titulo: string;
  descripcion: string;
  xpValor: number;
}