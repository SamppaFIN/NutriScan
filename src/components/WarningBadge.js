import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '../constants/colors';

export default function WarningBadge({ warning }) {
  // Define icon based on warning type
  let icon = 'alert-triangle';
  if (warning.type === 'allergen') icon = 'alert-octagon';
  if (warning.type === 'eCode') icon = 'alert-circle';
  if (warning.type === 'sugar') icon = 'droplet';

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Feather name={icon} size={20} color="white" />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{warning.title}</Text>
        <Text style={styles.description}>{warning.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: 'rgba(255, 85, 85, 0.1)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  iconContainer: {
    backgroundColor: colors.warning,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.warning,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});
