import React, { useEffect, useState } from 'react';
import { BookOpen, ShieldCheck, AlertTriangle } from 'lucide-react';
import { getResponsibleGamingTip } from '../services/geminiService';

const Education: React.FC = () => {
  const [tip, setTip] = useState("Carregando dica de especialista...");

  useEffect(() => {
    getResponsibleGamingTip().then(setTip);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-loto-green to-emerald-800 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <BookOpen className="text-loto-gold" /> Academia LotoGanha
        </h1>
        <p className="text-emerald-100 text-lg max-w-2xl">
          Domine a matemática por trás da sorte. Aprenda estratégias, entenda probabilidades e jogue com inteligência.
        </p>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg flex gap-4 items-start">
        <div className="p-2 bg-white rounded-full text-amber-500 shadow-sm">
           <AlertTriangle size={24} />
        </div>
        <div>
          <h3 className="font-bold text-amber-800 text-lg">Dica do Dia (IA)</h3>
          <p className="text-amber-900 mt-1">{tip}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-xl text-gray-800 mb-3 flex items-center gap-2">
            <ShieldCheck className="text-loto-green" /> Gestão de Banca
          </h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex gap-2 items-start">
              <span className="text-loto-gold font-bold">•</span>
              Defina um orçamento mensal fixo para jogos.
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-loto-gold font-bold">•</span>
              Nunca use dinheiro destinado a contas essenciais.
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-loto-gold font-bold">•</span>
              Reinvista apenas uma porcentagem dos lucros (ex: 20%).
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-xl text-gray-800 mb-3">Probabilidade Real</h3>
          <p className="text-gray-600 mb-4">
            Na Lotofácil, a chance de acertar 15 números com um jogo simples é de <strong>1 em 3.268.760</strong>.
          </p>
          <div className="bg-gray-100 rounded-lg p-3 text-sm">
             <div className="flex justify-between mb-1">
               <span>14 Pontos:</span>
               <span className="font-bold">1 em 21.791</span>
             </div>
             <div className="flex justify-between mb-1">
               <span>13 Pontos:</span>
               <span className="font-bold">1 em 691</span>
             </div>
             <div className="flex justify-between">
               <span>11 Pontos:</span>
               <span className="font-bold">1 em 11</span>
             </div>
          </div>
        </div>
      </div>

      <div className="prose max-w-none bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">Estratégias Comuns</h2>
        
        <h3 className="text-lg font-bold text-loto-green mt-4">O Padrão da "Moldura"</h3>
        <p className="text-gray-600">
          A moldura são os números que ficam na borda do cartão. Estatisticamente, a maioria dos sorteios tem entre 9 e 10 números na moldura. Evite jogar todos os números no centro.
        </p>

        <h3 className="text-lg font-bold text-loto-green mt-4">Equilíbrio Par/Ímpar</h3>
        <p className="text-gray-600">
          Raramente saem apenas pares ou apenas ímpares. O equilíbrio ideal histórico é 8 ímpares e 7 pares (ou vice-versa).
        </p>
      </div>
    </div>
  );
};

export default Education;