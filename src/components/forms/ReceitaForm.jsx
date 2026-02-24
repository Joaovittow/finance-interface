import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { toLocalYMD } from '../../utils/dateUtils';

const ReceitaForm = ({
  onSubmit,
  onCancel,
  onDelete,
  initialData = null,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    dataDeposito: toLocalYMD(new Date()),
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        descricao: initialData.descricao,
        valor: initialData.valor.toString(),
        dataDeposito: initialData.dataDeposito || toLocalYMD(new Date()),
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.descricao || !formData.valor) {
      return;
    }
    onSubmit({
      ...formData,
      valor: parseFloat(formData.valor),
    });
  };

  const handleDelete = () => {
    if (onDelete && initialData) {
      onDelete(initialData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Descrição"
        value={formData.descricao}
        onChange={(e) =>
          setFormData({ ...formData, descricao: e.target.value })
        }
        required
        placeholder="Ex: Salário, Freelance..."
        className="bg-white dark:bg-dark-card"
      />

      <Input
        label="Valor"
        type="number"
        step="0.01"
        value={formData.valor}
        onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
        required
        placeholder="0,00"
        className="bg-white dark:bg-dark-card"
      />

      <Input
        label="Data do depósito"
        type="date"
        value={formData.dataDeposito}
        onChange={(e) =>
          setFormData({ ...formData, dataDeposito: e.target.value })
        }
        required
        helperText="Receitas com data futura só entram no total quando o dia chegar."
        className="bg-white dark:bg-dark-card"
      />

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
          className="w-full sm:w-auto flex-1"
        >
          {initialData ? 'Atualizar' : 'Adicionar'} Receita
        </Button>
        {initialData && (
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            className="w-full sm:w-auto flex-1"
          >
            Excluir
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="w-full sm:w-auto flex-1"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default ReceitaForm;
