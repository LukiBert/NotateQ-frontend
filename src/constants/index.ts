export const API_URL = 'http://localhost:8000/'

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
