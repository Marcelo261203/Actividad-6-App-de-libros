import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import { Book } from '../types/book';
import bookService from '../services/bookService';
import favoritesService from '../services/favoritesService';

interface SearchScreenProps {
  navigation: any;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favorites = await favoritesService.getFavorites();
      setBooks(prevBooks => 
        prevBooks.map(book => ({
          ...book,
          isFavorite: favorites.some(fav => fav.id === book.id)
        }))
      );
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setSearchQuery(query);

    try {
      const searchResults = await bookService.searchBooks({ query });
      
      const favorites = await favoritesService.getFavorites();
      const booksWithFavorites = searchResults.map(book => ({
        ...book,
        isFavorite: favorites.some(fav => fav.id === book.id)
      }));

      setBooks(booksWithFavorites);
    } catch (error) {
      Alert.alert('Error', 'No se pudo realizar la búsqueda. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookPress = (book: Book) => {
    navigation.navigate('BookDetail', { book });
  };

  const handleFavoritePress = async (book: Book) => {
    try {
      if (book.isFavorite) {
        await favoritesService.removeFromFavorites(book.id);
        setBooks(prevBooks =>
          prevBooks.map(b => 
            b.id === book.id ? { ...b, isFavorite: false } : b
          )
        );
      } else {
        await favoritesService.addToFavorites(book);
        setBooks(prevBooks =>
          prevBooks.map(b => 
            b.id === book.id ? { ...b, isFavorite: true } : b
          )
        );
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar favoritos');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (searchQuery) {
      await handleSearch(searchQuery);
    }
    await loadFavorites();
    setRefreshing(false);
  };

  const renderBook = ({ item }: { item: Book }) => (
    <BookCard
      book={item}
      onPress={handleBookPress}
      onFavoritePress={handleFavoritePress}
      showFavoriteButton={true}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        {searchQuery 
          ? 'No se encontraron libros para tu búsqueda'
          : 'Busca libros para comenzar'
        }
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Buscador de Libros</Text>
      </View>
      
      <View style={styles.content}>
        <SearchBar onSearch={handleSearch} loading={loading} />
        
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loadingText}>Buscando libros...</Text>
          </View>
        ) : (
          <FlatList
            data={books}
            renderItem={renderBook}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={renderEmptyState}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#3498db',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default SearchScreen;



