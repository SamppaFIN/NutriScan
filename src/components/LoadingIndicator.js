import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { theme } from '../styles/theme';

const LoadingIndicator = ({ text, color = theme.colors.primary }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  }
});

export default LoadingIndicator;
