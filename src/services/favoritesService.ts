import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from '../types/book';

const FAVORITES_STORAGE_KEY = '@book_search_favorites';

export class FavoritesService {
  private static instance: FavoritesService;

  private constructor() {}

  public static getInstance(): FavoritesService {
    if (!FavoritesService.instance) {
      FavoritesService.instance = new FavoritesService();
    }
    return FavoritesService.instance;
  }

  async getFavorites(): Promise<Book[]> {
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (favoritesJson) {
        const favorites = JSON.parse(favoritesJson);
        return favorites.map((book: Book) => ({ ...book, isFavorite: true }));
      }
      return [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  async addToFavorites(book: Book): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const existingIndex = favorites.findIndex(fav => fav.id === book.id);
      
      if (existingIndex === -1) {
        const bookWithFavorite = { ...book, isFavorite: true };
        favorites.push(bookWithFavorite);
        await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw new Error('Error al agregar a favoritos');
    }
  }

  async removeFromFavorites(bookId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const filteredFavorites = favorites.filter(book => book.id !== bookId);
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(filteredFavorites));
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw new Error('Error al remover de favoritos');
    }
  }

  async isFavorite(bookId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some(book => book.id === bookId);
    } catch (error) {
      console.error('Error checking if favorite:', error);
      return false;
    }
  }

  async clearFavorites(): Promise<void> {
    try {
      await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing favorites:', error);
      throw new Error('Error al limpiar favoritos');
    }
  }
}

export default FavoritesService.getInstance();



