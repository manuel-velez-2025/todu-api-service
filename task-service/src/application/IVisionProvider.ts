export interface ValidationResult {
  approved: boolean;
  reason: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface IVisionProvider {
  validateEvidence(
    imageUrl: string,
    taskDescription: string
  ): Promise<ValidationResult>;
}
