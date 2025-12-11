import { Draw, NumberStat, StatsSummary } from '../types';

export class LotteryService {
  private history: Draw[];

  constructor(history: Draw[]) {
    this.history = history;
  }

  public getStats(): StatsSummary {
    const frequencyMap = new Map<number, number>();
    const delayMap = new Map<number, number>(); // How many draws since last seen
    const lastSeenMap = new Map<number, number>();

    // Initialize maps
    for (let i = 1; i <= 25; i++) {
      frequencyMap.set(i, 0);
      lastSeenMap.set(i, 0);
    }

    // Process history
    this.history.forEach((draw, index) => {
      draw.numbers.forEach(num => {
        frequencyMap.set(num, (frequencyMap.get(num) || 0) + 1);
        lastSeenMap.set(num, draw.id);
      });
    });

    // Calculate stats
    const allStats: NumberStat[] = [];
    const latestDrawId = this.history[this.history.length - 1].id;

    for (let i = 1; i <= 25; i++) {
      const lastId = lastSeenMap.get(i) || 0;
      allStats.push({
        number: i,
        frequency: frequencyMap.get(i) || 0,
        lastSeen: lastId,
        delay: latestDrawId - lastId
      });
    }

    // Sort for Hot/Cold
    const sortedByFreq = [...allStats].sort((a, b) => b.frequency - a.frequency);

    // Calculate Even/Odd and Sums for charts (last 50 draws for clarity)
    const recentHistory = this.history.slice(-50);
    const evenOddRatio = recentHistory.map(draw => {
      const evenCount = draw.numbers.filter(n => n % 2 === 0).length;
      return { even: evenCount, odd: 15 - evenCount, id: draw.id };
    });

    const sumHistory = recentHistory.map(draw => ({
      id: draw.id,
      sum: draw.numbers.reduce((a, b) => a + b, 0)
    }));

    return {
      hotNumbers: sortedByFreq.slice(0, 10),
      coldNumbers: sortedByFreq.slice(-10).reverse(), // Coldest first
      evenOddRatio,
      sumHistory,
      mostFrequentSequence: [] // Complex implementation skipped for brevity
    };
  }

  public checkGame(playedNumbers: number[]): { matches: number; drawId: number }[] {
    const results: { matches: number; drawId: number }[] = [];
    
    // Check against last 100 draws for performance in UI
    const recent = this.history.slice(-100);
    
    recent.forEach(draw => {
      const matchCount = draw.numbers.filter(n => playedNumbers.includes(n)).length;
      if (matchCount >= 11) {
        results.push({ matches: matchCount, drawId: draw.id });
      }
    });
    
    return results.sort((a, b) => b.matches - a.matches);
  }
  
  public getAllStatsSorted(): NumberStat[] {
    const stats = this.getStats();
    // Re-calculate full list because getStats slices hot/cold
    // This is a helper for the heatmap
    const frequencyMap = new Map<number, number>();
     this.history.forEach(draw => {
      draw.numbers.forEach(num => {
        frequencyMap.set(num, (frequencyMap.get(num) || 0) + 1);
      });
    });
    const list = [];
     for (let i = 1; i <= 25; i++) {
       list.push({
         number: i,
         frequency: frequencyMap.get(i) || 0,
         delay: 0, 
         lastSeen: 0
       });
     }
     return list.sort((a, b) => a.number - b.number);
  }
}