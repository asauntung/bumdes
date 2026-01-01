import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import PendingApproval from './components/PendingApproval';
import BukuKasUmum from './components/BukuKasUmum';
import { LogOut, Wallet } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const savedUser = localStorage.getItem('bumdes_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('bumdes_current_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    if (confirm('Yakin ingin keluar?')) {
      setUser(null);
      localStorage.removeItem('bumdes_current_user');
      setActiveTab('dashboard');
    }
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Wallet className="text-blue-600" />
              Sistem Keuangan BUMDESa Margajaya
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Login sebagai: <span className="font-semibold text-slate-700">{user.username}</span> ({user.role === 'direktur' ? 'Direktur' : 'Bendahara'})
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2 flex-wrap">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              Dashboard & Input
            </button>
            
            {user.role === 'direktur' && (
              <button 
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'pending' ? 'bg-orange-600 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
              >
                Pending Approval
              </button>
            )}
            
            <button 
              onClick={() => setActiveTab('report')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'report' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              Buku Kas Umum
            </button>

            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 hover:bg-red-200 text-red-700 transition-colors flex items-center gap-2"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        {/* Content */}
        {activeTab === 'dashboard' && <Dashboard user={user} />}
        {activeTab === 'pending' && user.role === 'direktur' && <PendingApproval user={user} />}
        {activeTab === 'report' && <BukuKasUmum user={user} />}
      </div>
    </div>
  );
}

export default App;
