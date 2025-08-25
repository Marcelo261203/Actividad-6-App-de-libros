import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BookCard from '../components/BookCard';
import { Book } from '../types/book';
import favoritesService from '../services/favoritesService';

interface FavoritesScreenProps {
  navigation: any;
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation }) => {
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favoritesList = await favoritesService.getFavorites();
      setFavorites(favoritesList);
    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert('Error', 'No se pudieron cargar los favoritos');
    }
  };

  const handleBookPress = (book: Book) => {
    navigation.navigate('BookDetail', { book });
  };

  const handleRemoveFavorite = async (book: Book) => {
    try {
      await favoritesService.removeFromFavorites(book.id);
      setFavorites(prevFavorites =>
        prevFavorites.filter(fav => fav.id !== book.id)
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo remover de favoritos');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const renderBook = ({ item }: { item: Book }) => (
    <BookCard
      book={item}
      onPress={handleBookPress}
      onFavoritePress={handleRemoveFavorite}
      showFavoriteButton={true}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="heart-outline" size={80} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No tienes favoritos</Text>
      <Text style={styles.emptyStateText}>
        Los libros que agregues a favoritos aparecerán aquí
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Mis Favoritos</Text>
          <Text style={styles.subtitle}>{favorites.length} libros guardados</Text>
        </View>
        
        <FlatList
          data={favorites}
          renderItem={renderBook}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyState}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default FavoritesScreen;



