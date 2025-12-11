import React, { useState } from 'react';
import { Calculator, DollarSign } from 'lucide-react';

const ROICalculator: React.FC = () => {
  const [games, setGames] = useState(1);
  const costPerGame = 3.00;
  
  // Simulated probabilities and average prizes (approximate)
  const prizes = {
    11: 6.00,
    12: 12.00,
    13: 30.00,
    14: 1800.00,
    15: 2000000.00
  };

  const [simulatedHits, setSimulatedHits] = useState({
    11: 0, 12: 0, 13: 0, 14: 0, 15: 0
  });

  const totalCost = games * costPerGame;
  
  const calculateReturn = () => {
    let total = 0;
    total += simulatedHits[11] * prizes[11];
    total += simulatedHits[12] * prizes[12];
    total += simulatedHits[13] * prizes[13];
    total += simulatedHits[14] * prizes[14];
    total += simulatedHits[15] * prizes[15];
    return total;
  };

  const totalReturn = calculateReturn();
  const profit = totalReturn - totalCost;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-loto-green mb-6 flex items-center gap-2">
          <Calculator className="text-loto-gold" /> Simulador de ROI
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantos jogos você faz por concurso?</label>
              <input 
                type="number" 
                min="1"
                value={games}
                onChange={(e) => setGames(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-loto-green"
              />
              <p className="mt-2 text-sm text-gray-500">Custo Total: <span className="font-bold text-gray-900">R$ {totalCost.toFixed(2)}</span></p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
              <h4 className="font-semibold text-gray-700">Simular Acertos</h4>
              <p className="text-xs text-gray-500 mb-4">Insira quantos jogos teriam cada pontuação para ver o retorno.</p>
              
              {[11, 12, 13, 14, 15].map((points) => (
                <div key={points} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{points} Pontos</span>
                  <input 
                    type="number" 
                    min="0"
                    value={simulatedHits[points as keyof typeof simulatedHits]}
                    onChange={(e) => setSimulatedHits({...simulatedHits, [points]: Number(e.target.value)})}
                    className="w-20 p-2 border border-gray-300 rounded text-center"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-4">
            <div className="bg-loto-green text-white p-6 rounded-2xl shadow-lg">
              <p className="opacity-80 text-sm mb-1">Retorno Bruto Estimado</p>
              <p className="text-3xl font-bold">R$ {totalReturn.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>

            <div className={`p-6 rounded-2xl shadow-lg text-white ${profit >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}>
               <p className="opacity-80 text-sm mb-1">Lucro / Prejuízo</p>
               <p className="text-3xl font-bold flex items-center gap-2">
                 <DollarSign size={28} />
                 {profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
               </p>
            </div>
            
            <p className="text-xs text-center text-gray-400 mt-4">
              *Valores de prêmios estimados baseados em médias históricas. 
              Não constitui garantia de ganho.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;