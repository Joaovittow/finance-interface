// src/App.jsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FinanceProvider } from './contexts/FinanceContext';
import Layout from './components/layout/Layout';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import QuinzenaPage from './pages/QuinzenaPage';
import MesesPage from './pages/MesesPage';
import RelatoriosPage from './pages/RelatoriosPage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import './index.css';

// Componente para redirecionar automaticamente
const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rota pública de autenticação */}
      <Route
        path="/auth"
        element={!isAuthenticated ? <AuthPage /> : <Navigate to="/" replace />}
      />

      {/* Rotas protegidas */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meses"
        element={
          <ProtectedRoute>
            <MesesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quinzena/:id"
        element={
          <ProtectedRoute>
            <QuinzenaPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/relatorios"
        element={
          <ProtectedRoute>
            <RelatoriosPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/configuracoes"
        element={
          <ProtectedRoute>
            <ConfiguracoesPage />
          </ProtectedRoute>
        }
      />

      {/* Redirecionamento padrão */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/' : '/auth'} replace />}
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <Router>
          <Layout>
            <AppRoutes />
          </Layout>
        </Router>
      </FinanceProvider>
    </AuthProvider>
  );
}

export default App;
