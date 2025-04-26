import axios from 'axios'
import type { LocationQuery } from 'vue-router'

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
  category: string
  tag_names: string[]
  description: string
  author: string
  upload_date: string
  delete_time: string
  downloads: number
  file: string
}

export const getFilesData = async (filtersQuery?: LocationQuery): Promise<FileData[]> => {
  const baseUrl = 'api/files/'

  try {
    const res = await API.get<FileData[]>(baseUrl, { params: filtersQuery || {} })
    console.log('Fetched: ', res.data, '\nFrom: ', baseUrl, filtersQuery)
    return res.data
  } catch (err) {
    console.error(`Error fetching files [${baseUrl} ${filtersQuery}]:`, err)
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

    categories.forEach(cat => {
      map[cat.id] = cat.name
    })

    return map
  } catch (err) {
    console.error('Error creating category map:', err)
    return {}
  }
}
