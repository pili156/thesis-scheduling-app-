# Schedule Thesis App

Aplikasi Timeline, Tracking, Checklist, dan Penjadwalan Kegiatan Tugas Akhir berbasis Tauri untuk mahasiswa menyusun dan memantau progres tugas akhir.

## Fitur Utama

### Halaman Dashboard
- Kalender 30 hari dengan visualisasi kegiatan
- Jumlah kegiatan dan tugas untuk 3, 7, 30, dan 90 hari ke depan
- Navigasi interaktif ke halaman list tugas berdasarkan tanggal

### Halaman List Tugas
- Tabel tugas terurut dari tanggal terdekat
- Label prioritas (Tinggi/Sedang/Rendah) dengan badge berwarna
- Pencarian dan filter lanjutan (status, prioritas)
- Indikator tugas berulang dengan icon khusus
- Tombol tambah tugas

### Halaman Tambah & Edit Tugas
- Form lengkap: nama, tanggal, keterangan, prioritas
- Kalender interaktif untuk memilih tanggal
- 🧠 **Smart Date Parser** — ketik natural seperti "besok jam 3 sore"
- 🔄 Pengaturan tugas berulang (mingguan, bulanan, kustom)

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

## 📖 Tentang

**Schedule Thesis App** adalah aplikasi desktop berbasis Tauri yang membantu mahasiswa menyusun, menjadwalkan, dan melacak progres tugas akhir. Aplikasi ini menyediakan kalender interaktif, manajemen tugas dengan prioritas, fitur tugas berulang, pelacakan progress proyek tugas akhir, serta manajemen data pembimbing dan partner proyek.

## 📦 Struktur Database

### Tabel `tasks`
- `id` — Primary key
- `title` — Nama tugas
- `description` — Keterangan tugas
- `due_date` — Tanggal tugas
- `status` — (pending, completed, missed)
- `priority` — (high, medium, low)
- `is_recurring` — Boolean
- `recurrence_pattern` — Pola pengulangan
- `parent_task_id` — Relasi antar tugas

### Tabel `projects`
- `id` — Primary key
- `name` — Nama project
- `description` — Keterangan
- `start_date` — Tanggal mulai
- `end_date` — Tanggal selesai

### Tabel `phases`
- `id` — Primary key
- `project_id` — Foreign key ke projects
- `name` — Nama phase
- `order` — Urutan phase

### Tabel `subtasks`
- `id` — Primary key
- `phase_id` — Foreign key ke phases
- `name` — Nama subtugas
- `status` — Status pengerjaan
- `estimated_days` — Estimasi hari
- `actual_days` — Realisasi hari

### Tabel `supervisors`
- `id` — Primary key
- `project_id` — Foreign key ke projects
- `name` — Nama pembimbing
- `phone` — Nomor telepon
- `email` — Email

### Tabel `partners`
- `id` — Primary key
- `project_id` — Foreign key ke projects
- `name` — Nama partner
- `phone` — Nomor telepon
- `email` — Email

## 🚀 Instalasi

### Prasyarat

Sebelum menginstal, pastikan Anda telah menginstal tool berikut:

| Tool | Versi Minimum | Instalasi |
|------|--------------|-----------|
| **Node.js** | v18+ | [nodejs.org](https://nodejs.org/) atau `nvm install 18` |
| **Rust** | v1.70+ | [rustup.rs](https://rustup.rs/) atau `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| **Cargo** | (ikut Rust) | Terinstal otomatis bersama Rust via rustup |
| **npm** | (ikut Node.js) | Terinstal otomatis bersama Node.js |

Untuk Linux, Anda juga mungkin perlu menginstal beberapa dependensi build:

```bash
# Ubuntu/Debian
sudo apt install build-essential libwebkit2gtk-4.1-dev \
  libappindicator3-dev librsvg2-dev patchelf

# Fedora
sudo dnf install gcc-c++ make patch glibc-devel \
  webkit2gtk3-devel appstream-glib librsvg2-devel

# Arch Linux
sudo pacman -S base-devel webkit2gtk librsvg

# macOS (menggunakan Homebrew)
brew install webkit2gtk librsvg
```

### Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/[username-anda]/schedule_thesis-app.git

# 2. Masuk ke direktori proyek
cd schedule_thesis-app

# 3. Instal dependensi Node.js
npm install

# 4. Jalankan aplikasi di mode development
npm run tauri dev
```

### Build untuk Produksi

```bash
# Build aplikasi untuk produksi (menghasilkan file .exe, .dmg, .deb, dll.)
npm run tauri build
```

File hasil build akan tersedia di `src-tauri/target/release/bundle/`.

### Verifikasi Build

```bash
# Preview build produksi secara lokal
npm run build
npm run preview
```

## 🛠️ Teknologi

- [Tauri v2](https://tauri.app/) — Framework aplikasi desktop Rust
- [React 19](https://reactjs.org/) — Library antarmuka pengguna
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Vite](https://vitejs.dev/) — Build tool dan dev server
- [React Router DOM](https://reactrouter.com/) — Routing sisi klien
- [Zustand](https://zustand-demo.pmnd.rs/) — State management
- [SQLite](https://www.sqlite.org/) — Database lokal (via rusqlite)
- [react-day-picker](https://react-day-picker.com/) — Komponen kalender