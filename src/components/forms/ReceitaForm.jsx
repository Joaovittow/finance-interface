import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { TIPOS_RECEITA } from '../../constants/apiEndpoints';

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
    tipo: TIPOS_RECEITA.VARIAVEL,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        descricao: initialData.descricao,
        valor: initialData.valor.toString(),
        tipo: initialData.tipo,
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
        className="bg-white dark:bg-dark-card"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Valor"
          type="number"
          step="0.01"
          value={formData.valor}
          onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
          required
          className="bg-white dark:bg-dark-card"
        />

        <Select
          label="Tipo"
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
          options={[
            { value: TIPOS_RECEITA.FIXA, label: 'Fixa' },
            { value: TIPOS_RECEITA.VARIAVEL, label: 'Variável' },
          ]}
          className="bg-white dark:bg-dark-card"
        />
      </div>

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
