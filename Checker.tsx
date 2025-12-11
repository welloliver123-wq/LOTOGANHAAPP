import React, { useState, useMemo } from 'react';
import { LotteryService } from '../services/lotteryService';
import { MOCK_HISTORY } from '../services/mockDataService';
import { Search, Trophy, AlertCircle } from 'lucide-react';

const Checker: React.FC = () => {
  const service = useMemo(() => new LotteryService(MOCK_HISTORY), []);
  // State for 15 inputs
  const [inputs, setInputs] = useState<string[]>(Array(15).fill(''));
  const [results, setResults] = useState<{ matches: number; drawId: number }[] | null>(null);

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers 1-25
    if (value !== '' && (Number(value) < 1 || Number(value) > 25)) return;
    
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const handleCheck = () => {
    const numbers = inputs.map(Number).filter(n => n > 0);
    // Remove duplicates
    const unique = [...new Set(numbers)];
    
    if (unique.length !== 15) {
      alert("Por favor, preencha 15 números únicos entre 1 e 25.");
      return;
    }

    const matches = service.checkGame(unique);
    setResults(matches);
  };

  const clear = () => {
    setInputs(Array(15).fill(''));
    setResults(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-loto-green/20 overflow-hidden">
        <div className="bg-loto-green p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Search /> Conferência de Jogos
          </h2>
          <p className="text-loto-green-100 opacity-80 mt-1">
            Verifique se seus números já foram sorteados nos últimos 100 concursos.
          </p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-5 gap-3 md:gap-4 mb-8">
            {inputs.map((val, idx) => (
              <input
                key={idx}
                type="number"
                value={val}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                className="w-full aspect-square text-center text-lg md:text-2xl font-bold rounded-lg border-2 border-gray-200 focus:border-loto-gold focus:ring-0 transition-colors"
                placeholder={(idx + 1).toString()}
              />
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCheck}
              className="flex-1 bg-loto-green hover:bg-emerald-800 text-white font-bold py-4 rounded-xl shadow-md transition-all"
            >
              Conferir Agora
            </button>
            <button
              onClick={clear}
              className="px-6 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-all"
            >
              Limpar
            </button>
          </div>

          {results && (
            <div className="mt-8 animate-fade-in">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                Resultado da Análise (Últimos 100)
              </h3>
              
              {results.length === 0 ? (
                <div className="p-6 bg-gray-50 rounded-xl flex items-center gap-4 text-gray-600">
                  <AlertCircle size={24} />
                  <p>Este jogo nunca premiou com 11 ou mais pontos nos últimos 100 concursos.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {results.map((res, i) => (
                    <div key={i} className={`
                      flex justify-between items-center p-4 rounded-lg
                      ${res.matches === 15 ? 'bg-loto-gold text-loto-green' : 'bg-gray-50 text-gray-700'}
                    `}>
                      <span className="font-medium">Concurso #{res.drawId}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xl">{res.matches}</span>
                        <span className="text-sm opacity-80">Pontos</span>
                        {res.matches >= 14 && <Trophy size={18} />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checker;