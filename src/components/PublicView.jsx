import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wallet, Calendar, PieChart, Eye } from 'lucide-react';

const PublicView = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem('bumdes_transactions');
    if (savedData) {
      setTransactions(JSON.parse(savedData));
    }
  }, []);

  // Refresh data setiap 12 Jam
  useEffect(() => {
    const interval = setInterval(() => {
      const savedData = localStorage.getItem('bumdes_transactions');
      if (savedData) {
        setTransactions(JSON.parse(savedData));
      }
    }, 43200000); // 12 jam

    return () => clearInterval(interval);
  }, []);

  // Hanya tampilkan transaksi approved
  const approvedTransactions = transactions.filter(t => t.status === 'approved');

  const totalIncome = approvedTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = approvedTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const currentBalance = totalIncome - totalExpense;

  // Statistik per kategori
  const categoryStats = approvedTransactions.reduce((acc, t) => {
    if (!acc[t.category]) {
      acc[t.category] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      acc[t.category].income += t.amount;
    } else {
      acc[t.category].expense += t.amount;
    }
    return acc;
  }, {});

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 font-sans text-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <Eye className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Laporan Keuangan BUMDESa Margajaya
                  </h1>
                  <p className="text-slate-500 mt-1">Transparansi untuk Warga Desa</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500 mb-1">Terakhir Update:</div>
              <div className="text-lg font-semibold text-slate-700">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Info:</strong> Halaman ini menampilkan data keuangan real-time BUMDESa. 
              Data diperbarui otomatis setiap 30 detik. Hanya transaksi yang sudah disetujui yang ditampilkan.
            </p>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Wallet className="text-blue-600" size={28} />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Saldo Kas Saat Ini</p>
              </div>
            </div>
            <h3 className={`text-3xl font-bold ${currentBalance < 0 ? 'text-red-600' : 'text-blue-600'}`}>
              {formatRupiah(currentBalance)}
            </h3>
            <div className="mt-3 text-xs text-slate-400">Total uang kas & bank BUMDESa</div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-200 bg-gradient-to-br from-green-50 to-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-green-200 rounded-xl">
                <TrendingUp className="text-green-700" size={28} />
              </div>
              <div>
                <p className="text-green-800 text-sm font-medium">Total Pemasukan</p>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-green-700">{formatRupiah(totalIncome)}</h3>
            <div className="mt-3 text-xs text-green-600">{approvedTransactions.filter(t => t.type === 'income').length} transaksi</div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-200 bg-gradient-to-br from-red-50 to-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-red-200 rounded-xl">
                <TrendingDown className="text-red-700" size={28} />
              </div>
              <div>
                <p className="text-red-800 text-sm font-medium">Total Pengeluaran</p>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-red-700">{formatRupiah(totalExpense)}</h3>
            <div className="mt-3 text-xs text-red-600">{approvedTransactions.filter(t => t.type === 'expense').length} transaksi</div>
          </div>
        </div>

        {/* Statistik Per Kategori */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <PieChart className="text-purple-600" size={24} />
            </div>
            <h2 className="text-xl font-bold">Statistik Per Kategori</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(categoryStats).map(([category, stats]) => (
              <div key={category} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="font-semibold text-slate-800 mb-2">{category}</div>
                <div className="space-y-1 text-sm">
                  {stats.income > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Pemasukan:</span>
                      <span className="font-medium">{formatRupiah(stats.income)}</span>
                    </div>
                  )}
                  {stats.expense > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Pengeluaran:</span>
                      <span className="font-medium">{formatRupiah(stats.expense)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daftar Transaksi */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Riwayat Transaksi</h2>
              <p className="text-slate-500 text-sm">Semua transaksi yang telah disetujui</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left">Tanggal</th>
                  <th className="px-6 py-4 text-left">Keterangan</th>
                  <th className="px-6 py-4 text-left">Kategori</th>
                  <th className="px-6 py-4 text-right">Pemasukan</th>
                  <th className="px-6 py-4 text-right">Pengeluaran</th>
                  <th className="px-6 py-4 text-right">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {approvedTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                      Belum ada transaksi yang tercatat.
                    </td>
                  </tr>
                ) : (
                  [...approvedTransactions]
                    .sort((a, b) => new Date(b.date) - new Date(a.date) || b.id - a.id)
                    .slice(0, 50) // Tampilkan 50 transaksi terakhir
                    .reduce((acc, t, idx, arr) => {
                      // Hitung saldo berjalan (terbalik karena diurutkan desc)
                      const laterTransactions = arr.slice(idx + 1);
                      const laterIncome = laterTransactions.filter(x => x.type === 'income').reduce((s, x) => s + x.amount, 0);
                      const laterExpense = laterTransactions.filter(x => x.type === 'expense').reduce((s, x) => s + x.amount, 0);
                      const runningBalance = currentBalance - (laterIncome - laterExpense);
                      
                      acc.push({...t, runningBalance});
                      return acc;
                    }, [])
                    .reverse() // Balik lagi biar newest on top
                    .map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                          {formatDate(t.date)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-800 max-w-md">{t.description}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                            {t.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-green-600">
                          {t.type === 'income' ? formatRupiah(t.amount) : '-'}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-red-600">
                          {t.type === 'expense' ? formatRupiah(t.amount) : '-'}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-slate-700 bg-slate-50/50">
                          {formatRupiah(t.runningBalance)}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          {approvedTransactions.length > 50 && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 text-center text-sm text-slate-500">
              Menampilkan 50 transaksi terakhir dari total {approvedTransactions.length} transaksi
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>BUMDESa Margajaya - Sistem Keuangan Transparan</p>
          <p className="mt-1">Data diperbarui otomatis setiap 12 Jam</p>
        </div>
      </div>
    </div>
  );
};

export default PublicView;
