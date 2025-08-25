# 📚 Buscador de Libros - React Native Expo

Una aplicación móvil híbrida para buscar libros utilizando la Google Books API, con funcionalidad de favoritos y almacenamiento local.

## 🚀 Características

- **Búsqueda de Libros**: Integración con Google Books API
- **Detalles Completos**: Información detallada de cada libro
- **Sistema de Favoritos**: Guardar y gestionar libros favoritos
- **Almacenamiento Local**: Persistencia de datos con AsyncStorage
- **Navegación Intuitiva**: Navegación entre pantallas con React Navigation
- **Diseño Moderno**: UI/UX atractiva y responsive
- **Soporte Multiplataforma**: Funciona en iOS, Android y Web

## 🛠️ Tecnologías Utilizadas

- **React Native** con **Expo SDK 50**
- **TypeScript** para tipado estático
- **React Navigation 6** para navegación
- **AsyncStorage** para almacenamiento local
- **Axios** para llamadas a API
- **Capacitor** para soporte web
- **Google Books API** para datos de libros

## 📱 Pantallas

1. **Pantalla de Búsqueda**: Campo de búsqueda y lista de resultados
2. **Pantalla de Detalles**: Información completa del libro seleccionado
3. **Pantalla de Favoritos**: Lista de libros guardados localmente

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI
- Expo Go app (para pruebas en dispositivo móvil)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd BookSearchApp
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar API Key (Opcional)**
   
   La aplicación funciona sin API key, pero para uso intensivo se recomienda obtener una:
   
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un nuevo proyecto o selecciona uno existente
   - Habilita la Google Books API
   - Crea credenciales de API Key
   - Crea un archivo `.env` en la raíz del proyecto:
     ```
     EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY=tu_api_key_aqui
     ```

4. **Ejecutar la aplicación**

   **Para desarrollo móvil:**
   ```bash
   npm start
   ```
   Luego escanea el código QR con Expo Go

   **Para desarrollo web:**
   ```bash
   npm run web
   ```

   **Para Android:**
   ```bash
   npm run android
   ```

   **Para iOS (solo en macOS):**
   ```bash
   npm run ios
   ```

## 📋 Funcionalidades

### Búsqueda de Libros
- Campo de búsqueda con autocompletado
- Resultados en tiempo real
- Información básica: título, autor, año, portada
- Indicador de estado de favorito

### Detalles del Libro
- Información completa del libro
- Descripción detallada
- Calificaciones y reseñas
- Enlaces a vista previa e información adicional
- Botón para agregar/quitar de favoritos

### Sistema de Favoritos
- Guardar libros en almacenamiento local
- Lista de favoritos persistente
- Opción para remover libros individuales
- Función para limpiar todos los favoritos

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── BookCard.tsx    # Tarjeta de libro
│   └── SearchBar.tsx   # Barra de búsqueda
├── navigation/         # Configuración de navegación
│   └── AppNavigator.tsx
├── screens/           # Pantallas de la aplicación
│   ├── SearchScreen.tsx
│   ├── BookDetailScreen.tsx
│   └── FavoritesScreen.tsx
├── services/          # Servicios y APIs
│   ├── bookService.ts
│   └── favoritesService.ts
├── types/            # Definiciones de tipos TypeScript
│   └── book.ts
└── utils/            # Utilidades y helpers
```

## 🔧 Configuración de Capacitor (Web)

Para ejecutar en web con Capacitor:

```bash
# Construir para web
npm run build

# Agregar plataforma web
npx cap add web

# Sincronizar
npx cap sync

# Abrir en navegador
npx cap open web
```

## 📱 Compatibilidad

- **iOS**: 12.0+
- **Android**: 5.0+ (API 21+)
- **Web**: Navegadores modernos (Chrome, Firefox, Safari, Edge)

## 🐛 Solución de Problemas

### Error de API
- Verifica tu conexión a internet
- Si usas API key, asegúrate de que esté configurada correctamente
- La API tiene límites de uso, espera unos minutos si excedes el límite

### Problemas de Navegación
- Asegúrate de tener las últimas versiones de React Navigation
- Reinicia el servidor de desarrollo si hay problemas

### Problemas de Almacenamiento
- En algunos dispositivos, AsyncStorage puede tener limitaciones
- Verifica los permisos de almacenamiento en Android

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado para la materia de Aplicaciones Móviles 1 - UPDS

## 🙏 Agradecimientos

- Google Books API por proporcionar los datos de libros
- Expo por el framework de desarrollo
- React Navigation por la navegación
- La comunidad de React Native por las librerías y documentación
