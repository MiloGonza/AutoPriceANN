import { create } from 'zustand'
import { GetDatasets } from '../../../api/Api'

export const useCSVStore = create((set, get) => ({
	datasets: [],
	total: 0,
	page: 1,
	pageSize: 9,
	totalPages: 0,
	loading: false,
	error: null,

	setPage: (page) => set({ page }),

	fetchDatasets: async (page) => {
		const { pageSize } = get()
		set({ loading: true, error: null })

		try {
			const data = await GetDatasets(page, pageSize)
			set({
				datasets: data.datasets,
				total: data.total,
				page: data.page,
				totalPages: data.totalPages,
				loading: false,
			})
		} catch (err) {
			set({ error: err.message || 'Error al cargar datasets', loading: false })
		}
	},
}))
