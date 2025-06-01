import qs from 'qs'
import API from '@/constants/api'
import type { FileData, Category, Tag, Comment } from '@/constants'

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
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) return null

  const data = await res.json()
  return data.rating
}

export async function fetchComments(fileId: number): Promise<Comment[]> {
  try {
    const response = await API.get(`api/comments/?file=${fileId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching comments [api/comments/?file=${fileId}]:`, error)
    return []
  }
}

export async function postComment(fileId: number, content: string) {
  const token = localStorage.getItem('access')
  if (!token) throw new Error('Brak tokenu autoryzacji')

  const response = await API.post(
    `api/comments/`,
    {
      file: fileId,
      content,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response.data
}
