# Sistem Keuangan BUMDESa Margajaya

Aplikasi manajemen keuangan BUMDESa dengan fitur authentication dan approval workflow.

## 🎯 Fitur Utama

### Role & Authentication
- **Direktur**: Akses penuh, approve/reject transaksi bendahara
- **Bendahara**: Input transaksi (status pending hingga direktur menyetujui)

### Dashboard
- Input transaksi (pemasukan/pengeluaran)
- Statistik real-time (saldo, pemasukan, pengeluaran)
- Riwayat transaksi

### Pending Approval (Direktur Only)
- Review transaksi dari bendahara
- Approve atau reject dengan satu klik

### Buku Kas Umum (BKU)
- Laporan lengkap dengan saldo berjalan
- Export ke CSV/Excel
- Hanya menampilkan transaksi approved
  
---

## 🚀 Deployment ke GitHub Pages

### Step 1: Setup Lokal

```bash
# Clone atau download project ini
cd bumdes-finance

# Install dependencies
npm install
```

### Step 2: Buat Repository GitHub

1. Buka https://github.com/new
2. Nama repository: `bumdes-finance` (atau sesuai keinginan)
3. **PENTING**: Repository harus **Public** untuk GitHub Pages gratis
4. Jangan centang "Initialize with README"
5. Klik **Create repository**

### Step 3: Edit `vite.config.js`

Buka file `vite.config.js` dan ganti `base` dengan nama repo Anda:

```js
export default defineConfig({
  plugins: [react()],
  base: '/bumdes-finance/', // ← Ganti dengan nama repo Anda
})
```

Contoh:
- Jika repo bernama `keuangan-desa`, ubah jadi `base: '/keuangan-desa/'`
- Jika repo bernama `my-finance`, ubah jadi `base: '/my-finance/'`

### Step 4: Push ke GitHub

Jalankan command ini di terminal (dari folder project):

```bash
# Inisialisasi git
git init

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "Initial commit"

# Ganti <username> dan <repo-name> dengan milik Anda
git remote add origin https://github.com/<username>/<repo-name>.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

**Contoh nyata:**
```bash
git remote add origin https://github.com/budi123/bumdes-finance.git
```

### Step 5: Deploy ke GitHub Pages

```bash
# Build dan deploy
npm run deploy
```

Command ini akan:
1. Build production version
2. Push ke branch `gh-pages`
3. Otomatis deploy

### Step 6: Aktifkan GitHub Pages

1. Buka repository di GitHub
2. Klik tab **Settings**
3. Scroll ke **Pages** (di sidebar kiri)
4. Di **Source**, pilih: `Deploy from a branch`
5. Di **Branch**, pilih: `gh-pages` dan folder `/root`
6. Klik **Save**

### Step 7: Akses Online

Tunggu 1-2 menit, lalu akses di:
```
https://<username>.github.io/<repo-name>/
```

**Contoh:**
- Username: `budi123`
- Repo: `bumdes-finance`
- URL: `https://budi123.github.io/bumdes-finance/`

---

## 🔄 Update Setelah Edit Kode

Setiap kali ada perubahan kode:

```bash
# Commit perubahan
git add .
git commit -m "Deskripsi perubahan"
git push

# Deploy ulang
npm run deploy
```

---

## 🛠️ Development Lokal

```bash
# Jalankan development server
npm run dev

# Buka browser ke: http://localhost:5173
```

---

## 📁 Struktur Project

```
bumdes-finance/
├── src/
│   ├── components/
│   │   ├── LoginPage.jsx       # Halaman login
│   │   ├── Dashboard.jsx       # Input transaksi & dashboard
│   │   ├── PendingApproval.jsx # Approval (direktur only)
│   │   └── BukuKasUmum.jsx     # Laporan BKU
│   ├── App.jsx                 # Main app + routing
│   ├── main.jsx                # Entry point
│   └── index.css               # Styles
├── index.html
├── package.json
├── vite.config.js              # ← Edit 'base' di sini!
└── README.md
```

---

## 🎨 Customization

### Ganti Password Default

Edit `src/components/LoginPage.jsx`, cari bagian:

```jsx
const users = [
  { username: 'admin', password: 'passwordDirektur', role: 'direktur', name: 'Direktur BUMDESa' },
  { username: 'bendahara', password: 'passwordBendahara', role: 'bendahara', name: 'Bendahara BUMDESa' }
];
```

### Tambah Kategori

Edit `src/components/Dashboard.jsx`, cari:

```jsx
const categories = [
  "Modal Awal",
  "Penjualan (Pangan)",
  // ... tambahkan di sini
];
```

---

## 🐛 Troubleshooting

### Halaman 404 setelah deploy

**Solusi:** Pastikan `base` di `vite.config.js` sama dengan nama repo Anda.

### CSS tidak muncul

**Solusi:** 
1. Pastikan sudah `npm install`
2. Clear cache browser (Ctrl+Shift+R)

### Deploy gagal

**Solusi:**
1. Pastikan repository **Public**
2. Cek apakah `gh-pages` package terinstall: `npm install -D gh-pages`

---

## 💾 Data Storage

- Data tersimpan di **localStorage** browser
- **PENTING**: Data tidak sinkron antar device/browser
- Backup manual: Download CSV dari Buku Kas Umum

---

## 📞 Support

Untuk pertanyaan atau bantuan, silakan buka issue di GitHub repository.

---

**Dibuat untuk BUMDESa Margajaya** 🏘️
