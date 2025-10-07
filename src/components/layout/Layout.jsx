// src/components/layout/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorAlert from '../ui/ErrorAlert';
import { useFinanceContext } from '../../contexts/FinanceContext';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
  const { loading: financeLoading, error, limparError } = useFinanceContext();
  const { loading: authLoading, isAuthenticated } = useAuth();

  const loading = financeLoading || authLoading;

  // Se não estiver autenticado, mostra apenas o conteúdo sem navbar
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Alertas Globais */}
        {error && <ErrorAlert message={error} onClose={limparError} />}

        {/* Loading Global */}
        {loading && <LoadingSpinner />}

        {/* Conteúdo Principal */}
        <main>{children}</main>
      </div>
    );
  }

  // Se estiver autenticado, mostra layout completo com navbar
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Alertas Globais */}
      {error && <ErrorAlert message={error} onClose={limparError} />}

      {/* Loading Global */}
      {loading && <LoadingSpinner />}

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

export default Layout;
