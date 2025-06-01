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
  categories: Category[]
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

export interface Comment {
  id: number
  author_username: string
  created_at: string
  content: string
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

export interface Book {
  title: string
  subtitle: string
  authors: string[]
  publishedDate: string
}

export function formatDate(date: number): string {
  if (date === null || date === 0) return ''

  const d = new Date(date)
  const year = d.getFullYear()
  const month = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function joinCategoryNames(categories: Category[]) {
  return categories.map((category) => category.name).join(', ')
}

export function addCategoryLabels(categories: Category[]) {
  return categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }))
}
