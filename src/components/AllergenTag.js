import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const AllergenTag = ({ name, onRemove, removable = false }) => {
  return (
    <View style={styles.tag}>
      <Feather name="alert-circle" size={12} color={theme.colors.warning} />
      <Text style={styles.text}>{name}</Text>
      
      {removable && (
        <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
          <Feather name="x" size={12} color={theme.colors.warning} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.warningBackground,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
    color: theme.colors.warning,
    marginLeft: 4,
  },
  removeButton: {
    marginLeft: 4,
  }
});

export default AllergenTag;
