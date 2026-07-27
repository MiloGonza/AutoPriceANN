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

export async function GetDatasets(page = 1, pageSize = 10) {
	try {
		const response = await api.get('datasets/', {
			params: { page, pageSize }
		})
		return response.data
	} catch (error) {
		console.error('Error fetching datasets:', error)
		throw error
	}
}

export async function GetRecentDatasets() {
	try {
		const response = await api.get('datasets/recentCSVs')
		return response.data
	} catch (error) {
		console.error('Error fetching recent datasets:', error)
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

export async function GetColumnOptions(filePath) {
	try {
		const response = await api.get('datasets/column-options', {
			params: { filePath }
		})
		return response.data
	} catch (error) {
		console.error('Error fetching column options:', error)
		throw error
	}
}

export async function AddRecentSelection(filePath) {
	try {
		const response = await api.post('datasets/recentSelections', { filePath })
		return response.data
	} catch (error) {
		console.error('Error adding recent selection:', error)
		throw error
	}
}

export async function TakeDataSelectedCsv(filePath) {
	try {
		const response = await api.post('datasets/process', { filePath })
		console.log(response)
		return response.data
	} catch (error) {
		console.error('Error error procesing the csv:', error)
		throw error
	}
}

// --- TRAIN ---

export async function TrainModel({ filePath, epochs, lr, testSize, randomState }, onEpoch, onDone) {
	const response = await fetch('http://localhost:8000/datasets/train', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ filePath, epochs, lr, testSize, randomState }),
	})

	if (!response.ok) {
		const err = await response.json().catch(() => ({ detail: 'Error desconocido' }))
		throw new Error(err.detail || 'Error al entrenar')
	}

	const reader = response.body.getReader()
	const decoder = new TextDecoder()
	let buffer = ''

	while (true) {
		const { done, value } = await reader.read()
		if (done) break

		buffer += decoder.decode(value, { stream: true })
		const lines = buffer.split('\n')
		buffer = lines.pop()

		for (const line of lines) {
			if (!line.trim()) continue
			const chunk = JSON.parse(line)
			if (chunk.type === 'epoch') {
				onEpoch(chunk)
			} else if (chunk.type === 'done') {
				onDone(chunk)
			}
		}
	}
}