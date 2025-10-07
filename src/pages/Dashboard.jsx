import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Info,
} from 'lucide-react';
import { useFinanceContext } from '../contexts/FinanceContext';
import {
  formatCurrency,
  getCurrentMonthYear,
  formatMonthYear,
} from '../utils/formatters';
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

  // Encontrar o mês ativo baseado na regra personalizada (dia 11 ao dia 10)
  const mesAtivoCalculado = calcularMesAtivo();
  const mesAtual =
    meses?.find(
      (mes) =>
        mes.mes === mesAtivoCalculado.mes && mes.ano === mesAtivoCalculado.ano,
    ) || null;

  // Cálculos seguindo o mesmo padrão do RelatoriosPage
  const totalReceitas =
    mesAtual?.quinzenas?.reduce(
      (total, quinzena) =>
        total +
        (quinzena.receitas?.reduce((sum, rec) => sum + rec.valor, 0) || 0),
      0,
    ) || 0;

  const totalDespesas =
    mesAtual?.quinzenas?.reduce(
      (total, quinzena) =>
        total +
        (quinzena.parcelas
          ?.filter((p) => p.pago)
          .reduce(
            (sum, parc) => sum + (parc.valorPago || parc.valorParcela),
            0,
          ) || 0),
      0,
    ) || 0;

  const saldoAtual = totalReceitas - totalDespesas;

  // Verificar se já existe o mês atual (baseado na regra personalizada)
  const mesAtualJaExiste = !!mesAtual;

  const handleMesCriado = () => {
    // Recarregar dados após criar mês
    carregarMeses();
  };

  if (loading && meses?.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Financeiro
          </h1>
          <p className="text-gray-600 mt-2">
            Visão geral do seu controle financeiro quinzenal
          </p>
        </div>
        <Button
          onClick={() => setModalAberto(true)}
          icon={Plus}
          variant="primary"
        >
          Novo Mês
        </Button>
      </div>

      {/* Informação do Período Ativo */}
      <Card>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Período Ativo
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>
                  O mês considerado <strong>ativo</strong> é aquele entre{' '}
                  <strong>dia 11 do mês atual e dia 10 do próximo mês</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Saldo Atual</h3>
            <DollarSign
              className={`h-5 w-5 ${saldoAtual >= 0 ? 'text-green-500' : 'text-red-500'}`}
            />
          </div>
          <p
            className={`text-2xl font-bold mt-2 ${saldoAtual >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {formatCurrency(saldoAtual)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {mesAtual
              ? formatMonthYear(mesAtual.mes, mesAtual.ano)
              : 'Nenhum mês ativo'}
          </p>
          {mesAtual && (
            <span className="inline-flex items-center px-2 py-1 mt-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
              Mês Ativo
            </span>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Receitas
            </h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {formatCurrency(totalReceitas)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {mesAtual ? formatMonthYear(mesAtual.mes, mesAtual.ano) : '-'}
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">
              Despesas Pagas
            </h3>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {formatCurrency(totalDespesas)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {mesAtual ? formatMonthYear(mesAtual.mes, mesAtual.ano) : '-'}
          </p>
        </Card>
      </div>

      {/* Meses Recentes */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Meses Recentes
          </h2>
          <Link
            to="/meses"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver todos
          </Link>
        </div>

        {!meses || meses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum mês cadastrado ainda.</p>
            <Button
              onClick={() => setModalAberto(true)}
              variant="primary"
              className="mt-4"
            >
              Criar primeiro mês
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {meses.slice(0, 5).map((mes) => {
              const isMesAtivo = mesEhAtivo(mes.mes, mes.ano);
              return (
                <div
                  key={mes.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-800">
                        {formatMonthYear(mes.mes, mes.ano)}
                      </h3>
                      {isMesAtivo && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          Ativo
                        </span>
                      )}
                      {mes.ativo && !isMesAtivo && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                          Marcado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {mes.quinzenas?.length || 0} quinzenas •
                      {mes.quinzenas?.reduce(
                        (total, q) => total + (q.receitas?.length || 0),
                        0,
                      ) || 0}{' '}
                      receitas
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {mes.quinzenas?.map((quinzena) => (
                      <Link
                        key={quinzena.id}
                        to={`/quinzena/${quinzena.id}`}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        {quinzena.tipo === 'primeira' ? 'Dia 15' : 'Dia 30'}
                      </Link>
                    )) || []}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Modal de Criar Mês */}
      <CriarMesModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onMesCriado={handleMesCriado}
      />
    </div>
  );
};

export default Dashboard;
