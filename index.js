import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import { createRoot } from 'react-dom/client';
import App from './App';

// For web platform, use ReactDOM
if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root') || document.getElementById('app');
  const root = createRoot(rootTag);
  root.render(<App />);
} else {
  // For mobile platforms, use Expo's registration
  registerRootComponent(App);
}