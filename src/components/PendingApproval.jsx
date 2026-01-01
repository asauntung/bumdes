import React, { useState, useEffect } from 'react';
import { Check, X, Clock, AlertCircle } from 'lucide-react';

const PendingApproval = ({ user }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem('bumdes_transactions');
    if (savedData) {
      setTransactions(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bumdes_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const pendingTransactions = transactions.filter(t => t.status === 'pending');

  const handleApprove = (id) => {
    setTransactions(transactions.map(t => 
      t.id === id 
        ? { ...t, status: 'approved', approvedBy: user.username, approvedAt: new Date().toISOString() }
        : t
    ));
  };

  const handleReject = (id) => {
    if (confirm('Yakin ingin menolak transaksi ini? Data akan dihapus permanen.')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Clock className="text-orange-600" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Pending Approval</h2>
            <p className="text-slate-500 text-sm">Transaksi menunggu persetujuan Anda</p>
          </div>
        </div>

        {pendingTransactions.length > 0 && (
          <div className="mt-4 bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-lg flex items-start gap-2">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong>{pendingTransactions.length} transaksi</strong> menunggu persetujuan. 
              Periksa dengan teliti sebelum menyetujui.
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Dibuat Oleh</th>
              <th className="px-6 py-4">Keterangan</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4 text-right">Nominal</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pendingTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <Check size={48} className="text-slate-300" />
                    <p>Tidak ada transaksi pending. Semua sudah diproses!</p>
                  </div>
                </td>
              </tr>
            ) : (
              pendingTransactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600">{t.date}</td>
                  <td className="px-6 py-4">
                    <span className="text-slate-700 font-medium">{t.createdBy}</span>
                    <div className="text-xs text-slate-400">
                      {new Date(t.createdAt).toLocaleString('id-ID')}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800 max-w-xs">
                    {t.description}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{t.category}</td>
                  <td className={`px-6 py-4 text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatRupiah(t.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleApprove(t.id)}
                        className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                        title="Setujui"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => handleReject(t.id)}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                        title="Tolak"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingApproval;
