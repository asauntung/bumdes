import React, { useState, useEffect } from 'react';
import { Download, FileText } from 'lucide-react';

const BukuKasUmum = ({ user }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem('bumdes_transactions');
    if (savedData) {
      setTransactions(JSON.parse(savedData));
    }
  }, []);

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const downloadCSV = () => {
    const approvedTransactions = transactions.filter(t => t.status === 'approved');
    
    const headers = ["Tanggal", "No. Bukti", "Uraian", "Kategori", "Penerimaan", "Pengeluaran", "Saldo", "Dibuat Oleh", "Disetujui Oleh"];
    
    const sortedTransactions = [...approvedTransactions]
      .sort((a, b) => new Date(a.date) - new Date(b.date) || a.id - b.id);
    
    let runningBalance = 0;
    const rows = sortedTransactions.map(t => {
      runningBalance = t.type === 'income' ? runningBalance + t.amount : runningBalance - t.amount;
      
      return [
        t.date,
        `#${t.id.toString().slice(-6)}`,
        `"${t.description}"`,
        t.category,
        t.type === 'income' ? t.amount : 0,
        t.type === 'expense' ? t.amount : 0,
        runningBalance,
        t.createdBy,
        t.approvedBy || '-'
      ].join(',');
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BKU_BUMDESa_Margajaya_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Hanya tampilkan transaksi yang sudah approved
  const approvedTransactions = transactions.filter(t => t.status === 'approved');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Buku Kas Umum (BKU)</h2>
            <p className="text-slate-500 text-sm">Laporan keuangan yang telah disetujui</p>
          </div>
        </div>
        <button 
          onClick={downloadCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
        >
          <Download size={16} /> Download CSV/Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">No. Bukti</th>
              <th className="px-6 py-4">Uraian Transaksi</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4 text-right text-green-700">Penerimaan</th>
              <th className="px-6 py-4 text-right text-red-700">Pengeluaran</th>
              <th className="px-6 py-4 text-right">Saldo</th>
              {user.role === 'direktur' && (
                <>
                  <th className="px-6 py-4 text-center">Dibuat</th>
                  <th className="px-6 py-4 text-center">Disetujui</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {approvedTransactions.length === 0 ? (
              <tr>
                <td colSpan={user.role === 'direktur' ? 9 : 7} className="px-6 py-12 text-center text-slate-400 italic">
                  Belum ada transaksi yang disetujui.
                </td>
              </tr>
            ) : (
              [...approvedTransactions]
                .sort((a, b) => new Date(a.date) - new Date(b.date) || a.id - b.id)
                .reduce((acc, t, idx) => {
                  const prevBalance = idx === 0 ? 0 : acc[idx - 1].runningBalance;
                  const newBalance = t.type === 'income' 
                    ? prevBalance + t.amount 
                    : prevBalance - t.amount;
                  
                  acc.push({ ...t, runningBalance: newBalance });
                  return acc;
                }, [])
                .map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap text-slate-600">{t.date}</td>
                    <td className="px-6 py-3 text-xs text-slate-400 font-mono">#{t.id.toString().slice(-6)}</td>
                    <td className="px-6 py-3 font-medium text-slate-800 max-w-md">{t.description}</td>
                    <td className="px-6 py-3 text-slate-500">{t.category}</td>
                    <td className="px-6 py-3 text-right text-green-600 font-medium">
                      {t.type === 'income' ? formatRupiah(t.amount) : '-'}
                    </td>
                    <td className="px-6 py-3 text-right text-red-600 font-medium">
                      {t.type === 'expense' ? formatRupiah(t.amount) : '-'}
                    </td>
                    <td className="px-6 py-3 text-right font-bold text-slate-700 bg-slate-50/50">
                      {formatRupiah(t.runningBalance)}
                    </td>
                    {user.role === 'direktur' && (
                      <>
                        <td className="px-6 py-3 text-center text-xs text-slate-500">
                          {t.createdBy}
                        </td>
                        <td className="px-6 py-3 text-center text-xs text-slate-500">
                          {t.approvedBy || '-'}
                        </td>
                      </>
                    )}
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {approvedTransactions.length > 0 && (
        <div className="p-6 bg-slate-50 border-t border-slate-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">Total Transaksi Tercatat:</span>
            <span className="font-bold text-slate-900">{approvedTransactions.length} transaksi</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BukuKasUmum;
