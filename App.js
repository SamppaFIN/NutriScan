import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from './src/context/UserContext';
import { NavigationContainer } from '@react-navigation/native';
import { LogBox } from 'react-native';
import { theme } from './src/styles/theme';

// Ignore specific warnings if necessary
LogBox.ignoreLogs([
  'Warning: Failed prop type',
  'Warning: "shadow',
  'Warning: The following props are not supported'
]);

// We're starting with a simple app structure to debug the rendering
export default function App() {
  const [showFallback, setShowFallback] = useState(true);

  if (showFallback) {
    return <AppFallback onContinue={() => setShowFallback(false)} />;
  }

  return (
    <SafeAreaProvider>
      <UserProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <View style={styles.mainContainer}>
            <Text style={styles.welcomeText}>Welcome to Finnish Food Scanner!</Text>
            <Text style={styles.descriptionText}>
              Scan food products to check their contents, allergens, and get recipe recommendations.
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => console.log('Scan button pressed')}>
              <Text style={styles.buttonText}>Scan Product</Text>
            </TouchableOpacity>
          </View>
        </NavigationContainer>
      </UserProvider>
    </SafeAreaProvider>
  );
}

// Simple fallback component for troubleshooting
const AppFallback = ({ onContinue }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finnish Food Scanner</Text>
      <Text style={styles.subtitle}>Scan Finnish grocery products</Text>
      <TouchableOpacity style={styles.startButton} onPress={onContinue}>
        <Text style={styles.startButtonText}>Start App</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mainContainer: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
