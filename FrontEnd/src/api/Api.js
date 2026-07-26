import axios from 'axios'

export const api = axios.create({
	baseURL: 'http://localhost:8000',
	headers: {
		'Content-Type': 'application/json'
	}
})

// --- DATASETS ---

export async function ImportCSVs(dataset) {
	try {
		const response = await api.post('datasets/', dataset)
		return response.data
	} catch (error) {
		console.error('Error importing CSVs:', error)
		throw error
	}
}

export async function GetDatasets() {
	try {
		const response = await api.get('datasets/')
		return response.data
	} catch (error) {
		console.error('Error fetching datasets:', error)
		throw error
	}
}

export async function InspectDataset(datasetId) {
	try {
		const response = await api.get(`datasets/${datasetId}/inspect/`)
		return response.data
	} catch (error) {
		console.error(`Error inspecting dataset ${datasetId}:`, error)
		throw error
	}
}