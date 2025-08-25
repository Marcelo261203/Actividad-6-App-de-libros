import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Book } from '../types/book';
import favoritesService from '../services/favoritesService';

interface BookDetailScreenProps {
  navigation: any;
  route: {
    params: {
      book: Book;
    };
  };
}

const BookDetailScreen: React.FC<BookDetailScreenProps> = ({ navigation, route }) => {
  const { book: initialBook } = route.params;
  const [book, setBook] = useState<Book>(initialBook);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, []);

  const checkFavoriteStatus = async () => {
    try {
      const isFavorite = await favoritesService.isFavorite(book.id);
      setBook(prevBook => ({ ...prevBook, isFavorite }));
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    setLoading(true);
    try {
      if (book.isFavorite) {
        await favoritesService.removeFromFavorites(book.id);
        setBook(prevBook => ({ ...prevBook, isFavorite: false }));
        Alert.alert('Éxito', 'Libro removido de favoritos');
      } else {
        await favoritesService.addToFavorites(book);
        setBook(prevBook => ({ ...prevBook, isFavorite: true }));
        Alert.alert('Éxito', 'Libro agregado a favoritos');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar favoritos');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewLink = () => {
    if (book.previewLink) {
      Linking.openURL(book.previewLink);
    } else {
      Alert.alert('Información', 'Vista previa no disponible para este libro');
    }
  };

  const handleInfoLink = () => {
    if (book.infoLink) {
      Linking.openURL(book.infoLink);
    } else {
      Alert.alert('Información', 'Información adicional no disponible');
    }
  };

  const getImageUrl = () => {
    if (book.imageLinks?.thumbnail) {
      return book.imageLinks.thumbnail.replace('http://', 'https://');
    }
    return 'https://via.placeholder.com/300x450/cccccc/666666?text=Sin+Imagen';
  };

  const formatAuthors = (authors?: string[]) => {
    if (!authors || authors.length === 0) return 'Autor desconocido';
    return authors.join(', ');
  };

  const formatCategories = (categories?: string[]) => {
    if (!categories || categories.length === 0) return 'Sin categorías';
    return categories.join(', ');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Fecha desconocida';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalles del Libro</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: getImageUrl() }} style={styles.image} />
            <TouchableOpacity
              style={[styles.favoriteButton, book.isFavorite && styles.favoriteButtonActive]}
              onPress={handleFavoriteToggle}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons
                  name={book.isFavorite ? 'heart' : 'heart-outline'}
                  size={24}
                  color={book.isFavorite ? '#fff' : '#e74c3c'}
                />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>{formatAuthors(book.authors)}</Text>

            {book.publishedDate && (
              <View style={styles.infoRow}>
                <Ionicons name="calendar" size={16} color="#666" />
                <Text style={styles.infoText}>{formatDate(book.publishedDate)}</Text>
              </View>
            )}

            {book.pageCount && (
              <View style={styles.infoRow}>
                <Ionicons name="document-text" size={16} color="#666" />
                <Text style={styles.infoText}>{book.pageCount} páginas</Text>
              </View>
            )}

            {book.language && (
              <View style={styles.infoRow}>
                <Ionicons name="language" size={16} color="#666" />
                <Text style={styles.infoText}>Idioma: {book.language.toUpperCase()}</Text>
              </View>
            )}

            {book.categories && book.categories.length > 0 && (
              <View style={styles.infoRow}>
                <Ionicons name="bookmark" size={16} color="#666" />
                <Text style={styles.infoText}>{formatCategories(book.categories)}</Text>
              </View>
            )}

            {book.averageRating && (
              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= book.averageRating! ? 'star' : 'star-outline'}
                      size={16}
                      color="#f39c12"
                    />
                  ))}
                </View>
                <Text style={styles.ratingText}>
                  {book.averageRating.toFixed(1)} ({book.ratingsCount || 0} reseñas)
                </Text>
              </View>
            )}

            {book.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>Descripción</Text>
                <Text style={styles.description}>{book.description}</Text>
              </View>
            )}

            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={handlePreviewLink}>
                <Ionicons name="eye" size={20} color="#3498db" />
                <Text style={styles.actionButtonText}>Vista Previa</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleInfoLink}>
                <Ionicons name="information-circle" size={20} color="#3498db" />
                <Text style={styles.actionButtonText}>Más Info</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  placeholder: {
    width: 32,
  },
  content: {
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  image: {
    width: 200,
    height: 300,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: '#e74c3c',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#3498db',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default BookDetailScreen;
