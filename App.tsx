import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import GameGenerator from './components/GameGenerator';
import Checker from './components/Checker';
import Education from './components/Education';
import ROICalculator from './components/Roi';
import Login from './components/Login';

// Fix: Use React.ReactElement instead of JSX.Element to resolve namespace error
const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }>
            <Route index element={<Dashboard />} />
            <Route path="gerador" element={<GameGenerator />} />
            <Route path="conferir" element={<Checker />} />
            <Route path="educacao" element={<Education />} />
            <Route path="roi" element={<ROICalculator />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;