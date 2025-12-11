import { Draw } from '../types';

// Helper to generate a random integer between min and max
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generates a sorted array of 15 unique numbers between 1 and 25
const generateDrawNumbers = (): number[] => {
  const nums = new Set<number>();
  while (nums.size < 15) {
    nums.add(getRandomInt(1, 25));
  }
  return Array.from(nums).sort((a, b) => a - b);
};

export const generateMockHistory = (count: number = 500): Draw[] => {
  const history: Draw[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const drawDate = new Date(today);
    drawDate.setDate(today.getDate() - (count - i)); // Past dates

    history.push({
      id: 3000 - (count - 1) + i, // Simulating current contest around 3000
      date: drawDate.toLocaleDateString('pt-BR'),
      numbers: generateDrawNumbers(),
    });
  }
  return history;
};

export const MOCK_HISTORY = generateMockHistory(500);