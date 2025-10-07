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
        <div className="text-gray-500 text-sm sm:text-base">
          Carregando categorias...
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 px-2 sm:px-0 text-sm sm:text-base"
    >
      {/* Descrição */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Descrição
        </label>
        <input
          type="text"
          value={formData.descricao}
          onChange={(e) =>
            setFormData({ ...formData, descricao: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          required
        />
      </div>

      {/* Valor */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
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
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          required
        />
      </div>

      {/* Categoria */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
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
              placeholder="Digite uma categoria..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              required
            />
            <p className="text-xs text-gray-500">
              Nenhuma categoria cadastrada. Digite uma personalizada.
            </p>
          </div>
        ) : (
          <select
            value={formData.categoria}
            onChange={(e) =>
              setFormData({ ...formData, categoria: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
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

      {/* Data */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Data</label>
        <input
          type="date"
          value={formData.data}
          onChange={(e) => setFormData({ ...formData, data: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          required
        />
      </div>

      {/* Observação */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Observação (opcional)
        </label>
        <textarea
          rows={2}
          value={formData.observacao}
          onChange={(e) =>
            setFormData({ ...formData, observacao: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
        />
      </div>

      {/* Parcelamento */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
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
          className={`px-4 py-2 rounded-md border transition-colors w-full sm:w-auto text-sm sm:text-base ${
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
        <div className="space-y-3 p-3 sm:p-4 bg-blue-50 rounded-md border border-blue-200">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
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
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Número de Parcelas
            </label>
            <select
              value={formData.parcelas}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  parcelas: parseInt(e.target.value),
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            >
              {/* biome-ignore lint/style/useConsistentBuiltinInstantiation: <explanation> */}
              {[...Array(12).keys()].slice(1).map((num) => (
                <option key={num} value={num + 1}>
                  {num + 1} parcela{num > 0 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Botões */}
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button type="submit" variant="primary" className="w-full sm:w-auto">
          {initialData ? 'Atualizar' : 'Adicionar'} Despesa
        </Button>
        {initialData && (
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            className="w-full sm:w-auto"
          >
            Excluir Despesa
          </Button>
        )}
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default DespesaForm;
