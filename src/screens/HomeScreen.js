import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';
import EmptyStateMessage from '../components/EmptyStateMessage';
import { getRecentlyScannedProducts } from '../utils/storageUtils';
import { PreferencesContext } from '../context/PreferencesContext';
import colors from '../constants/colors';

export default function HomeScreen({ navigation }) {
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const { preferences } = useContext(PreferencesContext);

  useEffect(() => {
    if (isFocused) {
      loadRecentProducts();
    }
  }, [isFocused]);

  const loadRecentProducts = async () => {
    try {
      setLoading(true);
      const products = await getRecentlyScannedProducts();
      setRecentProducts(products);
    } catch (error) {
      console.error('Error loading recent products:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToScan = () => {
    navigation.navigate('Scan');
  };

  const navigateToProductInfo = (product) => {
    navigation.navigate('ProductInfo', { product });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>
          Welcome to Finnish Food Scanner
        </Text>
        <Text style={styles.welcomeSubtitle}>
          Scan products to check ingredients and nutritional info
        </Text>
        
        <TouchableOpacity 
          style={styles.scanButton} 
          onPress={navigateToScan}
        >
          <Feather name="camera" size={24} color="white" />
          <Text style={styles.scanButtonText}>Scan a Product</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recently Scanned</Text>
        
        {recentProducts.length > 0 ? (
          <FlatList
            data={recentProducts}
            renderItem={({ item }) => (
              <ProductCard 
                product={item} 
                onPress={() => navigateToProductInfo(item)}
                preferences={preferences}
              />
            )}
            keyExtractor={(item) => item.id || item.barcode}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyStateMessage 
            icon="inbox" 
            message="No recently scanned products"
            subMessage="Scan your first product to see it here"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    padding: 20,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  scanButton: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  recentSection: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
});
