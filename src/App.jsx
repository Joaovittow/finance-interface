import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FinanceProvider } from './contexts/FinanceContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import MesesPage from './pages/MesesPage';
import QuinzenaPage from './pages/QuinzenaPage';
import RelatoriosPage from './pages/RelatoriosPage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <FinanceProvider>
          <Layout>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
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
            </Routes>
          </Layout>
        </FinanceProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
