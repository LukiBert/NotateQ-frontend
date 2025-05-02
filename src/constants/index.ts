import axios from 'axios'

export const API_URL = 'http://127.0.0.1:8000/'

export const API = axios.create({
  baseURL: API_URL,
})

export interface Category {
  id: number
  name: string
}

export interface FileData {
  id: number
  title: string
  categories: number[]
  tag_names: string[]
  description: string
  author: string
  upload_date: string
  delete_time: string
  downloads: number
  file: string
  rating: number
  rating_count: number
}

export const getFilesData = async (
  filters?: Record<string, string | number | boolean>,
): Promise<FileData[]> => {
  const baseUrl = 'api/files/'

  try {
    const res = await API.get<FileData[]>(baseUrl, { params: filters || {} })
    console.log('Fetched: ', res.data, '\nFrom: ', baseUrl, filters)
    return res.data
  } catch (err) {
    console.error(`Error fetching files [${baseUrl} ${filters}]:`, err)
    throw err
  }
}

export const getFileDataById = async (id: number): Promise<FileData> => {
  try {
    const res = await API.get<FileData>(`api/files/${id}`)
    return res.data
  } catch (err) {
    console.error('Error fetching files [api/files/id]:', err)
    throw err
  }
}

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const res = await API.get<Category[]>('api/categories/')
    return res.data
  } catch (err) {
    console.error('Error fetching categories [api/categories/]:', err)
    throw err
  }
}

export const getCategoryMap = async (): Promise<Record<number, string>> => {
  try {
    const categories = await getAllCategories()
    const map: Record<number, string> = {}

    categories.forEach((cat) => {
      map[cat.id] = cat.name
    })

    return map
  } catch (err) {
    console.error('Error creating category map:', err)
    return {}
  }
}

export const incrementDownload = async (fileId: number): Promise<void> => {
  try {
    await API.post(`api/files/${fileId}/increment_downloads/`)
  } catch (err) {
    console.error(`Błąd inkrementacji pobrań pliku ${fileId}:`, err)
  }
}

export async function rateFile(fileId: number, rating: number): Promise<{ rating: number, rating_count: number }> {
  const response = await API.post(`api/files/${fileId}/rate/`, { rating })
  return response.data
}

