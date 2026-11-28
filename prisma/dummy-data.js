// Simulation surveys (the "9 data simulasi" of the Laporan Akhir, Bab III 3.5.3), loaded with
// `npm run db:seed:dummy`. The answer options and their scores are official and live in
// prisma/kuesioner.js (seeded by `npm run db:seed`).

export const KUOTA_DUMMY = 4;

// One verified survey per seed KK (matched by kepala keluarga): the score chosen per question
export const JAWABAN_DUMMY = {
  'Ahmad Suryadi': { 1: 2, '2a': 4, '2b': 1, '3a': 4, '3b': 1, '4a': 3, '4b': 2, '4c': 3, '5a': 2, '5b': 2 },
  'Siti Rahmawati': { 1: 1, '2a': 5, '2b': 1, '3a': 2, '3b': 1, '4a': 5, '4b': 5, '4c': 5, '5a': 4, '5b': 3 },
  'Bambang Hartono': { 1: 4, '2a': 1, '2b': 1, '3a': 5, '3b': 1, '4a': 1, '4b': 1, '4c': 1, '5a': 1, '5b': 1 },
  'Dewi Lestari': { 1: 2, '2a': 3, '2b': 5, '3a': 3, '3b': 1, '4a': 2, '4b': 3, '4c': 4, '5a': 2, '5b': 2 },
  'Joko Prasetyo': { 1: 1, '2a': 5, '2b': 1, '3a': 1, '3b': 1, '4a': 3, '4b': 4, '4c': 4, '5a': 3, '5b': 4 },
  'Nur Aini': { 1: 2, '2a': 4, '2b': 5, '3a': 5, '3b': 5, '4a': 5, '4b': 5, '4c': 5, '5a': 5, '5b': 5 },
  'Hendra Gunawan': { 1: 5, '2a': 1, '2b': 1, '3a': 3, '3b': 1, '4a': 1, '4b': 1, '4c': 1, '5a': 1, '5b': 1 },
  'Sri Wahyuni': { 1: 3, '2a': 3, '2b': 1, '3a': 4, '3b': 5, '4a': 2, '4b': 2, '4c': 2, '5a': 2, '5b': 3 },
  'Agus Salim': { 1: 3, '2a': 2, '2b': 5, '3a': 2, '3b': 1, '4a': 3, '4b': 3, '4c': 3, '5a': 3, '5b': 2 },
};
