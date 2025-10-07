// src/pages/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, loading } = useAuth();

  // Se já estiver autenticado, redireciona para a página inicial
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">💰</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
          <button
            type="button"
            className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition-all"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Cadastre-se aqui' : 'Faça login aqui'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
