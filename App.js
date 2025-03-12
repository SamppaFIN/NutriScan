import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from './src/context/UserContext';
import AppNavigator from './src/navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { LogBox } from 'react-native';
import { theme } from './src/styles/theme';

// Ignore specific warnings if necessary
LogBox.ignoreLogs([
  'Warning: Failed prop type',
  'Warning: "shadow',
  'Warning: The following props are not supported'
]);

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AppNavigator />
        </NavigationContainer>
      </UserProvider>
    </SafeAreaProvider>
  );
}

// Simple fallback component for troubleshooting if needed
export const AppFallback = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finnish Food Scanner</Text>
      <Text style={styles.subtitle}>Scan Finnish grocery products</Text>
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
  },
});
