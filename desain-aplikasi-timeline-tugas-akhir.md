# DESAIN APLIKASI TIMELINE, TRACKING, CHECKLIST, PENJADWALAN KEGIATAN DAN TUGAS AKHIR

## Global Style
- Latar belakang aplikasi akan berwarna #A4B885
- Garis pembatas antar widget seperti menu samping dan atas berwarna #D46D25
- Warna tombol 1 #FDC086
- Warna tombol 2 #FFF6A1
- Teks dari aplikasi akan berwarna #2d2e20
- Warna dari menu atas dan samping `#2D248C`
- Ketika kursor berada di atas tombol maka tombol akan berwarna `#3F2FD0`
- Warna dari status belum `#B05600`
- Warna dari status selesai `#07AB00`
- Warna dari status terlewat `#AB0000`
- Warna label prioritas tugas:
  - Prioritas Tinggi `#D6002A`
  - Prioritas Sedang `#D6A400`
  - Prioritas Rendah `#3F8F2E`
  
## Halaman 1 - Dashboard
- Halaman Dashboard yang menunjukkan kalender 30 hari
- Terdapat data berapa banyak kegiatan dan tugas yang perlu dilakukan 3 hari, 7 hari, 30 hari dan 90 hari kedepan
- Ketika ditekan maka akan pindah pada halaman kedua yang akan memfilter data pada halaman tersebut sesuai dengan tanggal yang ditekan di halaman pertama

## Halaman 2 - List Tugas
- Halaman ini akan digunakan sebagai table list tugas dengan tanggal terdekat hingga terjauh, dengan tanggal terdekat berada paling atas
- Table terdiri dari tanggal, nama tugas, keterangan tugas, status tugas (Belum, Selesai, Terlewat)
- Terdapat tombol tambah tugas dengan icon tambah, tombol ini akan mengarah ke halaman 2.1
- **[Fitur Baru] Label Prioritas Tugas**
  - Setiap baris tugas menampilkan label prioritas: Tinggi, Sedang, Rendah
  - Label prioritas ditampilkan sebagai badge berwarna di samping status tugas
  - Prioritas dapat digunakan untuk mengurutkan tabel (sorting) selain berdasarkan tanggal
- **[Fitur Baru] Pencarian dan Filter Lanjutan**
  - Kolom pencarian di bagian atas tabel untuk mencari tugas berdasarkan nama tugas
  - Filter berdasarkan status tugas (Belum, Selesai, Terlewat)
  - Filter berdasarkan prioritas (Tinggi, Sedang, Rendah)
  - Filter dapat dikombinasikan (contoh: status "Belum" + prioritas "Tinggi")
- **[Fitur Baru] Indikator Tugas Berulang**
  - Tugas yang bersifat berulang (recurring) ditandai dengan icon khusus (misal icon refresh/lingkar panah) di samping nama tugas

## Halaman 2.1 - Tambah Tugas
- Halaman ini akan memiliki beberapa form yaitu nama tugas, tanggal tugas, keterangan tugas
- Form tanggal tugas akan berbentuk kalender terbuka
- **[Fitur Baru] Smart Date Parser**
  - Selain memilih tanggal lewat kalender, tersedia input teks bebas di atas kalender
  - User dapat mengetikkan tanggal secara natural, misalnya `"besok jam 3 sore"` atau `"Jumat depan"`
  - Sistem akan otomatis mem-parsing teks tersebut menjadi tanggal dan jam yang valid, lalu menyorot tanggal tersebut di kalender sebagai konfirmasi visual
- **[Fitur Baru] Pengaturan Prioritas Tugas**
  - Form dropdown/selector untuk memilih prioritas tugas: Tinggi, Sedang, Rendah
- **[Fitur Baru] Pengaturan Tugas Berulang (Recurring Task)**
  - Toggle/switch "Jadikan tugas berulang"
  - Jika diaktifkan, muncul opsi pola pengulangan, misalnya:
    - Harian
    - Mingguan (pilih hari, contoh: setiap Senin)
    - Bulanan (pilih tanggal)
    - Kustom (contoh: setiap 2 minggu sekali)
  - Cocok digunakan untuk kegiatan rutin seperti "Bimbingan dengan Dosen Pembimbing" atau "Mengumpulkan Laporan Mingguan"
  - Sistem otomatis membuat instance tugas baru sesuai pola setelah instance sebelumnya selesai atau sesuai jadwal

## Halaman 2.2 - Edit Tugas
- Halaman ini akan digunakan sebagai halaman edit tugas
- Halaman hanya dapat mengedit bagian keterangan tugas, dan tanggal tugas
- **[Fitur Baru] Smart Date Parser** juga tersedia di form edit tanggal tugas, sama seperti pada Halaman 2.1
- **[Fitur Baru] Edit Prioritas dan Pola Berulang**
  - Prioritas tugas dapat diubah dari halaman edit ini
  - Jika tugas bersifat berulang, pola pengulangan dapat disesuaikan atau dihentikan (unsubscribe dari pengulangan) dari halaman ini

## Halaman 3 - List Tugas Akhir
- Halaman ini akan digunakan sebagai list tugas akhir yang sedang dikerjakan
- List dari halaman ini berbentuk dropdown dimana kepalanya adalah nama projek tugas akhir
- Ketika kepala projek ditekan maka akan muncul data dari project tersebut dengan urutan: keterangan projek, nama pembimbing, nama partner project, tanggal mulai hingga selesai projek, lalu phase tugas akhir
- Bagian phase tugas akhir akan menampilkan progress bar dari tugasnya dalam persentase
- Bagian phase tugas akhir dapat ditekan dan menjadi dropdown dengan data yang ditampilkan adalah nama tugas, status tugas, dan waktu yang tersisa
- Ketika nama pembimbing ditekan maka akan muncul Pop Up 3.1 data pembimbing
- **[Fitur Baru] Progress Bar Dinamis Real-Time**
  - Ketika user menandai sebuah tugas di dalam suatu phase sebagai "Selesai", progress bar phase tersebut otomatis bertambah sesuai proporsi tugas yang selesai
  - Progress bar diperbarui secara real-time tanpa perlu refresh halaman, memberikan kepuasan visual layaknya checklist di Trello
  - Progress keseluruhan project (gabungan semua phase) juga ditampilkan di bagian kepala dropdown project
- **[Fitur Baru] Pencarian dan Filter Lanjutan**
  - Kolom pencarian untuk mencari project tugas akhir atau tugas di dalam phase berdasarkan nama
  - Filter berdasarkan status tugas dan berdasarkan fase (phase) tertentu

Halaman 3.1 - Halaman ini digunakan untuk membuat tugas akhir yang akan dikerjakan.
            - Pada halaman ini akan terdapat beberapa form data seperti nama tugas akhir, tanggal mulai hingga selesai tugas akhir, isi data pembimbing, isi data partner projek, keterangan projek tugas akhir, phase tugas akhir.
            - Pada bagian phase tugas akhir user dapat menentukan berapa banyak jumlah phase yang dibutuhkan dan menentukan nama phasenya(Contoh : user menambahkan 3 phase. phase proposal, phase literatur review, dan phase praktek)
            - Pada setiap phase user dapat menambahkan beberapa tugas pada phase tersebut (Contoh : pada phase proposal, tugas pada phase tersebut adalah mencari ide, membandingkan ide, menentukan latar belakang, dan lainnya)
            - setiap tugas dapat diberikan waktu yang dibutuhkan dalam penyelesaiannya dengan menggunakan form (Contoh : Tugas Mencari Ide akan diberikan waktu 2 hari)
            - ketika tombol isi data pembimbing ditekan maka akan muncul Pop Up 3.2
            - ketika tombol isi data partner projek ditekan maka akan muncul Pop Up 3.3

## Pop Up 3.1 - Data Pembimbing
- Pop Up ini hanya berguna untuk menampilkan data pembimbing tugas akhir yang berisikan nama, nomor telpon, dan email
- Ketika nomor telpon dosen ditekan maka akan langsung berpindah ke halaman WhatsApp
- Ketika email ditekan maka akan berpindah ke halaman email Google
- **[Fitur Baru] Integrasi Aksi Cepat**
  - Tombol nomor telepon dan email ditampilkan sebagai tombol aksi (bukan sekadar teks tautan), lengkap dengan icon WhatsApp dan Gmail agar terasa seperti aplikasi CRM modern
  - Menekan tombol nomor telepon langsung membuka chat WhatsApp dengan nomor tersebut (deep link `wa.me`)
  - Menekan tombol email langsung membuka compose email baru di Gmail dengan alamat tujuan sudah terisi

## Pop Up 3.2 - Input Data Pembimbing
- Pop Up ini digunakan untuk mengisi data dari pembimbing tugas akhir
- Data dari pembimbing adalah nama pembimbing, nomor telpon, email pembimbing
- Terdapat tombol tambah pembimbing jika terdapat lebih dari 1 pembimbing

## Pop Up 3.3 - Input Data Partner Projek
- Pop up ini digunakan untuk mengisi data dari partner projek tugas akhir
- Data dari partner projek adalah nama partner projek, nomor telpon, email partner projek
- Terdapat tombol tambah partner jika terdapat lebih dari 1 partner

## Fitur Tambahan Lintas Halaman

### 1. Tugas Berulang (Recurring Tasks)
- Digunakan untuk kegiatan rutin seperti "Bimbingan dengan Dosen Pembimbing" atau "Mengumpulkan Laporan Mingguan"
- Pengaturan pola pengulangan dilakukan di Halaman 2.1 (buat baru) dan Halaman 2.2 (edit pola)
- Ditandai dengan icon khusus di Halaman 2

### 2. Status Prioritas Tugas
- Label prioritas (Tinggi, Sedang, Rendah) ditambahkan di Halaman 2
- Diatur melalui form di Halaman 2.1 dan dapat diubah di Halaman 2.2
- Membantu menentukan urutan pengerjaan tugas

### 3. Pencarian dan Filter Lanjutan
- Tersedia di Halaman 2 (list tugas) dan Halaman 3 (list tugas akhir)
- Pencarian berdasarkan nama tugas/project
- Filter berdasarkan status, prioritas, dan/atau fase

### 4. Smart Date Parser
- Tersedia di Halaman 2.1 dan Halaman 2.2
- User dapat mengetikkan tanggal secara natural (contoh: "besok jam 3 sore", "Jumat depan")
- Sistem otomatis mengonversi teks menjadi tanggal yang valid

### 5. Notifikasi dan Pengingat
- Pengingat proaktif, contoh: notifikasi pop-up atau email sehari sebelum tenggat waktu tugas penting
- Notifikasi tambahan saat sebuah tugas menghambat/memblokir tugas lain (dependency)
- Melengkapi status "Terlewat" yang sudah ada sebelumnya

### 6. Progres Phase yang Lebih Dinamis
- Progress bar phase di Halaman 3 otomatis bertambah saat sebuah tugas di dalam phase ditandai "Selesai"
- Update dilakukan secara real-time

### 7. Integrasi Aksi pada Pop Up 3.1
- Nomor telepon pembimbing terhubung langsung ke WhatsApp
- Email pembimbing terhubung langsung ke Gmail (compose)

## Struktur Data Pendukung (Draft Awal)

### Tabel `tasks`
- `priority` (enum: high, medium, low)
- `is_recurring` (boolean)
- `recurrence_pattern` (string, contoh: `'every monday'`)
- `parent_task_id` (relasi antar tugas, untuk dependency/instance recurring)

### Tabel `projects` (Tugas Akhir)
- `template_id` (jika menggunakan fitur templat)

### Tabel `phases`
- Relasi ke `projects`

### Tabel `subtasks`
- Relasi ke `phases`
- `estimated_days` dan `actual_days` (untuk analisis estimasi vs realisasi waktu pengerjaan)
