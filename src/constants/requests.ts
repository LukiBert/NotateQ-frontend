import qs from 'qs'
import API from '@/constants/api'
import type { FileData, FileList, Category, Tag, Comment, Book } from '@/constants'

export async function getFilesList(
  page?: number,
  filters?: Record<string, string | number | boolean>,
  isHomePage?: boolean,
  pageSize?: number,
): Promise<FileList> {
  let url: string
  let params: Record<string, any> = {}

  if (isHomePage) {
    url = '/api/files_list/recent/'
  } else {
    url = '/api/files_list/'
    params = { page, page_size: pageSize, ...filters }
  }

  try {
    const res = await API.get<FileList>(url, {
      params: params,
      paramsSerializer: (p) => qs.stringify(p, { arrayFormat: 'repeat' }),
    })
    return res.data
  } catch (err) {
    console.error(`Error fetching files from ${url}:`, err)
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    }
  }
}

export async function getFileDataById(id: number): Promise<FileData> {
  try {
    const res = await API.get<FileData>(`api/files/${id}`)
    return res.data
  } catch (err) {
    console.error('Error fetching files [api/files/id]:', err)
    throw err
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const res = await API.get<Category[]>('api/categories/')
    return res.data
  } catch (err) {
    console.error('Error fetching categories [api/categories/]:', err)
    throw err
  }
}

export async function getTags(): Promise<Tag[]> {
  try {
    const res = await API.get<Tag[]>('api/tags/')
    return res.data
  } catch (err) {
    console.error('Error fetching tags [api/tags/]:', err)
    throw err
  }
}

export async function incrementDownload(fileId: number): Promise<number> {
  try {
    const res = await API.post(`api/files/${fileId}/increment_downloads/`)
    return res.data.downloads ?? 0
  } catch (err) {
    console.error(`Błąd inkrementacji pobrań pliku ${fileId}:`, err)
    return 0
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

  const res = await API.get(`api/files/${fileId}/user-rating/`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  return res.data.rating   // <-- TUTAJ POPRAWKA
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

// API endpoint replaces all '-' with '+'
export async function searchBibliography(titleToSearch: string): Promise<Book[]> {
  let processedTitle = titleToSearch.toLowerCase();

  processedTitle = processedTitle.replace(/[ąćęłńóśźż]/g, (char) => {
    switch (char) {
      case 'ą': return 'a';
      case 'ć': return 'c';
      case 'ę': return 'e';
      case 'ł': return 'l';
      case 'ń': return 'n';
      case 'ó': return 'o';
      case 'ś': return 's';
      case 'ź': return 'z';
      case 'ż': return 'z';
      default: return char;
    }
  });

  processedTitle = processedTitle.trim().replace(/\s+/g, '-');
  processedTitle = processedTitle.replace(/[^a-z0-9-]/g, '');

  try {
    const res = await API.get(`api/books/search/${processedTitle}`)
    return res.data
  } catch (err) {
    console.error('Błąd podczas wyszukiwania książek:', err)
    return []
  }
}
