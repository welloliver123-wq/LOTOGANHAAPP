import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { Clover, Lock, Mail, Loader2, UserPlus, LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err: any) {
      console.error(err);
      let errorMessage = 'Falha na operação. Verifique seus dados.';
      
      if (err.code === 'auth/invalid-credential') {
        errorMessage = 'E-mail ou senha incorretos.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas falhas. Tente novamente mais tarde.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Este e-mail já está cadastrado.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'A senha deve ter no mínimo 6 caracteres.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Formato de e-mail inválido.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-loto-green to-emerald-900 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-loto-green p-8 text-center border-b border-emerald-800">
          <div className="flex justify-center mb-4">
             <div className="bg-white/10 p-3 rounded-full">
               <Clover className="text-loto-gold w-12 h-12" />
             </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">LotoGanha</h1>
          <p className="text-emerald-200 text-sm mt-1">
            {isRegistering ? 'Crie sua conta para começar' : 'Sistema de Inteligência Lotofácil'}
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-loto-green focus:border-loto-green transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-loto-green focus:border-loto-green transition-colors"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
              {isRegistering && (
                <p className="mt-1 text-xs text-gray-500">Mínimo de 6 caracteres</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-loto-green bg-loto-gold hover:bg-loto-goldhov focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-loto-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.99]"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : isRegistering ? (
                <span className="flex items-center gap-2"><UserPlus size={18} /> CRIAR CONTA</span>
              ) : (
                <span className="flex items-center gap-2"><LogIn size={18} /> ENTRAR NO SISTEMA</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600 mb-2">
              {isRegistering ? 'Já possui uma conta?' : 'Não possui conta?'}
            </p>
            <button
              type="button"
              onClick={toggleMode}
              className="text-loto-green font-bold hover:text-emerald-800 transition-colors text-sm uppercase tracking-wide"
            >
              {isRegistering ? 'Fazer Login' : 'Criar Nova Conta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;