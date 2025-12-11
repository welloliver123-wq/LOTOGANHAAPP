import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wand2, CheckSquare, GraduationCap, Calculator, Menu, X, Clover, LogOut } from 'lucide-react';
import { auth } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Erro ao sair", error);
    }
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/gerador', icon: Wand2, label: 'Gerador Inteligente' },
    { to: '/conferir', icon: CheckSquare, label: 'Conferir Jogos' },
    { to: '/educacao', icon: GraduationCap, label: 'Academia Loto' },
    { to: '/roi', icon: Calculator, label: 'Calculadora ROI' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-loto-green z-50 px-4 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2 text-white font-bold text-xl">
          <Clover className="text-loto-gold" /> LotoGanha
        </div>
        <button onClick={toggleSidebar} className="text-white">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-loto-green text-white transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        pt-20 lg:pt-0
      `}>
        <div className="hidden lg:flex items-center justify-center h-20 border-b border-emerald-800 shrink-0">
          <h1 className="text-2xl font-bold flex items-center gap-2 tracking-tight">
            <Clover className="text-loto-gold animate-pulse" /> LotoGanha
          </h1>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeSidebar}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
                ${isActive 
                  ? 'bg-loto-gold text-loto-green shadow-lg font-bold translate-x-1' 
                  : 'hover:bg-emerald-800 hover:text-white text-emerald-100'}
              `}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-emerald-800 shrink-0">
           <div className="flex items-center gap-3 mb-4 px-2">
             <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-xs font-bold text-emerald-100">
               {user?.email?.charAt(0).toUpperCase()}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-medium text-white truncate">{user?.email}</p>
             </div>
           </div>
           
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center gap-2 bg-emerald-900 hover:bg-emerald-950 text-emerald-200 py-2 rounded-lg text-sm transition-colors"
           >
             <LogOut size={16} /> Sair
           </button>
        </div>

        <div className="p-4 text-center text-xs text-emerald-300/60">
          <p>© 2024 LotoGanha</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:h-screen lg:overflow-y-auto p-4 lg:p-8 pt-24 lg:pt-8 transition-all">
        <Outlet />
      </main>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
};

export default Layout;