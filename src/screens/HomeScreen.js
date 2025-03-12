import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import LoadingIndicator from '../components/LoadingIndicator';
import { UserContext } from '../context/UserContext';
import { getRecentProducts } from '../services/storageService';
import { theme } from '../styles/theme';

const HomeScreen = ({ navigation }) => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    loadRecentProducts();
  }, []);

  const loadRecentProducts = async () => {
    try {
      setLoading(true);
      const products = await getRecentProducts();
      setRecentProducts(products || []);
    } catch (error) {
      console.error('Error loading recent products:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderEmptyState = () => (
    <EmptyState
      icon="shopping-bag"
      title="No recent products"
      message="Scan your first product to get started"
    />
  );

  return (
    <View style={styles.container}>
      <Header title="Finnish Food Scanner" />
      
      <ScrollView style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            Hello, {user?.name || 'there'}!
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Scan food products to check their contents
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Products</Text>
          {loading ? (
            <LoadingIndicator />
          ) : (
            recentProducts.length > 0 ? (
              <FlatList
                data={recentProducts}
                renderItem={({ item }) => (
                  <ProductCard
                    product={item}
                    onPress={() => navigation.navigate('ProductInfo', { product: item })}
                  />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              renderEmptyState()
            )
          )}
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.scanButton]}
            onPress={() => navigation.navigate('Scanner')}
          >
            <Feather name="camera" size={24} color="white" />
            <Text style={styles.actionButtonText}>Scan Product</Text>
          </TouchableOpacity>

          <View style={styles.smallButtonsContainer}>
            <TouchableOpacity 
              style={styles.smallButton}
              onPress={() => navigation.navigate('Recipes')}
            >
              <Feather name="book-open" size={20} color={theme.colors.primary} />
              <Text style={styles.smallButtonText}>Recipes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.smallButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <Feather name="settings" size={20} color={theme.colors.primary} />
              <Text style={styles.smallButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.text,
  },
  actionSection: {
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  scanButton: {
    backgroundColor: theme.colors.primary,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  smallButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: theme.colors.cardBackground,
    flex: 0.48,
  },
  smallButtonText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default HomeScreen;
