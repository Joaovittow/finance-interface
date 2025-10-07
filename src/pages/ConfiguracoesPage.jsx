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
      const configsExistentes = await ApiService.getConfiguracoes();
      const categoriasConfigExistente = configsExistentes.find(
        (config) => config.chave === 'categorias',
      );

      const valorCategorias = categorias.join(',');

      if (categoriasConfigExistente) {
        await ApiService.updateConfiguracao('categorias', valorCategorias);
      } else {
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
      <div className="flex justify-center items-center min-h-64 text-gray-500">
        Carregando categorias...
      </div>
    );
  }

  return (
    <div className="space-y-6 px-3 sm:px-6 lg:px-10 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Configurações
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Gerencie suas categorias de despesas
          </p>
        </div>

        {message && (
          <div
            className={`p-3 sm:p-4 rounded-lg text-sm sm:text-base text-center ${
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

      {/* Adicionar Categoria */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Adicionar Categoria
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              label="Nova Categoria"
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="ex: Alimentação, Transporte..."
              helperText="Digite o nome e pressione Enter ou clique em Adicionar"
            />
          </div>
          <Button
            onClick={handleAdicionarCategoria}
            icon={Plus}
            variant="primary"
            className="w-full sm:w-auto"
          >
            Adicionar
          </Button>
        </div>
      </Card>

      {/* Categorias Existentes */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Minhas Categorias ({categorias.length})
          </h2>
          {categorias.length > 0 && (
            <p className="text-sm text-gray-500 text-center sm:text-right">
              Clique em "Salvar Categorias" para aplicar as mudanças
            </p>
          )}
        </div>

        {categorias.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
            <p>Nenhuma categoria cadastrada.</p>
            <p className="mt-1">Adicione sua primeira categoria acima.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categorias.map((categoria, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 gap-2"
              >
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-800 text-sm sm:text-base">
                    {categoria}
                  </span>
                </div>
                <Button
                  onClick={() => handleRemoverCategoria(categoria)}
                  icon={Trash2}
                  variant="danger"
                  size="small"
                  className="w-full sm:w-auto"
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Botões Ações */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
        <Button
          onClick={carregarCategorias}
          variant="secondary"
          className="w-full sm:w-auto"
        >
          Recarregar
        </Button>
        <Button
          onClick={handleSalvarCategorias}
          icon={Save}
          variant="primary"
          loading={saving}
          disabled={saving || categorias.length === 0}
          className="w-full sm:w-auto"
        >
          {saving ? 'Salvando...' : 'Salvar Categorias'}
        </Button>
      </div>

      {/* Aviso Mudanças Não Salvas */}
      {categorias.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm sm:text-base">
          <div className="flex flex-col sm:flex-row gap-2">
            <svg
              className="h-5 w-5 text-yellow-400 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="font-medium text-yellow-800">
                Mudanças não salvas
              </h3>
              <p className="text-yellow-700 mt-1">
                As categorias adicionadas ou removidas ainda não foram salvas.
                Clique em <strong>"Salvar Categorias"</strong> para aplicar.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Informações do Usuário */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Informações do Usuário
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base">
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
    </div>
  );
};

export default ConfiguracoesPage;
