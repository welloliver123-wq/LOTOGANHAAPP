import React, { useMemo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ReferenceLine } from 'recharts';
import { LotteryService } from '../services/lotteryService';
import { MOCK_HISTORY } from '../services/mockDataService';
import { getAiAnalysis } from '../services/geminiService';
import { Brain, Flame, Snowflake, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const service = useMemo(() => new LotteryService(MOCK_HISTORY), []);
  const stats = useMemo(() => service.getStats(), [service]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('Carregando análise da IA...');

  useEffect(() => {
    // Debounce or just run once to avoid quota issues
    getAiAnalysis(stats.hotNumbers.slice(0, 5), stats.coldNumbers.slice(0, 5))
      .then(setAiAnalysis);
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-red-100 rounded-full text-red-600">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Número Mais Quente</p>
            <p className="text-2xl font-bold text-gray-800">{stats.hotNumbers[0]?.number}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <Snowflake size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Mais Atrasado</p>
            <p className="text-2xl font-bold text-gray-800">
              {stats.hotNumbers.reduce((prev, current) => (prev.delay > current.delay) ? prev : current).number}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-loto-green/10 rounded-full text-loto-green">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Média de Soma</p>
            <p className="text-2xl font-bold text-gray-800">
              {Math.round(stats.sumHistory.reduce((a, b) => a + b.sum, 0) / stats.sumHistory.length)}
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-loto-green to-emerald-800 p-4 rounded-xl shadow-sm text-white flex flex-col justify-center">
          <p className="text-xs font-medium text-loto-gold mb-1">DICA RÁPIDA</p>
          <p className="text-sm leading-tight">Mantenha entre 7 e 9 ímpares. 60% dos sorteios seguem este padrão.</p>
        </div>
      </div>

      {/* AI Insight */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-loto-gold/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Brain size={100} className="text-loto-green" />
        </div>
        <h3 className="text-lg font-bold text-loto-green mb-3 flex items-center gap-2">
          <Brain className="text-loto-gold" /> Análise Inteligente do Gemini
        </h3>
        <p className="text-gray-700 whitespace-pre-line relative z-10 leading-relaxed">
          {aiAnalysis}
        </p>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Frequência dos Números (Top 10)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.hotNumbers}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="number" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  cursor={{ fill: '#f3f4f6' }}
                />
                <Bar dataKey="frequency" fill="#10b981" radius={[4, 4, 0, 0]} name="Aparições" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Histórico de Soma das Dezenas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.sumHistory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="id" />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip />
                <ReferenceLine y={200} label="Média" stroke="red" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="sum" stroke="#d97706" strokeWidth={2} dot={false} name="Soma" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Heatmap / Full Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Mapa de Calor (Todos os Números)</h3>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
          {service.getAllStatsSorted().map((stat) => {
             // Calculate color intensity based on relative frequency
             const maxFreq = stats.hotNumbers[0].frequency;
             const intensity = Math.round((stat.frequency / maxFreq) * 100);
             let colorClass = 'bg-gray-100 text-gray-600';
             if (intensity > 90) colorClass = 'bg-red-500 text-white';
             else if (intensity > 75) colorClass = 'bg-orange-400 text-white';
             else if (intensity > 50) colorClass = 'bg-yellow-400 text-black';
             else if (intensity > 25) colorClass = 'bg-green-300 text-black';
             else colorClass = 'bg-blue-100 text-blue-800';

             return (
               <div key={stat.number} className={`flex flex-col items-center justify-center p-3 rounded-lg ${colorClass} transition-all hover:scale-105`}>
                 <span className="text-xl font-bold">{stat.number}</span>
                 <span className="text-xs opacity-80">{stat.frequency}x</span>
               </div>
             )
          })}
        </div>
        <div className="mt-4 flex gap-4 text-xs text-gray-500 justify-end">
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded"></div> Muito Quente</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-400 rounded"></div> Médio</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-100 rounded"></div> Frio</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;