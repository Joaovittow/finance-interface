import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from 'lucide-react';
import { useFinanceContext } from '../contexts/FinanceContext';
import { formatCurrency, formatMonthYear } from '../utils/formatters';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import CriarMesModal from '../components/mes/CriarMesModal';
import { calcularMesAtivo, mesEhAtivo } from '../utils/dateUtils';

const Dashboard = () => {
  const { meses, loading, carregarMeses } = useFinanceContext();
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    carregarMeses();
  }, [carregarMeses]);

  const mesAtivo = calcularMesAtivo();
  const mesAtual =
    meses?.find((m) => m.mes === mesAtivo.mes && m.ano === mesAtivo.ano) ||
    null;

  const totalReceitas =
    mesAtual?.quinzenas?.reduce(
      (total, q) => total + (q.receitas?.reduce((s, r) => s + r.valor, 0) || 0),
      0,
    ) || 0;

  const totalDespesas =
    mesAtual?.quinzenas?.reduce(
      (total, q) =>
        total +
        (q.parcelas
          ?.filter((p) => p.pago)
          .reduce((s, p) => s + (p.valorPago || p.valorParcela), 0) || 0),
      0,
    ) || 0;

  const saldoAtual = totalReceitas - totalDespesas;

  if (loading && meses?.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64 text-gray-500">
        Carregando...
      </div>
    );
  }

  return (
    <div className="space-y-6 px-3 sm:px-6 md:px-10 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Dashboard Financeiro
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Visão geral do seu controle financeiro quinzenal
          </p>
        </div>
        <Button
          onClick={() => setModalAberto(true)}
          icon={Plus}
          variant="primary"
          className="w-full sm:w-auto"
        >
          Novo Mês
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700">Saldo Atual</h3>
            <DollarSign
              className={`h-4 sm:h-5 ${saldoAtual >= 0 ? 'text-green-500' : 'text-red-500'}`}
            />
          </div>
          <p
            className={`text-xl sm:text-2xl font-bold ${saldoAtual >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {formatCurrency(saldoAtual)}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {mesAtual ? formatMonthYear(mesAtual.mes, mesAtual.ano) : '-'}
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700">Receitas</h3>
            <TrendingUp className="h-4 sm:h-5 text-green-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-green-600">
            {formatCurrency(totalReceitas)}
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700">Despesas</h3>
            <TrendingDown className="h-4 sm:h-5 text-red-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-red-600">
            {formatCurrency(totalDespesas)}
          </p>
        </Card>
      </div>

      {/* Meses Recentes */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Meses Recentes
          </h2>
          <Link
            to="/meses"
            className="text-blue-600 hover:text-blue-700 text-sm sm:text-base font-medium"
          >
            Ver todos
          </Link>
        </div>

        {!meses || meses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm sm:text-base">Nenhum mês cadastrado.</p>
            <Button
              onClick={() => setModalAberto(true)}
              variant="primary"
              className="mt-3 w-full sm:w-auto"
            >
              Criar Primeiro Mês
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {meses.slice(0, 5).map((mes) => {
              // biome-ignore lint/correctness/noUnusedVariables: <explanation>
              const ativo = mesEhAtivo(mes.mes, mes.ano);
              return (
                <div
                  key={mes.id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                      {formatMonthYear(mes.mes, mes.ano)}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {mes.quinzenas?.length || 0} quinzenas
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                    {mes.quinzenas?.map((q) => (
                      <Link
                        key={q.id}
                        to={`/quinzena/${q.id}`}
                        className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium hover:bg-blue-200 transition"
                      >
                        {q.tipo === 'primeira' ? 'Dia 15' : 'Dia 30'}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <CriarMesModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onMesCriado={carregarMeses}
      />
    </div>
  );
};

export default Dashboard;
