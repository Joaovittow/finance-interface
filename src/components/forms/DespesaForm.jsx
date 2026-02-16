import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
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
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Descrição */}
      <Input
        label="Descrição"
        value={formData.descricao}
        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
        required
        className="bg-white dark:bg-dark-card"
      />

      {/* Valor */}
      <Input
        label="Valor Total"
        type="number"
        step="0.01"
        min="0"
        value={formData.valorTotal}
        onChange={(e) => setFormData({ ...formData, valorTotal: e.target.value })}
        required
        className="bg-white dark:bg-dark-card"
      />

      {/* Categoria */}
      <div>
         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
            Categoria
         </label>
        {categorias.length === 0 ? (
          <div>
            <Input
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              placeholder="Digite uma categoria..."
              required
              helperText="Nenhuma categoria cadastrada. Digite uma personalizada."
              className="bg-white dark:bg-dark-card"
            />
          </div>
        ) : (
          <Select
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            required
            className="bg-white dark:bg-dark-card"
            options={[
               { value: '', label: 'Selecione uma categoria' },
               ...categorias.map(cat => ({ value: cat, label: cat }))
            ]}
          />
        )}
      </div>

      {/* Data */}
      <Input
        label="Data"
        type="date"
        value={formData.data}
        onChange={(e) => setFormData({ ...formData, data: e.target.value })}
        required
        className="bg-white dark:bg-dark-card"
      />

      {/* Observação */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
          Observação (opcional)
        </label>
        <textarea
          rows={2}
          value={formData.observacao}
          onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
          className="w-full px-4 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200"
        />
      </div>

      {/* Parcelamento Toggle */}
      <div className="flex items-center gap-3 bg-gray-50 dark:bg-dark-border/30 p-3 rounded-xl border border-gray-200 dark:border-dark-border">
         <input 
            type="checkbox"
            id="parcelar"
            checked={formData.ehParcelada}
            onChange={() => setFormData({
               ...formData,
               ehParcelada: !formData.ehParcelada,
               parcelas: !formData.ehParcelada ? 2 : 1,
               dataPrimeiraParcela: formData.data,
            })}
            className="h-5 w-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
         />
         <label htmlFor="parcelar" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Esta despesa é parcelada?
         </label>
      </div>

      {formData.ehParcelada && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-brand-50 dark:bg-brand-900/10 rounded-xl border border-brand-100 dark:border-brand-900/30 animate-in slide-in-from-top-2 duration-300">
          <Input
             label="Data 1ª Parcela"
             type="date"
             value={formData.dataPrimeiraParcela}
             onChange={(e) => setFormData({ ...formData, dataPrimeiraParcela: e.target.value })}
             required
             className="bg-white dark:bg-dark-card"
          />

          <Select
             label="Número de Parcelas"
             value={formData.parcelas}
             onChange={(e) => setFormData({ ...formData, parcelas: parseInt(e.target.value) })}
             className="bg-white dark:bg-dark-card"
             options={[...Array(11).keys()].map(num => ({ 
               value: num + 2, 
               label: `${num + 2} parcelas` 
             }))}
          />
        </div>
      )}

      {/* Botões */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button type="submit" variant="primary" className="flex-1">
          {initialData ? 'Salvar Alterações' : 'Adicionar Despesa'}
        </Button>
        
        {initialData && (
          <Button type="button" variant="danger" onClick={handleDelete} className="flex-1">
            Excluir
          </Button>
        )}
        
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default DespesaForm;
