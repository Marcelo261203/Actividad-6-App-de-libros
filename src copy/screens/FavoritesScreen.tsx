import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
  TouchableOpacity,
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
    Alert.alert(
      'Remover de Favoritos',
      `¿Estás seguro de que quieres remover "${book.title}" de tus favoritos?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await favoritesService.removeFromFavorites(book.id);
              setFavorites(prevFavorites =>
                prevFavorites.filter(fav => fav.id !== book.id)
              );
            } catch (error) {
              Alert.alert('Error', 'No se pudo remover de favoritos');
            }
          },
        },
      ]
    );
  };

  const handleClearAllFavorites = () => {
    Alert.alert(
      'Limpiar Favoritos',
      '¿Estás seguro de que quieres remover todos los libros de tus favoritos?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Limpiar Todo',
          style: 'destructive',
          onPress: async () => {
            try {
              await favoritesService.clearFavorites();
              setFavorites([]);
            } catch (error) {
              Alert.alert('Error', 'No se pudieron limpiar los favoritos');
            }
          },
        },
      ]
    );
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

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.title}>Mis Favoritos</Text>
        <Text style={styles.subtitle}>{favorites.length} libros guardados</Text>
      </View>
      {favorites.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearAllFavorites}
        >
          <Ionicons name="trash-outline" size={20} color="#e74c3c" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderHeader()}
        
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  headerContent: {
    flex: 1,
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
  clearButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
