import axios from 'axios'
import qs from 'qs'

export const API_URL = 'http://127.0.0.1:8000/'

export const API = axios.create({
  baseURL: API_URL,
})

export interface Tag {
  name: string
}

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
  bibliography_titles: string[]
  date: string
}

export interface Filters {
  title?: string
  author?: string
  downloads_min?: number
  downloads_max?: number
  upload_date_before?: string
  upload_date_after?: string
  // to_delete?: boolean
  category?: number[]
  // date?: string
  rating_min?: number
  rating_max?: number
  // books?: string[]
  tags?: string[]
}

export type SortOption =
  | 'downloads_asc'
  | 'downloads_desc'
  | 'rating_asc'
  | 'rating_desc'
  | 'date_asc'
  | 'date_desc'

export function formatDate(date: number): string {
  if (date === null || date === 0) return ''

  const d = new Date(date)
  const year = d.getFullYear()
  const month = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const getFilesData = async (
  filters?: Record<string, string | number | boolean>,
): Promise<FileData[]> => {
  const baseUrl = 'api/files/'

  try {
    const res = await API.get('/api/files/', {
      params: filters,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    })
    console.log('Fetched: ', res.data, '\nFrom: ', baseUrl, { params: filters || {} })
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

export const getTags = async (): Promise<Tag[]> => {
  try {
    const res = await API.get<Tag[]>('api/tags/')
    return res.data
  } catch (err) {
    console.error('Error fetching tags [api/tags/]:', err)
    throw err
  }
}

export const incrementDownload = async (fileId: number): Promise<void> => {
  try {
    await API.post(`api/files/${fileId}/increment_downloads/`)
  } catch (err) {
    console.error(`Błąd inkrementacji pobrań pliku ${fileId}:`, err)
  }
}

export async function rateFile(
  fileId: number,
  rating: number,
): Promise<{ rating: number; rating_count: number }> {
  const token = localStorage.getItem('access')

  try {
    const response = await API.post(
      `api/files_rating/`,
      { file: fileId, rating },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    return response.data
  } catch (err) {
    console.error(`Błąd oceniania pliku ${fileId}:`, err)
    throw err
  }
}

export async function getUserRating(fileId: number): Promise<number | null> {
  const token = localStorage.getItem('access')
  if (!token) return null

  const res = await fetch(`http://127.0.0.1:8000/api/files/${fileId}/user-rating/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (!res.ok) return null

  const data = await res.json()
  return data.rating
}

export async function fetchComments(fileId: number) {
  const response = await axios.get(`${API_URL}/api/comments/?file=${fileId}`)
  return response.data
}

export async function postComment(fileId: number, content: string) {
  const token = localStorage.getItem('access')
  if (!token) throw new Error('Brak tokenu autoryzacji')

  const response = await axios.post(`${API_URL}/api/comments/`, {
    file: fileId,
    content,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })

  return response.data
}

