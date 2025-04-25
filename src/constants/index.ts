import axios from 'axios'
import type { LocationQuery } from 'vue-router'

export const API_URL = 'http://localhost:8000/'

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

export const getFilteredFilesData = async (filtersQuery: LocationQuery): Promise<FileData[]> => {
  const baseUrl = 'api/files/'
  const queryString = new URLSearchParams(filtersQuery as Record<string, string>).toString()

  const fullUrl: string = `${baseUrl}?${queryString}`
  console.log(`Preparing to fetch: ${fullUrl}`)

  try {
    const res = await API.get<FileData[]>(fullUrl)
    console.log('Fetched: ', res.data)
    return res.data
  } catch (err) {
    console.error(`Error fetching files [api/files/${fullUrl}]:`, err)
    throw err
  }
}

export const getAllFilesData = async (): Promise<FileData[]> => {
  try {
    const res = await API.get<FileData[]>('api/files/')
    return res.data
  } catch (err) {
    console.error('Error fetching files [api/files/]:', err)
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
