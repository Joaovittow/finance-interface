// src/pages/ConfiguracoesPage.jsx
import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, User, Tag } from 'lucide-react';
import { ApiService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ConfiguracoesPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    setLoading(true);
    try {
      const configs = await ApiService.getConfiguracoes();
      const categoriasConfig = configs.find(
        (config) => config.chave === 'categorias',
      );

      if (categoriasConfig && categoriasConfig.valor) {
        const categoriasArray = categoriasConfig.valor
          .split(',')
          .map((cat) => cat.trim())
          .filter((cat) => cat.length > 0);
        setCategorias(categoriasArray);
      } else {
        setCategorias([]);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdicionarCategoria = () => {
    if (!novaCategoria.trim()) {
      setMessage('Digite uma categoria');
      return;
    }

    const categoriaNormalizada = novaCategoria.trim();

    // Verificar se a categoria já existe
    if (
      categorias.some(
        (cat) => cat.toLowerCase() === categoriaNormalizada.toLowerCase(),
      )
    ) {
      setMessage('Esta categoria já existe');
      return;
    }

    setCategorias((prev) => [...prev, categoriaNormalizada]);
    setNovaCategoria('');
    setMessage(
      'Categoria adicionada! Clique em "Salvar Categorias" para confirmar.',
    );
  };

  const handleSalvarCategorias = async () => {
    setSaving(true);
    setMessage('');

    try {
      // Primeiro, carregar configurações existentes
      const configsExistentes = await ApiService.getConfiguracoes();
      const categoriasConfigExistente = configsExistentes.find(
        (config) => config.chave === 'categorias',
      );

      const valorCategorias = categorias.join(',');

      if (categoriasConfigExistente) {
        // Atualizar configuração existente
        await ApiService.updateConfiguracao('categorias', valorCategorias);
      } else {
        // Criar nova configuração
        await ApiService.createConfiguracao({
          chave: 'categorias',
          valor: valorCategorias,
          descricao: 'Categorias personalizadas para despesas',
        });
      }

      setMessage('Categorias salvas com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar categorias:', error);

      if (error.response) {
        setMessage(
          `Erro do servidor: ${error.response.status} - ${error.response.data?.message || 'Erro interno'}`,
        );
      } else if (error.request) {
        setMessage('Erro de conexão: Não foi possível contactar o servidor');
      } else {
        setMessage('Erro ao salvar categorias: ' + error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleRemoverCategoria = (categoriaParaRemover) => {
    setCategorias((prev) =>
      prev.filter((categoria) => categoria !== categoriaParaRemover),
    );
    setMessage(
      'Categoria removida! Clique em "Salvar Categorias" para confirmar.',
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdicionarCategoria();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-gray-500">Carregando categorias...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
          <p className="text-gray-600 mt-2">
            Gerencie suas categorias de despesas
          </p>
        </div>

        {message && (
          <div
            className={`px-4 py-2 rounded-lg ${
              message.includes('Erro') ||
              message.includes('Digite') ||
              message.includes('já existe')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}
          >
            {message}
          </div>
        )}
      </div>

      {/* Adicionar Nova Categoria */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Tag className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Adicionar Categoria
          </h2>
        </div>

        <div className="flex space-x-3 mb-4">
          <div className="flex-1">
            <Input
              label="Nova Categoria"
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="ex: Alimentação, Transporte, Lazer..."
              helperText="Digite o nome da categoria e pressione Enter ou clique em Adicionar"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleAdicionarCategoria}
              icon={Plus}
              variant="primary"
              className="whitespace-nowrap"
            >
              Adicionar
            </Button>
          </div>
        </div>
      </Card>

      {/* Categorias Existentes */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Minhas Categorias ({categorias.length})
          </h2>
          <div className="text-sm text-gray-500">
            {categorias.length > 0 &&
              'Clique em "Salvar Categorias" para aplicar as mudanças'}
          </div>
        </div>

        {categorias.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma categoria cadastrada.</p>
            <p className="text-sm mt-2">
              Adicione sua primeira categoria usando o formulário acima.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {categorias.map((categoria, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-800">{categoria}</span>
                </div>
                <Button
                  onClick={() => handleRemoverCategoria(categoria)}
                  icon={Trash2}
                  variant="danger"
                  size="small"
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Informações do Usuário */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <User className="h-5 w-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Informações do Usuário
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="font-medium text-gray-700">Nome:</label>
            <p className="text-gray-600">{user?.name || 'Não informado'}</p>
          </div>
          <div>
            <label className="font-medium text-gray-700">Email:</label>
            <p className="text-gray-600">{user?.email || 'Não informado'}</p>
          </div>
          <div>
            <label className="font-medium text-gray-700">Categorias:</label>
            <p className="text-gray-600">{categorias.length} cadastradas</p>
          </div>
        </div>
      </Card>

      {/* Botão Salvar */}
      <div className="flex justify-end space-x-3">
        <Button onClick={carregarCategorias} variant="secondary">
          Recarregar
        </Button>

        <Button
          onClick={handleSalvarCategorias}
          icon={Save}
          variant="primary"
          loading={saving}
          disabled={saving || categorias.length === 0}
        >
          {saving ? 'Salvando...' : 'Salvar Categorias'}
        </Button>
      </div>

      {/* Aviso sobre mudanças não salvas */}
      {categorias.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Mudanças não salvas
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  As categorias adicionadas ou removidas ainda não foram salvas
                  no servidor. Clique em "Salvar Categorias" para aplicar as
                  mudanças.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfiguracoesPage;
