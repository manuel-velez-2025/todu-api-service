export interface TipResult {
  tip: string;
}

export interface ITipGenerator {
  generateTip(name: string, address: string, types: string[], rating: number): Promise<TipResult>;
}
