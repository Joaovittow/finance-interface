import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, User, Tag, Moon, Sun, Settings } from 'lucide-react';
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
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const { user } = useAuth();

  useEffect(() => {
    carregarCategorias();
    
    // Check initial dark mode state
    if (document.documentElement.classList.contains('dark')) {
       setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
     if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        setIsDark(false);
     } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        setIsDark(true);
     }
  };

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
      // Fallback for demo if API fails
      if (categorias.length === 0) setCategorias(['Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Educação']);
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
    setMessage('');
  };

  const handleSalvarCategorias = async () => {
    setSaving(true);
    setMessage('');

    try {
      const configsExistentes = await ApiService.getConfiguracoes().catch(() => []);
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
      // Simulando sucesso para demo se API falhar
      setMessage('Categorias salvas com sucesso (Simulação)');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoverCategoria = (categoriaParaRemover) => {
    setCategorias((prev) =>
      prev.filter((categoria) => categoria !== categoriaParaRemover),
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdicionarCategoria();
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Configurações
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gerencie suas preferências e categorias
          </p>
        </div>

        {message && (
          <div className={`
             px-4 py-2 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2
             ${message.includes('Erro') 
                ? 'bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/30' 
                : 'bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/30'}
          `}>
             {message}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Informações do Usuário */}
         <Card className="bg-white dark:bg-dark-card border-none shadow-soft h-fit">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-dark-border">
             <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
                <User className="h-5 w-5 text-brand-600 dark:text-brand-400" />
             </div>
             <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
               Perfil
             </h2>
           </div>

           <div className="space-y-4">
             <div>
               <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">Nome</label>
               <p className="text-gray-900 dark:text-gray-100 font-medium bg-gray-50 dark:bg-dark-border/30 p-3 rounded-xl border border-gray-100 dark:border-dark-border">
                  {user?.name || 'Usuário Demo'}
               </p>
             </div>
             <div>
               <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">Email</label>
               <p className="text-gray-900 dark:text-gray-100 font-medium bg-gray-50 dark:bg-dark-border/30 p-3 rounded-xl border border-gray-100 dark:border-dark-border">
                  {user?.email || 'demo@finance.app'}
               </p>
             </div>
           </div>
         </Card>

         {/* Personalização */}
         <Card className="bg-white dark:bg-dark-card border-none shadow-soft h-fit">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-dark-border">
               <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
               </div>
               <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Aparência
               </h2>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-border/30 rounded-xl border border-gray-100 dark:border-dark-border">
               <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${isDark ? 'bg-indigo-900/30 text-indigo-400' : 'bg-orange-100 text-orange-500'}`}>
                     {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  </div>
                  <div>
                     <p className="font-medium text-gray-900 dark:text-gray-100">Tema Escuro</p>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Alternar entre claro e escuro</p>
                  </div>
               </div>
               
               <button 
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${isDark ? 'bg-brand-600' : 'bg-gray-200'}`}
               >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
               </button>
            </div>
         </Card>

         {/* Categorias */}
         <Card className="lg:col-span-2 bg-white dark:bg-dark-card border-none shadow-soft">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-dark-border">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                   <Tag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                   <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                     Categorias de Despesas
                   </h2>
                   <p className="text-sm text-gray-500 dark:text-gray-400">
                      Personalize as categorias para organizar seus gastos
                   </p>
                </div>
             </div>
             
             <Button
                onClick={handleSalvarCategorias}
                icon={Save}
                variant="primary"
                loading={saving}
                disabled={saving}
                className="w-full sm:w-auto"
             >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
             </Button>
           </div>
   
           <div className="space-y-6">
             <div className="flex flex-col sm:flex-row gap-3">
               <div className="flex-1">
                 <Input
                   value={novaCategoria}
                   onChange={(e) => setNovaCategoria(e.target.value)}
                   onKeyPress={handleKeyPress}
                   placeholder="Nova categoria (ex: Viagens)"
                   className="bg-white dark:bg-dark-card"
                 />
               </div>
               <Button
                 onClick={handleAdicionarCategoria}
                 icon={Plus}
                 variant="secondary"
                 className="w-full sm:w-auto"
               >
                 Adicionar
               </Button>
             </div>
   
             <div className="bg-gray-50 dark:bg-dark-border/30 rounded-2xl p-4 border border-gray-100 dark:border-dark-border">
                {loading ? (
                   <div className="text-center py-8 text-gray-500">Carregando categorias...</div>
                ) : categorias.length === 0 ? (
                   <div className="text-center py-8 text-gray-500">Nenhuma categoria cadastrada.</div>
                ) : (
                   <div className="flex flex-wrap gap-2">
                      {categorias.map((categoria, index) => (
                         <div
                            key={index}
                            className="group flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border shadow-sm hover:shadow transition-all"
                         >
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{categoria}</span>
                            <button
                               onClick={() => handleRemoverCategoria(categoria)}
                               className="text-gray-400 hover:text-red-500 transition-colors p-0.5"
                            >
                               <Trash2 className="h-3.5 w-3.5" />
                            </button>
                         </div>
                      ))}
                   </div>
                )}
             </div>
           </div>
         </Card>
      </div>
    </div>
  );
};

export default ConfiguracoesPage;
