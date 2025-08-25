import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book } from '../types/book';

interface BookCardProps {
  book: Book;
  onPress: (book: Book) => void;
  onFavoritePress?: (book: Book) => void;
  showFavoriteButton?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onPress,
  onFavoritePress,
  showFavoriteButton = false,
}) => {
  const handleFavoritePress = () => {
    if (onFavoritePress) {
      onFavoritePress(book);
    }
  };

  const getImageUrl = () => {
    if (book.imageLinks?.thumbnail) {
      return book.imageLinks.thumbnail.replace('http://', 'https://');
    }
    return 'https://via.placeholder.com/128x192/cccccc/666666?text=Sin+Imagen';
  };

  const formatAuthors = (authors?: string[]) => {
    if (!authors || authors.length === 0) return 'Autor desconocido';
    return authors.join(', ');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(book)}>
      <View style={styles.card}>
        <Image source={{ uri: getImageUrl() }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {book.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {formatAuthors(book.authors)}
          </Text>
          {book.publishedDate && (
            <Text style={styles.publishedDate}>
              {new Date(book.publishedDate).getFullYear()}
            </Text>
          )}
          {showFavoriteButton && onFavoritePress && (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={handleFavoritePress}
            >
              <Ionicons
                name={book.isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={book.isFavorite ? '#e74c3c' : '#666'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
  },
  image: {
    width: 60,
    height: 90,
    borderRadius: 6,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  publishedDate: {
    fontSize: 12,
    color: '#999',
  },
  favoriteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 4,
  },
});

export default BookCard;



