import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { useCategorias } from '../../hooks/useCategorias';

const DespesaForm = ({ onSubmit, onCancel, initialData, onDelete }) => {
  const [formData, setFormData] = useState({
    descricao: '',
    valorTotal: '',
    categoria: '',
    observacao: '',
    data: new Date().toISOString().split('T')[0],
    parcelas: 1,
    ehParcelada: false,
    dataPrimeiraParcela: new Date().toISOString().split('T')[0],
    ...initialData,
  });

  const { categorias, loading } = useCategorias();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!formData.ehParcelada) {
      setFormData((prev) => ({
        ...prev,
        dataPrimeiraParcela: prev.data,
      }));
    }
  }, [formData.data, formData.ehParcelada]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const dadosParaEnviar = {
      ...formData,
      valorTotal: parseFloat(formData.valorTotal),
      parcelas: formData.ehParcelada ? parseInt(formData.parcelas) : 1,
      dataPrimeiraParcela: formData.ehParcelada
        ? formData.dataPrimeiraParcela
        : formData.data,
      data: formData.data,
    };

    onSubmit(dadosParaEnviar);
  };

  const handleDelete = () => {
    if (onDelete && initialData) {
      onDelete(initialData);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="text-gray-500">Carregando categorias...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <input
          type="text"
          value={formData.descricao}
          onChange={(e) =>
            setFormData({ ...formData, descricao: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Valor Total
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={formData.valorTotal}
          onChange={(e) =>
            setFormData({ ...formData, valorTotal: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoria
        </label>
        {categorias.length === 0 ? (
          <div className="space-y-2">
            <input
              type="text"
              value={formData.categoria}
              onChange={(e) =>
                setFormData({ ...formData, categoria: e.target.value })
              }
              placeholder="Digite uma categoria (ex: Alimentação, Transporte...)"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="text-xs text-gray-500">
              Nenhuma categoria configurada. Digite uma categoria personalizada.
            </p>
          </div>
        ) : (
          <select
            value={formData.categoria}
            onChange={(e) =>
              setFormData({ ...formData, categoria: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((categoria, index) => (
              <option key={index} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data
        </label>
        <input
          type="date"
          value={formData.data}
          onChange={(e) => setFormData({ ...formData, data: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observação (Opcional)
        </label>
        <textarea
          value={formData.observacao}
          onChange={(e) =>
            setFormData({ ...formData, observacao: e.target.value })
          }
          rows={2}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() =>
            setFormData({
              ...formData,
              ehParcelada: !formData.ehParcelada,
              parcelas: !formData.ehParcelada ? 2 : 1,
              dataPrimeiraParcela: formData.data,
            })
          }
          className={`px-4 py-2 rounded-md border transition-colors ${
            formData.ehParcelada
              ? 'bg-blue-100 border-blue-500 text-blue-700'
              : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {formData.ehParcelada
            ? '✓ Despesa Parcelada'
            : 'É uma despesa parcelada?'}
        </button>
      </div>

      {formData.ehParcelada && (
        <div className="space-y-4 p-4 bg-blue-50 rounded-md border border-blue-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data da Primeira Parcela
            </label>
            <input
              type="date"
              value={formData.dataPrimeiraParcela}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dataPrimeiraParcela: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Parcelas
            </label>
            <select
              value={formData.parcelas}
              onChange={(e) =>
                setFormData({ ...formData, parcelas: parseInt(e.target.value) })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                <option key={num} value={num}>
                  {num} parcela{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="flex space-x-3 pt-4">
        <Button type="submit" variant="primary">
          {initialData ? 'Atualizar' : 'Adicionar'} Despesa
        </Button>
        {initialData && (
          <Button type="button" variant="danger" onClick={handleDelete}>
            Excluir Despesa
          </Button>
        )}
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default DespesaForm;
