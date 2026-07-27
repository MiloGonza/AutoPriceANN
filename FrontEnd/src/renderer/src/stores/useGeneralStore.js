import { create } from 'zustand'
import { GetRecentDatasets, AddRecentSelection, TakeDataSelectedCsv, TrainModel, PredictPrice } from '../../../api/Api'

const currentYear = new Date().getFullYear();
const FIRST_CAR_YEAR = 1886;
const MAX_RECENT = 5;

export const useGeneralStore = create((set, get) => ({
  // Home *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
  year: '',
  yearError: '',
  km: '',
  brand: '',
  model: '',
  accident: '',
  selectedCSV: null,
  csvFeatureRanges: null,
  recentCSVs: [],
  prediction: null,
  predicting: false,

  setYear: (year) => {
    const numericYear = Number(year);
    let error = '';
    const { csvFeatureRanges } = get();

    if (year !== '') {
      if (numericYear < FIRST_CAR_YEAR) {
        error = `El año no puede ser anterior a ${FIRST_CAR_YEAR} (invención del primer automóvil)`;
      } else if (numericYear > currentYear) {
        error = `El año no puede ser mayor a ${currentYear}`;
      } else if (csvFeatureRanges?.Año) {
        const { min, max } = csvFeatureRanges.Año;
        if (numericYear < min || numericYear > max) {
          error = `El año debe estar entre ${min} y ${max} (rango del CSV)`;
        }
      }
    }

    set({ year, yearError: error });
  },

  setBrand: (brand) => set({ brand, model: '' }),
  setModel: (model) => set({ model }),
  setKm: (km) => set({ km }),
  setAccident: (accident) => set({ accident }),

  setSelectedCSV: (selectedCSV) => set({ selectedCSV, csvFeatureRanges: null, brand: '', model: '', accident: '', prediction: null }),

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
      const data = await TakeDataSelectedCsv(csv.filePath)
      if (data?.stats?.featureRanges) {
        set({ csvFeatureRanges: data.stats.featureRanges })
      }
    } catch { }
  },

  runPrediction: async () => {
    const { year, km, brand, model, accident } = get()
    set({ predicting: true, prediction: null })
    try {
      const accidentValue = accident === "Si" ? 1 : 0
      const result = await PredictPrice({
        year: Number(year),
        km: Number(km),
        accidents: accidentValue,
        brand,
        modelName: model,
      })
      set({ predicting: false, prediction: result.prediction })
    } catch (error) {
      set({ predicting: false })
      throw error
    }
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
  scatterData: [],

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
      scatterData: [],
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
              trainRMSE: epochData.trainRMSE,
              testRMSE: epochData.testRMSE,
              r2: epochData.r2,
              exactitud: epochData.exactitud,
            }],
            currentEpoch: epochData.epoch,
          }))
        },
        (doneData) => {
          set({
            trained: true,
            training: false,
            trainingStats: doneData.stats,
            scatterData: doneData.scatterData || [],
            csvFeatureRanges: doneData.stats?.featureRanges || get().csvFeatureRanges,
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
