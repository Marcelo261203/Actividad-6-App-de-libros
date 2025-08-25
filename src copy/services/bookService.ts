import axios from 'axios';
import { Book, GoogleBooksResponse, BookItem, SearchParams } from '../types/book';

const GOOGLE_BOOKS_API_BASE_URL = 'https://www.googleapis.com/books/v1';

export class BookService {
  private static instance: BookService;

  private constructor() {}

  public static getInstance(): BookService {
    if (!BookService.instance) {
      BookService.instance = new BookService();
    }
    return BookService.instance;
  }

  async searchBooks(params: SearchParams): Promise<Book[]> {
    try {
      const { query, maxResults = 20, startIndex = 0 } = params;
      
      const response = await axios.get<GoogleBooksResponse>(
        `${GOOGLE_BOOKS_API_BASE_URL}/volumes`,
        {
          params: {
            q: query,
            maxResults,
            startIndex,
            key: process.env.EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY || '',
          },
        }
      );

      return response.data.items?.map(this.mapBookItemToBook) || [];
    } catch (error) {
      console.error('Error searching books:', error);
      throw new Error('Error al buscar libros. Por favor, intenta de nuevo.');
    }
  }

  async getBookById(id: string): Promise<Book | null> {
    try {
      const response = await axios.get<BookItem>(
        `${GOOGLE_BOOKS_API_BASE_URL}/volumes/${id}`,
        {
          params: {
            key: process.env.EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY || '',
          },
        }
      );

      return this.mapBookItemToBook(response.data);
    } catch (error) {
      console.error('Error fetching book details:', error);
      throw new Error('Error al obtener detalles del libro.');
    }
  }

  private mapBookItemToBook(bookItem: BookItem): Book {
    const { id, volumeInfo } = bookItem;
    
    return {
      id,
      title: volumeInfo.title || 'Sin título',
      authors: volumeInfo.authors || [],
      description: volumeInfo.description || 'Sin descripción disponible',
      publishedDate: volumeInfo.publishedDate,
      pageCount: volumeInfo.pageCount,
      categories: volumeInfo.categories || [],
      imageLinks: volumeInfo.imageLinks,
      previewLink: volumeInfo.previewLink,
      infoLink: volumeInfo.infoLink,
      averageRating: volumeInfo.averageRating,
      ratingsCount: volumeInfo.ratingsCount,
      language: volumeInfo.language,
      isFavorite: false,
    };
  }
}

export default BookService.getInstance();
