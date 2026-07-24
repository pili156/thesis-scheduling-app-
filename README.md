# Schedule Thesis App

Aplikasi Timeline, Tracking, Checklist, dan Penjadwalan Kegiatan Tugas Akhir berbasis Tauri.

## Fitur Utama

### Halaman Dashboard
- Kalender 30 hari dengan visualisasi kegiatan
- Jumlah kegiatan dan tugas untuk 3, 7, 30, dan 90 hari ke depan
- Navigasi interaktif ke halaman list tugas berdasarkan tanggal

### Halaman List Tugas
- Tabel tugas terurut dari tanggal terdekat
- abel prioritas (Tinggi/Sedang/Rendah) dengan badge berwarna
- Pencarian dan filter lanjutan (status, prioritas)
- Indikator tugas berulang dengan icon khusus
- Tombol tambah tugas

### Halaman Tambah & Edit Tugas
- Form lengkap: nama, tanggal, keterangan, prioritas
- Kalender interaktif untuk memilih tanggal
- 🧠 **Smart Date Parser** - ketik natural seperti "besok jam 3 sore"
- 🔄 Pengaturan tugas berulang  mingguan, bulanan, kustom)

### Halaman List Tugas Akhir
- 📂 Dropdown project dengan progress bar dinamis
- 📊 Progress bar real-time per phase dan keseluruhan project
- 👥 Data pembimbing dan partner project
- ⏳ Waktu tersisa per tugas

### Pop Up Data Pembimbing
- 📱 Nama, nomor telepon, email pembimbing
- ⚡ Aksi cepat: WhatsApp (deep link `wa.me`) dan Gmail compose
- ➕ Tambah multiple pembimbing

### Pop Up Partner Project
- 👤 Nama, nomor telepon, email partner
- ➕ Tambah multiple partner

## 🎨 Tema Warna

| Elemen | Warna |
|--------|-------|
| Background | `#1D185D` |
| Menu Atas/Samping | `#2D248C` |
| Garis Pembatas | `#8F2EFF` |
| Text Utama | `#E6E6E6` |
| Hover Button | `#3F2FD0` |
| Status Belum | `#B05600` |
| Status Selesai | `#07AB00` |
| Status Terlewat | `#AB0000` |

### Prioritas Tugas
- 🔴 Tinggi: `#D6002A`
- 🟡 Sedang: `#D6A400`
- 🟢 Rendah: `#3F8F2E`

## 🛠️ Teknologi

- [Tauri](https://tauri.app/) - Framework aplikasi desktop
- [React](https://reactjs.org/) / [Vue.js](https://vuejs.org/) - Frontend (pilih sesuai)
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [SQLite](https://www.sqlite.org/) / [PostgreSQL](https://www.postgresql.org/) - Database

## 📦 Struktur Database

### Tabel `tasks`
- `id` - Primary key
- `title` - Nama tugas
- `description` - Keterangan tugas
- `due_date` - Tanggal tugas
- `status` - (pending, completed, missed)
- `priority` - (high, medium, low)
- `is_recurring` - Boolean
- `recurrence_pattern` - Pola pengulangan
- `parent_task_id` - Relasi antar tugas

### Tabel `projects`
- `id` - Primary key
- `name` - Nama project
- `description` - Keterangan
- `start_date` - Tanggal mulai
- `end_date` - Tanggal selesai

### Tabel `phases`
- `id` - Primary key
- `project_id` - Foreign key ke projects
- `name` - Nama phase
- `order` - Urutan phase

### Tabel `subtasks`
- `id` - Primary key
- `phase_id` - Foreign key ke phases
- `name` - Nama subtugas
- `status` - Status pengerjaan
- `estimated_days` - Estimasi hari
- `actual_days` - Realisasi hari

### Tabel `supervisors`
- `id` - Primary key
- `project_id` - Foreign key ke projects
- `name` - Nama pembimbing
- `phone` - Nomor telepon
- `email` - Email

### Tabel `partners`
- `id` - Primary key
- `project_id` - Foreign key ke projects
- `name` - Nama partner
- `phone` - Nomor telepon
- `email` - Email

## 🚀 Instalasi

### Prasyarat
- Node.js (v18 atau lebih baru)
- Rust (v1.70 atau lebih baru)
- Sistem operasi: Windows, macOS, atau Linux

### Langkah Instalasi

```bash
# Clone repository
git clone https://github.com/[username-anda]/schedule-thesis-app.git

# Masuk ke direktori
cd schedule-thesis-app

# Install dependencies
npm install

# Jalankan aplikasi di mode development
npm run tauri dev

# Build aplikasi untuk produksi
npm run tauri build
