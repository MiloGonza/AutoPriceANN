import { create } from 'zustand'

const currentYear = new Date().getFullYear();
const FIRST_CAR_YEAR = 1886;

export const useGeneralStore = create((set) => ({
  // Home *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
  year: '',
  yearError: '',
  brand: '',
  model: '',
  accident: '',
  selectedCSV: null,

  setYear: (year) => {
    const numericYear = Number(year);
    let error = '';

    if (year !== '') {
      if (numericYear < FIRST_CAR_YEAR) {
        error = `El año no puede ser anterior a ${FIRST_CAR_YEAR} (invención del primer automóvil)`;
      } else if (numericYear > currentYear) {
        error = `El año no puede ser mayor a ${currentYear}`;
      }
    }

    set({ year, yearError: error });
  },

  setBrand: (brand) => set({ brand, model: '' }),
  setModel: (model) => set({ model }),
  setAccident: (accident) => set({ accident }),
  setSelectedCSV: (selectedCSV) => set({ selectedCSV, brand: '', model: '', accident: '' }),
  // Home *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
}))
