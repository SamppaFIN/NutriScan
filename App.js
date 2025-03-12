import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Platform } from 'react-native';

export default function App() {
  // Check if we're running on web
  const isWeb = Platform.OS === 'web';
  
  // Apply different styles based on platform
  const webStyles = isWeb ? {
    containerWeb: {
      maxWidth: 800,
      margin: '0 auto',
      height: '100vh',
    },
    headerWeb: {
      paddingTop: 20,
    },
    sectionWeb: {
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    }
  } : {};
  
  // On web platform, we add a console.log to debug
  if (isWeb) {
    console.log('Running on web platform');
  }
    
  return (
    <View style={[styles.container, isWeb && webStyles.containerWeb]}>
      <View style={[styles.header, isWeb && webStyles.headerWeb]}>
        <Text style={styles.headerText}>Finnish Food Scanner</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={[styles.section, isWeb && webStyles.sectionWeb]}>
          <Text style={styles.sectionTitle}>Welcome to Food Scanner</Text>
          <Text style={styles.paragraph}>
            This application helps you scan Finnish grocery products to get detailed 
            information about ingredients, allergens, and recipe suggestions.
          </Text>
        </View>
        
        <View style={[styles.section, isWeb && webStyles.sectionWeb]}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>🔍 Barcode Scanning</Text>
            <Text style={styles.featureDescription}>
              Scan product barcodes to get detailed nutritional information
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>⚠️ Allergen Warnings</Text>
            <Text style={styles.featureDescription}>
              Set up alerts for ingredients you want to avoid
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>🍳 Recipe Suggestions</Text>
            <Text style={styles.featureDescription}>
              Get recipe ideas based on scanned products
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>🧊 Inventory Integration</Text>
            <Text style={styles.featureDescription}>
              Connect with your virtual refrigerator and freezer inventory
            </Text>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#3F51B5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#3F51B5',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  featureItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#212121',
  },
  featureDescription: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
});
