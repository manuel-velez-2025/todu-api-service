import Anthropic from '@anthropic-ai/sdk';
import { ITipGenerator, TipResult } from '../../application/ITipGenerator';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

export class ClaudeTipAdapter implements ITipGenerator {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  }

  async generateTip(name: string, address: string, types: string[], rating: number): Promise<TipResult> {
    const tipoPrincipal = types[0] || 'place';
    const emoji = this.obtenerEmoji(tipoPrincipal);

    const response = await this.client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 150,
      messages: [{
        role: 'user',
        content: `Genera un tip motivacional breve y útil para un estudiante de productividad (app Todú) sobre este lugar cercano:

Nombre: ${name}
Dirección: ${address}
Tipo: ${tipoPrincipal}
Rating: ${rating}/5

Reglas:
- Máximo 2 oraciones.
- Relacionado con productividad, estudio o bienestar.
- Usa el emoji ${emoji} al inicio.
- Responde SOLO con el texto del tip, sin JSON ni formato adicional.`,
      }],
    });

    const text = (response.content[0] as any).text.trim();

    return { tip: text };
  }

  private obtenerEmoji(type: string): string {
    const emojis: Record<string, string> = {
      restaurant: '🍽️',
      cafe: '☕',
      bar: '🍺',
      park: '🌳',
      museum: '🏛️',
      gym: '💪',
      library: '📚',
      bookstore: '📖',
      university: '🎓',
      school: '🏫',
      supermarket: '🛒',
      pharmacy: '💊',
      hospital: '🏥',
      bakery: '🥐',
      shopping_mall: '🛍️',
      movie_theater: '🎬',
      stadium: '🏟️',
      spa: '🧖',
      laundry: '👕',
      gas_station: '⛽',
    };
    return emojis[type] || '📍';
  }
}
