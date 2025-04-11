export const API_URL = 'http://20.26.121.115:8000/'

export interface FileData {
  id: number
  title: string
  category: string
  tags: string[]
  description: string
  author: string
  uploadDate: string
  deleteDate: string
  downloads: number
  file: string
}
