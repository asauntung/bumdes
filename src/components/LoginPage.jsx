import React, { useState } from 'react';
import { Wallet, Lock, User, AlertCircle, Eye } from 'lucide-react';

const LoginPage = ({ onLogin, onShowPublic }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Default users - bisa diubah sesuai kebutuhan
  const users = [
    { username: 'admin', password: 'dir121@', role: 'direktur', name: 'Direktur BUMDESa' },
    { username: 'bendahara', password: 'bendum5758', role: 'bendahara', name: 'Bendahara BUMDESa' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const foundUser = users.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      onLogin({
        username: foundUser.username,
        role: foundUser.role,
        name: foundUser.name
      });
    } else {
      setError('Username atau password salah!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-slate-200">
        
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Wallet className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Sistem Keuangan BUMDESa
          </h1>
          <p className="text-slate-500 text-sm">Margajaya - Login untuk masuk</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors shadow-sm"
          >
            Login
          </button>
        </form>

        {/* Tombol Lihat Laporan Publik */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">atau</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onShowPublic}
            className="mt-6 w-full bg-green-50 hover:bg-green-100 text-green-700 font-medium py-3 rounded-lg transition-colors border border-green-200 flex items-center justify-center gap-2"
          >
            <Eye size={18} />
            Lihat Laporan Publik (Warga)
          </button>
          
          <p className="mt-3 text-xs text-center text-slate-500">
            Klik di atas untuk melihat laporan keuangan tanpa login
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
