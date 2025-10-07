import React from 'react';
import Navbar from './Navbar';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorAlert from '../ui/ErrorAlert';
import { useFinanceContext } from '../../contexts/FinanceContext';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
  const { loading: financeLoading, error, limparError } = useFinanceContext();
  const { loading: authLoading } = useAuth();

  const loading = financeLoading || authLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {error && <ErrorAlert message={error} onClose={limparError} />}
      {loading && <LoadingSpinner />}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

export default Layout;
