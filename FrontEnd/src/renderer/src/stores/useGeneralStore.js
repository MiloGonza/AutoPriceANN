import { create } from 'zustand'
import { GetRecentDatasets, AddRecentSelection, TakeDataSelectedCsv, TrainModel } from '../../../api/Api'

const currentYear = new Date().getFullYear();
const FIRST_CAR_YEAR = 1886;
const MAX_RECENT = 5;

export const useGeneralStore = create((set, get) => ({
  // Home *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
  year: '',
  yearError: '',
  brand: '',
  model: '',
  accident: '',
  selectedCSV: null,
  recentCSVs: [],

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

  fetchRecentCSVs: async () => {
    try {
      const data = await GetRecentDatasets()
      set({ recentCSVs: data.recentDatasets })
    } catch { }
  },

  addRecentCSV: (csv) => {
    const { recentCSVs } = get()
    const filtered = recentCSVs.filter((r) => r.filePath !== csv.filePath)
    set({ recentCSVs: [csv, ...filtered].slice(0, MAX_RECENT) })
  },

  selectCSVFromDatasets: async (csv) => {
    const { setSelectedCSV, addRecentCSV } = get()
    setSelectedCSV(csv)
    addRecentCSV(csv)
    try {
      await AddRecentSelection(csv.filePath)
      await TakeDataSelectedCsv(csv.filePath)
    } catch { }
  },
  // Home *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

  // Train *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

  trained: false,
  training: false,
  trainingHistory: [],
  trainingStats: null,
  trainingError: null,
  totalEpochs: 0,
  currentEpoch: 0,
  trainingSession: 0,

  setTrained: (trained) => set({ trained }),

  runTraining: async ({ epochs, lr, testSize, randomState }) => {
    const { selectedCSV } = get()
    if (!selectedCSV) return

    set({
      training: true,
      trainingError: null,
      trainingHistory: [],
      trainingStats: null,
      trained: false,
      totalEpochs: epochs,
      currentEpoch: 0,
      trainingSession: get().trainingSession + 1,
    })

    try {
      await TrainModel(
        { filePath: selectedCSV.filePath, epochs, lr, testSize, randomState },
        (epochData) => {
          set((state) => ({
            trainingHistory: [...state.trainingHistory, {
              epoch: epochData.epoch,
              trainLoss: epochData.trainLoss,
              testLoss: epochData.testLoss,
              trainAccuracy: epochData.trainAccuracy,
              testAccuracy: epochData.testAccuracy,
            }],
            currentEpoch: epochData.epoch,
          }))
        },
        (doneData) => {
          set({
            trained: true,
            training: false,
            trainingStats: doneData.stats,
          })
        }
      )
    } catch (error) {
      set({ training: false, trainingError: error.message })
      throw error
    }
  }

  // Train *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
}))
