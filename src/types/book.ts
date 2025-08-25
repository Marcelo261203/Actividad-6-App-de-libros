export interface Book {
  id: string;
  title: string;
  authors?: string[];
  description?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  previewLink?: string;
  infoLink?: string;
  averageRating?: number;
  ratingsCount?: number;
  language?: string;
  isFavorite?: boolean;
}

export interface GoogleBooksResponse {
  items: BookItem[];
  totalItems: number;
  kind: string;
}

export interface BookItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    previewLink?: string;
    infoLink?: string;
    averageRating?: number;
    ratingsCount?: number;
    language?: string;
  };
  searchInfo?: {
    textSnippet?: string;
  };
}

export interface SearchParams {
  query: string;
  maxResults?: number;
  startIndex?: number;
}

