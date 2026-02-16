// src/components/auth/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { LogIn } from 'lucide-react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Input
        label="Email"
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={formData.email}
        onChange={handleChange}
        disabled={loading}
        placeholder="seu@email.com"
        className="bg-white dark:bg-dark-bg"
      />

      <Input
        label="Senha"
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        value={formData.password}
        onChange={handleChange}
        disabled={loading}
        placeholder="••••••••"
        className="bg-white dark:bg-dark-bg"
      />

      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-100 dark:border-red-900/30 animate-in fade-in slide-in-from-top-2">
          <div className="text-sm text-red-700 dark:text-red-300 font-medium text-center">{error}</div>
        </div>
      )}

      <div className="pt-2">
        <Button
          type="submit"
          disabled={loading}
          loading={loading}
          variant="primary"
          className="w-full justify-center"
          icon={LogIn}
        >
          Entrar
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
