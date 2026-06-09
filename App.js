import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { PreferencesProvider } from './src/context/PreferencesContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <PreferencesProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </PreferencesProvider>
  );
}
