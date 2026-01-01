import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, TrendingUp, TrendingDown, FileText, Save, Clock } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Dashboard = ({ user }) => {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Operasional');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  const categories = [
    "Modal Awal",
    "Penjualan (Pangan)",
    "Jasa (Agen Bank/PPOB)",
    "Belanja Stok Barang",
    "Gaji & Operasional",
    "Inventaris/Aset",
    "Lain-lain"
  ];

  useEffect(() => {
    fetchTransactions();

    const subscription = supabase
      .channel('transactions')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'transactions' }, 
        () => {
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const approvedTransactions = transactions.filter(t => t.status === 'approved');
  
  const totalIncome = approvedTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = approvedTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const currentBalance = totalIncome - totalExpense;

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!description || !amount) {
      alert('Keterangan dan jumlah harus diisi!');
      return;
    }

    // SUPER SIMPLE - minimal data
    const newTransaction = {
      date: date,
      description: description,
      amount: parseInt(amount),
      type: type,
      category: category,
      status: user.role === 'direktur' ? 'approved' : 'pending',
      created_by: user.username,
      approved_by: user.role === 'direktur' ? user.username : null
    };

    console.log('🚀 Sending data:', newTransaction);
    console.log('👤 User:', user);

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([newTransaction])
        .select();

      if (error) {
        console.error('❌ SUPABASE ERROR:', error);
        alert('ERROR: ' + error.message);
        return;
      }

      console.log('✅ SUCCESS:', data);
      
      setDescription('');
      setAmount('');
      
      alert('✅ Transaksi berhasil disimpan!');
      fetchTransactions();
    } catch (error) {
      console.error('❌ CATCH ERROR:', error);
      alert('CATCH ERROR: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    const transaction = transactions.find(t => t.id === id);
    
    if (transaction.created_by !== user.username && user.role !== 'direktur') {
      alert('Anda hanya bisa menghapus transaksi yang Anda buat sendiri!');
      return;
    }

    if (confirm('Yakin ingin menghapus transaksi ini?')) {
      try {
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Gagal menghapus transaksi.');
      }
    }
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const getStatusBadge = (status) => {
    if (status === 'approved') {
      return <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Approved</span>;
    }
    return <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded flex items-center gap-1">
      <Clock size={12} /> Pending
    </span>;
  };

  const visibleTransactions = user.role === 'direktur' 
    ? transactions 
    : transactions.filter(t => t.created_by === user.username || t.status === 'approved');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Stats Cards */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-slate-500 text-sm font-medium mb-1">Saldo Kas (Approved)</p>
          <h3 className={`text-2xl font-bold ${currentBalance < 0 ? 'text-red-600' : 'text-blue-600'}`}>
            {formatRupiah(currentBalance)}
          </h3>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 bg-green-50/50">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-green-700"/>
            <p className="text-green-800 text-sm font-medium">Total Pemasukan</p>
          </div>
          <h3 className="text-2xl font-bold text-green-700">{formatRupiah(totalIncome)}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 bg-red-50/50">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={14} className="text-red-700"/>
            <p className="text-red-800 text-sm font-medium">Total Pengeluaran</p>
          </div>
          <h3 className="text-2xl font-bold text-red-700">{formatRupiah(totalExpense)}</h3>
        </div>
      </div>

      {/* Input Form */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText size={18} />
            Input Transaksi Baru
          </h2>
          
          {user.role === 'bendahara' && (
            <div className="mb-4 bg-orange-50 border border-orange-200 text-orange-700 px-3 py-2 rounded-lg text-xs">
              <strong>Info:</strong> Transaksi Anda akan masuk status Pending hingga disetujui Direktur.
            </div>
          )}

          <form onSubmit={handleAddTransaction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Transaksi</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg border ${type === 'income' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-slate-600 border-slate-300'}`}
                >
                  <Plus size={16} /> Masuk
                </button>
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg border ${type === 'expense' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-600 border-slate-300'}`}
                >
                  <Minus size={16} /> Keluar
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
              <input 
                type="date" 
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah (Rp)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400">Rp</span>
                <input 
                  type="number" 
                  required
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Keterangan</label>
              <textarea 
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contoh: Beli bibit padi 50kg"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-24 resize-none"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Save size={18} /> Simpan Transaksi
            </button>
          </form>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Transaksi Terakhir</h2>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">10 Teratas</span>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Keterangan</th>
                  <th className="px-6 py-3 text-right">Nominal</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">Belum ada transaksi.</td>
                  </tr>
                ) : (
                  visibleTransactions.slice(0, 10).map(t => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 text-slate-600 whitespace-nowrap">{t.date}</td>
                      <td className="px-6 py-3">
                        <div className="font-medium text-slate-800">{t.description}</div>
                        <div className="text-xs text-slate-500">{t.category}</div>
                      </td>
                      <td className={`px-6 py-3 text-right font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatRupiah(t.amount)}
                      </td>
                      <td className="px-6 py-3 text-center">
                        {getStatusBadge(t.status)}
                      </td>
                      <td className="px-6 py-3 text-center">
                        {(t.created_by === user.username || user.role === 'direktur') && (
                          <button 
                            onClick={() => handleDelete(t.id)}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
