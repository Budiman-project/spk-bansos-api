# spk-bansos-api
REST API Sistem Pendukung Keputusan Penerima Bansos menggunakan metode Simple Additive Weighting (SAW). Dibangun dengan Express.js dan PostgreSQL.

## Prasyarat
- Node.js 24 LTS
- Docker Desktop

## Menjalankan (development)
```bash
cp .env.example .env
docker compose up -d db     # PostgreSQL
npm install
npm run db:migrate          # buat tabel
npm run db:seed             # data fiktif
npm run dev                 # http://localhost:3000/api/health
```

Akun seed (password `password123`): `admin.desa`, `rt001.rw001`, `rt002.rw001`, `rt003.rw001`.

## Uji API dengan Postman
Import `postman/spk-bansos-api.postman_collection.json`, lalu jalankan lewat Collection Runner:
- **Skenario RBAC**: login, `/auth/me`, akses `/users` sebagai desa = 200 dan sebagai RT = 403, logout.
- **Skenario Master Data**: CRUD Wilayah RT, Akun, dan Periode (validasi 400, duplikat 409, akses
  RT = 403). Data uji dibuat lalu dihapus kembali, jadi aman dijalankan berulang.
- **Skenario Kartu Keluarga**: CRUD KK dan pembatasan wilayah untuk akun RT.
- **Skenario Kriteria & Kuesioner**: bobot (Σ = 1), nama/sifat kriteria, pertanyaan, dan opsi jawaban.
  Pertanyaan uji dibuat lalu dihapus dan bobot disimpan ulang dengan nilai asli. Hanya berjalan bila
  kuesioner tidak terkunci (belum ada survei pada periode yang belum final).
- **Skenario Survei**: mulai survei, simpan jawaban, validasi kirim, pembatasan wilayah RT, akses desa,
  ringkasan per status, dan aturan verifikasi (hanya desa, hanya survei yang sudah dikirim).
  Prasyarat: ada periode yang dibuka, setiap pertanyaan sudah memiliki minimal 2 opsi jawaban, dan RT 001
  masih punya KK yang belum disurvei. Draf uji dihapus di akhir; kirim berhasil dan unggah foto diuji manual.
- **Skenario Perhitungan SAW**: hanya desa, validasi, menjalankan SAW, dan konsistensi hasil (ranking urut,
  V menurun, layak = kuota teratas). Prasyarat: periode dibuka dengan minimal 1 survei terverifikasi.
  Perhitungan yang berhasil tetap tersimpan sebagai riwayat.

## Data dummy untuk uji coba SAW
`npm run db:seed:dummy` (setelah `npm run db:seed`) mengisi opsi jawaban dummy untuk semua pertanyaan,
membuat survei terverifikasi untuk 9 KK contoh di periode yang dibuka, dan mengubah kuota menjadi 4.
Setelah itu buka menu Perhitungan SAW → Jalankan Perhitungan. Opsi dan skor ini hanya untuk pengujian,
bukan keputusan tim (skala C1 dibalik: 1 = pendapatan terendah, sesuai opsi C).

## Unit test SAW
`npm test` menjalankan uji mesin SAW (`src/lib/saw.js`, tanpa database): konversi nilai, normalisasi
benefit/cost, nilai V, ranking, kuota, dan aturan nilai seri.

Sesi memakai cookie httpOnly `spk.sid` yang otomatis disimpan Postman.
Tanpa Postman: `npx newman run postman/spk-bansos-api.postman_collection.json`.

## Deploy ke Vercel + Supabase
Dua project Vercel: **spk-bansos-api** (repo ini) dan **spk-bansos-web** (frontend). Basis data di Supabase.

**1. Supabase** → Project Settings → Database → Connection string:
- *Transaction pooler* (port **6543**) → dipakai aplikasi sebagai `DATABASE_URL`, tambahkan `?sslmode=require`.
- *Session pooler* / *Direct* (port **5432**) → `DIRECT_URL`, hanya untuk migrasi.

**2. Project Vercel `spk-bansos-api`** (Import repo ini; Framework Preset: *Other*, Root Directory: repo ini).
`vercel.json` sudah mengatur semuanya: build `npm run vercel-build` (bundel API dengan esbuild ke
`dist/`, lalu `prisma migrate deploy` bila `DIRECT_URL` ada), satu function `api/index.js`, region `sin1`
(Singapura, dekat Supabase Asia Tenggara; ganti bila region Supabase berbeda). Environment Variables:

| Nama | Isi |
|---|---|
| `DATABASE_URL` | string *Transaction pooler* (6543) + `?sslmode=require` |
| `DIRECT_URL` | string *Session pooler*/*Direct* (5432) |
| `SESSION_SECRET` | string acak panjang (wajib di production) |

Cek: `https://<domain-api>/api/health` → `{"status":"ok","db":"up"}`.

**3. Isi data** (sekali, dari komputer sendiri, `.env` berisi `DATABASE_URL` + `DIRECT_URL` Supabase):
```bash
npx prisma migrate deploy   # jika belum dijalankan oleh build Vercel
npm run db:seed             # akun, RT, KK, kriteria, bobot, opsi jawaban, periode (kuota 4)
npm run db:seed:dummy       # opsional: 9 survei simulasi sesuai Laporan Akhir
```

**4. Project Vercel `spk-bansos-web`**: di `vercel.json` repo frontend, ganti tujuan rewrite
`https://spk-bansos-api.vercel.app` dengan domain API yang sebenarnya. Frontend selalu memanggil `/api/...`
pada domainnya sendiri dan Vercel meneruskannya ke API, sehingga cookie sesi tetap *first-party*
(login juga berfungsi di Safari/iPhone). Jangan memanggil domain API langsung dari browser.

Catatan hosting:
- Foto survei di Vercel disimpan di `/tmp` instance: cukup untuk presentasi, tetapi dapat hilang saat
  instance didaur ulang (bukan penyimpanan permanen).
- Batas request Vercel 4,5 MB; frontend mengecilkan foto (maks. 1600 px, JPEG) sebelum diunggah.
- Uji bundel Vercel secara lokal: `npm run vercel-build`, lalu jalankan `api/index.js` sebagai handler.

## Menjalankan seluruh sistem (demo)
Pastikan repo frontend `spk-bansos-web` ada di `../../Frontend/spk-bansos-web` (atau atur `WEB_PATH` di `.env`), lalu:
```bash
docker compose up -d --build   # http://localhost:8080
```
Untuk mengisi data fiktif di container: `docker compose exec api npm run db:seed`.
