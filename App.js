import React from 'react';
import { Text, View } from 'react-native';

// Ultra minimal version to test basic rendering
export default function App() {
  return (
    <View style={{ 
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center', 
      backgroundColor: 'white',
      padding: 20
    }}>
      <Text style={{ 
        fontSize: 24,
        color: 'blue',
        textAlign: 'center',
        marginBottom: 20
      }}>
        Welcome to Foodscan Finland
      </Text>
      <Text style={{ 
        fontSize: 16,
        color: 'black',
        textAlign: 'center'
      }}>
        This is a bare minimum test to ensure React Native can render correctly.
      </Text>
    </View>
  );
}
