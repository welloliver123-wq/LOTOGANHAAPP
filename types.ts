export interface Draw {
  id: number;
  date: string;
  numbers: number[];
}

export interface NumberStat {
  number: number;
  frequency: number;
  delay: number; // Concursos atrasados
  lastSeen: number; // ID do último concurso
}

export interface StatsSummary {
  hotNumbers: NumberStat[];
  coldNumbers: NumberStat[];
  evenOddRatio: { even: number; odd: number }[]; // Histórico recente
  sumHistory: { id: number; sum: number }[];
  mostFrequentSequence: number[]; // Ex: sequencia de 3 numeros
}

export interface GeneratedGame {
  numbers: number[];
  strategy: string;
  reasoning: string;
}

export enum GameStrategy {
  BALANCED = 'Equilibrado',
  HOT_HEAVY = 'Tendência Quente',
  COLD_RECOVERY = 'Recuperação Fria',
  RANDOM = 'Surpresinha Inteligente'
}