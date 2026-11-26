// Answer options + 1–5 scores per question, as used in the Laporan Akhir (Bab III–IV). Seeded by
// prisma/seed.js into every question that has no options yet.
//
// Scale: 5 = most urgent for every question EXCEPT question 1 (C1). C1 is cost (Tabel 2.1) with
// "skor 1 = pendapatan terendah", so the lowest income gets the smallest score and, through
// r = min / x, the highest r.

// Per question code: options in display order, each { label, skor }
export const OPSI_JAWABAN = {
  1: [
    {
      label: 'Kurang dari Rp1.000.000',
      skor: 1,
    },
    {
      label: 'Rp1.000.000 – Rp1.999.999',
      skor: 2,
    },
    {
      label: 'Rp2.000.000 – Rp2.999.999',
      skor: 3,
    },
    {
      label: 'Rp3.000.000 – Rp4.999.999',
      skor: 4,
    },
    {
      label: 'Rp5.000.000 atau lebih',
      skor: 5,
    },
  ],
  '2a': [
    {
      label: 'Tidak bekerja',
      skor: 5,
    },
    {
      label: 'Buruh harian lepas / serabutan',
      skor: 4,
    },
    {
      label: 'Petani, nelayan, atau pedagang kecil',
      skor: 3,
    },
    {
      label: 'Karyawan kontrak',
      skor: 2,
    },
    {
      label: 'PNS/TNI/Polri atau karyawan tetap',
      skor: 1,
    },
  ],
  '2b': [
    {
      label: 'Ya, ada',
      skor: 5,
    },
    {
      label: 'Tidak ada',
      skor: 1,
    },
  ],
  '3a': [
    {
      label: '4 anak atau lebih',
      skor: 5,
    },
    {
      label: '3 anak',
      skor: 4,
    },
    {
      label: '2 anak',
      skor: 3,
    },
    {
      label: '1 anak',
      skor: 2,
    },
    {
      label: 'Tidak ada',
      skor: 1,
    },
  ],
  '3b': [
    {
      label: 'Ya, ada',
      skor: 5,
    },
    {
      label: 'Tidak ada',
      skor: 1,
    },
  ],
  '4a': [
    {
      label: 'Tanah',
      skor: 5,
    },
    {
      label: 'Bambu / papan kayu murah',
      skor: 4,
    },
    {
      label: 'Semen / plester',
      skor: 3,
    },
    {
      label: 'Ubin / tegel',
      skor: 2,
    },
    {
      label: 'Keramik / granit',
      skor: 1,
    },
  ],
  '4b': [
    {
      label: 'Bambu / anyaman / kayu murah',
      skor: 5,
    },
    {
      label: 'Papan kayu',
      skor: 4,
    },
    {
      label: 'Tembok tanpa plester',
      skor: 3,
    },
    {
      label: 'Tembok diplester, belum dicat',
      skor: 2,
    },
    {
      label: 'Tembok diplester dan dicat',
      skor: 1,
    },
  ],
  '4c': [
    {
      label: 'Rusak berat, bocor di banyak titik',
      skor: 5,
    },
    {
      label: 'Rusak sedang',
      skor: 4,
    },
    {
      label: 'Rusak ringan',
      skor: 3,
    },
    {
      label: 'Baik, perlu perawatan',
      skor: 2,
    },
    {
      label: 'Baik',
      skor: 1,
    },
  ],
  '5a': [
    {
      label: 'Tidak ada (sungai/kebun)',
      skor: 5,
    },
    {
      label: 'Menumpang tetangga',
      skor: 4,
    },
    {
      label: 'Jamban umum / bersama',
      skor: 3,
    },
    {
      label: 'Jamban sendiri tanpa septic tank',
      skor: 2,
    },
    {
      label: 'Jamban sendiri dengan septic tank',
      skor: 1,
    },
  ],
  '5b': [
    {
      label: 'Sungai / mata air tidak terlindungi',
      skor: 5,
    },
    {
      label: 'Air hujan',
      skor: 4,
    },
    {
      label: 'Sumur tidak terlindungi',
      skor: 3,
    },
    {
      label: 'Sumur terlindungi / sumur bor',
      skor: 2,
    },
    {
      label: 'PDAM / air kemasan',
      skor: 1,
    },
  ],
};
