// src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Wallet,
  Home,
  Calendar,
  Settings,
  BarChart3,
  Menu,
  X,
  User,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/meses', icon: Calendar, label: 'Meses' },
    { path: '/relatorios', icon: BarChart3, label: 'Relatórios' },
    { path: '/configuracoes', icon: Settings, label: 'Configurações' },
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/auth', { replace: true });
  };

  const handleUserMenuToggle = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Wallet className="h-8 w-8" />
            <h1 className="text-xl font-bold">Finance App</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:text-white hover:bg-blue-500'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={handleUserMenuToggle}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-blue-100 hover:text-white hover:bg-blue-500"
              >
                <User className="h-5 w-5" />
                <span className="font-medium max-w-32 truncate">
                  {user?.name || 'Usuário'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              className="p-2 rounded-lg hover:bg-blue-500 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-2 border-t border-blue-500 pt-4">
            {/* User Info Mobile */}
            <div className="px-3 py-2 mb-2 bg-blue-500 rounded-lg">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-blue-100 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-700 text-white'
                        : 'text-blue-100 hover:text-white hover:bg-blue-500'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}

              {/* Logout Button Mobile */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-3 rounded-lg transition-colors text-blue-100 hover:text-white hover:bg-blue-500 text-left"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sair</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Overlay para fechar menus ao clicar fora */}
      {(mobileMenuOpen || userMenuOpen) && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => {
            setMobileMenuOpen(false);
            setUserMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
