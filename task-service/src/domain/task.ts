export interface Tarea {
  id: string;
  usuarioId: string;
  titulo: string;
  descripcion: string;
  xpValor: number;
  estado: 'pending' | 'validating' | 'completed' | 'rejected';
  urlEvidencia?: string | null;
  proofStatus?: string | null;
  proofReason?: string | null;
  proofConfidence?: string | null;
  fechaCreacion: Date;
}

export interface CreateTaskDTO {
  titulo: string;
  descripcion: string;
  xpValor: number;
}

export interface UpdateTaskDTO {
  titulo?: string;
  descripcion?: string;
  xpValor?: number;
  estado?: string;
}
