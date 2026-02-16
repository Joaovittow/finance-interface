import React from 'react';
import AppShell from './AppShell';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorAlert from '../ui/ErrorAlert';
import { useFinanceContext } from '../../contexts/FinanceContext';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
  const { loading: financeLoading, error, limparError } = useFinanceContext();
  const { loading: authLoading } = useAuth();

  const loading = financeLoading || authLoading;

  return (
    <AppShell>
      {error && <ErrorAlert message={error} onClose={limparError} />}
      {loading && (
        <div className="fixed inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      {children}
    </AppShell>
  );
};

export default Layout;
