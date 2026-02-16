// src/components/auth/RegisterForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { UserPlus } from 'lucide-react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateForm = () => {
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const result = await register(
      formData.email,
      formData.name,
      formData.password,
    );

    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        label="Nome"
        id="name"
        name="name"
        type="text"
        autoComplete="name"
        required
        value={formData.name}
        onChange={handleChange}
        disabled={loading}
        placeholder="Seu nome completo"
        className="bg-white dark:bg-dark-bg"
      />

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
        autoComplete="new-password"
        required
        value={formData.password}
        onChange={handleChange}
        disabled={loading}
        placeholder="Mínimo 6 caracteres"
        className="bg-white dark:bg-dark-bg"
      />

      <Input
         label="Confirmar Senha"
         id="confirmPassword"
         name="confirmPassword"
         type="password"
         autoComplete="new-password"
         required
         value={formData.confirmPassword}
         onChange={handleChange}
         disabled={loading}
         placeholder="Digite a senha novamente"
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
          icon={UserPlus}
        >
          Criar conta
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
