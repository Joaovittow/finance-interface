import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { useFinanceContext } from '../../contexts/FinanceContext';
import { getCurrentMonthYear } from '../../utils/formatters';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const MESES_NOMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const CriarMesModal = ({ isOpen, onClose, onMesCriado }) => {
  const { criarMes, carregarMeses, loading } = useFinanceContext();
  const [novoMes, setNovoMes] = useState(getCurrentMonthYear());

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await criarMes(novoMes.ano, novoMes.mes);
      await carregarMeses();
      onMesCriado?.();
      handleClose();
    } catch (error) {
      console.error('Erro ao criar mês:', error);
    }
  };

  const handleClose = () => {
    setNovoMes(getCurrentMonthYear());
    onClose();
  };

  // Gera os anos próximos (atual ±2)
  const anosDisponiveis = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - 2 + i,
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Criar Novo Mês"
      size="sm"
    >
      <div className="text-center mb-6 px-2 sm:px-0">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
          <Calendar className="h-6 w-6 text-blue-600" />
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          Escolha o mês e o ano que deseja criar
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 sm:space-y-6 text-sm sm:text-base"
      >
        {/* Grade de meses */}
        <div className="grid grid-cols-3 gap-2">
          {MESES_NOMES.map((mes, index) => (
            <button
              type="button"
              key={mes}
              onClick={() =>
                setNovoMes((prev) => ({ ...prev, mes: index + 1 }))
              }
              className={`py-2 px-1 rounded-md border focus:outline-none ${
                novoMes.mes === index + 1
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
              disabled={loading}
            >
              {mes.substring(0, 3)}
            </button>
          ))}
        </div>

        {/* Select de ano */}
        <div className="mt-4">
          <label className="block text-gray-700 font-medium mb-1">Ano *</label>
          <select
            value={novoMes.ano}
            onChange={(e) =>
              setNovoMes((prev) => ({ ...prev, ano: parseInt(e.target.value) }))
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
            required
          >
            {anosDisponiveis.map((ano) => (
              <option key={ano} value={ano}>
                {ano}
              </option>
            ))}
          </select>
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4">
          <Button
            type="submit"
            variant="primary"
            className="w-full sm:flex-1"
            disabled={loading}
          >
            {loading ? 'Criando...' : 'Criar Mês'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:flex-1"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CriarMesModal;
