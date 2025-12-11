import React, { useState, useMemo } from 'react';
import { LotteryService } from '../services/lotteryService';
import { MOCK_HISTORY } from '../services/mockDataService';
import { GameStrategy, GeneratedGame } from '../types';
import { Wand2, RefreshCw, Copy, CheckCircle } from 'lucide-react';

const GameGenerator: React.FC = () => {
  const service = useMemo(() => new LotteryService(MOCK_HISTORY), []);
  const [games, setGames] = useState<GeneratedGame[]>([]);
  const [quantity, setQuantity] = useState(5);
  const [strategy, setStrategy] = useState<GameStrategy>(GameStrategy.BALANCED);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = () => {
    const stats = service.getStats();
    const newGames: GeneratedGame[] = [];

    const hot = stats.hotNumbers.map(n => n.number);
    const cold = stats.coldNumbers.map(n => n.number);
    // Middle numbers are those not in top 10 hot or top 10 cold
    const allNums = Array.from({ length: 25 }, (_, i) => i + 1);
    const middle = allNums.filter(n => !hot.includes(n) && !cold.includes(n));

    for (let i = 0; i < quantity; i++) {
      let selected: number[] = [];
      let reasoning = "";

      switch (strategy) {
        case GameStrategy.HOT_HEAVY:
          // 9 hot, 2 cold, 4 middle
          selected = [
            ...shuffle(hot).slice(0, 9),
            ...shuffle(cold).slice(0, 2),
            ...shuffle(middle).slice(0, 4)
          ];
          reasoning = "Estratégia agressiva focada em repetição de tendências recentes.";
          break;

        case GameStrategy.COLD_RECOVERY:
          // 8 cold, 4 hot, 3 middle
          selected = [
            ...shuffle(hot).slice(0, 4),
            ...shuffle(cold).slice(0, 8),
            ...shuffle(middle).slice(0, 3)
          ];
          reasoning = "Aposta na 'Lei dos Grandes Números', esperando retorno dos atrasados.";
          break;

        case GameStrategy.RANDOM:
          selected = shuffle(allNums).slice(0, 15);
          reasoning = "Geração pseudo-aleatória completa (Surpresinha).";
          break;

        case GameStrategy.BALANCED:
        default:
          // 6 hot, 4 cold, 5 middle (Standard statistical approach)
          selected = [
            ...shuffle(hot).slice(0, 6),
            ...shuffle(cold).slice(0, 4),
            ...shuffle(middle).slice(0, 5)
          ];
          reasoning = "Equilíbrio estatístico ideal: mistura de quentes, frias e neutras.";
          break;
      }

      // Sort numerically
      selected.sort((a, b) => a - b);
      newGames.push({
        numbers: selected,
        strategy: strategy,
        reasoning: reasoning
      });
    }

    setGames(newGames);
  };

  const shuffle = (array: number[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const copyToClipboard = (numbers: number[], idx: number) => {
    navigator.clipboard.writeText(numbers.join(', '));
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-loto-green/10">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Estratégia de Geração</label>
            <select 
              value={strategy} 
              onChange={(e) => setStrategy(e.target.value as GameStrategy)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-loto-green focus:border-loto-green transition-all"
            >
              {Object.values(GameStrategy).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-32">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
            <select 
              value={quantity} 
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-loto-green focus:border-loto-green"
            >
              <option value={1}>1 Jogo</option>
              <option value={5}>5 Jogos</option>
              <option value={10}>10 Jogos</option>
              <option value={15}>15 Jogos</option>
            </select>
          </div>
          <button 
            onClick={generate}
            className="w-full md:w-auto bg-loto-gold hover:bg-loto-goldhov text-loto-green font-bold py-3 px-8 rounded-lg shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Wand2 size={20} />
            Gerar Jogos
          </button>
        </div>
      </div>

      {games.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-loto-green flex items-center gap-2">
            <RefreshCw size={24} /> Jogos Sugeridos
          </h3>
          <div className="grid gap-4">
            {games.map((game, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border-l-4 border-loto-gold shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                  <div className="flex flex-wrap gap-2">
                    {game.numbers.map(n => (
                      <span key={n} className={`
                        w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold shadow-sm
                        ${n <= 10 ? 'bg-emerald-100 text-emerald-800' : n <= 20 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}
                      `}>
                        {n}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => copyToClipboard(game.numbers, idx)}
                    className="text-gray-400 hover:text-loto-green transition-colors p-1"
                    title="Copiar números"
                  >
                    {copiedIndex === idx ? <CheckCircle size={20} className="text-green-500"/> : <Copy size={20} />}
                  </button>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2 border-gray-100">
                  <span className="font-medium bg-gray-100 px-2 py-1 rounded">{game.strategy}</span>
                  <span className="italic">{game.reasoning}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameGenerator;