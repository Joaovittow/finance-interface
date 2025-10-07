import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Edit, Trash2 } from 'lucide-react';
import { useFinanceContext } from '../contexts/FinanceContext';
import { useConfirmDialog } from '../hooks/useConfirmDialog';
import { formatMonthYear } from '../utils/formatters';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import CriarMesModal from '../components/mes/CriarMesModal';

const MesesPage = () => {
  const { meses, loading, excluirMes, carregarMeses } = useFinanceContext();
  const [modalAberto, setModalAberto] = useState(false);
  const {
    isOpen,
    showConfirm,
    hideConfirm,
    handleConfirm,
    title,
    message,
    type,
  } = useConfirmDialog();

  useEffect(() => {
    carregarMeses();
  }, [carregarMeses]);

  const handleExcluirMes = (mes) =>
    showConfirm({
      title: 'Excluir Mês',
      message: `Deseja realmente excluir ${formatMonthYear(mes.mes, mes.ano)}?`,
      type: 'danger',
      onConfirm: async () => await excluirMes(mes.id),
    });

  const handleMesCriado = () => carregarMeses();

  const mesesAgrupados = meses.reduce((acc, mes) => {
    if (!acc[mes.ano]) {
      acc[mes.ano] = [];
    }
    acc[mes.ano].push(mes);
    return acc;
  }, {});

  return (
    <div className="space-y-6 px-3 sm:px-6 md:px-10 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Gestão de Meses
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Controle seus períodos mensais e quinzenais
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

      {/* Lista de Meses */}
      {Object.entries(mesesAgrupados)
        .sort(([a], [b]) => b - a)
        .map(([ano, lista]) => (
          <Card key={ano}>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 border-b pb-2">
              {ano}
            </h2>
            <div className="space-y-3">
              {lista
                .sort((a, b) => b.mes - a.mes)
                .map((mes) => (
                  <div
                    key={mes.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 sm:h-5 text-gray-400" />
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                          {formatMonthYear(mes.mes, mes.ano)}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {mes.quinzenas.length} quinzenas
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                      {mes.quinzenas.map((q) => (
                        <Link
                          key={q.id}
                          to={`/quinzena/${q.id}`}
                          className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium hover:bg-blue-200 transition"
                        >
                          {q.tipo === 'primeira' ? 'Dia 15' : 'Dia 30'}
                        </Link>
                      ))}
                      <button
                        onClick={() => handleExcluirMes(mes)}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Excluir mês"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        ))}

      {/* Estado vazio */}
      {!loading && meses.length === 0 && (
        <Card>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <h3 className="font-medium text-gray-900">Nenhum mês cadastrado</h3>
            <p className="text-sm mt-1">Crie seu primeiro mês abaixo.</p>
            <Button
              onClick={() => setModalAberto(true)}
              icon={Plus}
              variant="primary"
              className="mt-3 w-full sm:w-auto"
            >
              Criar Primeiro Mês
            </Button>
          </div>
        </Card>
      )}

      <ConfirmDialog
        isOpen={isOpen}
        onClose={hideConfirm}
        onConfirm={handleConfirm}
        title={title}
        message={message}
        type={type}
      />

      <CriarMesModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onMesCriado={handleMesCriado}
      />
    </div>
  );
};

export default MesesPage;
