import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {isLoading ? (
          <Text>Loading app...</Text>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Foodscan Finland</Text>
              <Text style={styles.subtitle}>Scan Finnish grocery products for allergen information and recipe ideas</Text>
            </View>
            
            <View style={styles.mainContent}>
              <Text style={styles.paragraph}>
                Welcome to Foodscan Finland! This app helps you make informed food choices by:
              </Text>
              
              <View style={styles.featureList}>
                <Text style={styles.featureItem}>• Scanning product barcodes</Text>
                <Text style={styles.featureItem}>• Identifying allergens</Text>
                <Text style={styles.featureItem}>• Warning about problematic E-codes</Text>
                <Text style={styles.featureItem}>• Suggesting recipes based on your preferences</Text>
              </View>
              
              <Text style={styles.actionText}>
                Soon you'll be able to scan products and get personalized information!
              </Text>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0074D9',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    marginBottom: 20,
  },
  featureList: {
    marginVertical: 20,
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
  },
  featureItem: {
    fontSize: 16,
    lineHeight: 28,
    color: '#333333',
  },
  actionText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#0074D9',
    marginTop: 30,
    textAlign: 'center',
  },
});
