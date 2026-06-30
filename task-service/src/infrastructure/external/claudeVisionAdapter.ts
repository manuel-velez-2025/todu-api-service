import Anthropic from '@anthropic-ai/sdk';
import { IVisionProvider, ValidationResult } from '../../application/IVisionProvider';

export class ClaudeVisionAdapter implements IVisionProvider {
  private client: Anthropic;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.warn('ANTHROPIC_API_KEY no configurada. Claude Vision no estará disponible.');
    }
    this.client = new Anthropic({ apiKey: apiKey || '' });
  }

  async validateEvidence(imageUrl: string, taskDescription: string): Promise<ValidationResult> {
    if (!process.env.ANTHROPIC_API_KEY) {
      return {
        approved: true,
        reason: 'Modo desarrollo: sin validación de IA',
        confidence: 'low',
      };
    }

    try {
      const response = await this.client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'url', url: imageUrl },
              },
              {
                type: 'text',
                text: `La tarea del usuario es: "${taskDescription}".
¿La imagen muestra evidencia real de haber completado esta tarea?
Responde ÚNICAMENTE con este JSON sin texto adicional:
{"approved": true/false, "reason": "explicación breve", "confidence": "high/medium/low"}`,
              },
            ],
          },
        ],
      });

      const text = (response.content[0] as any).text;
      return JSON.parse(text) as ValidationResult;
    } catch (error) {
      console.error('Error al llamar a Claude Vision:', error);
      return {
        approved: false,
        reason: 'Error al validar la imagen con IA',
        confidence: 'low',
      };
    }
  }
}
