import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '../constants/colors';

export default function AllergenTag({ 
  text, 
  description,
  isWarning = false, 
  isSelected = false,
  onDelete 
}) {
  // Determine style based on props
  const tagStyle = isWarning 
    ? styles.warningTag 
    : isSelected 
      ? styles.selectedTag 
      : styles.tag;
    
  const textStyle = isWarning || isSelected
    ? styles.warningText
    : styles.text;

  return (
    <View style={tagStyle}>
      <Text style={textStyle}>{text}</Text>
      
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
      
      {onDelete && (
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={onDelete}
        >
          <Feather name="x" size={14} color={isWarning ? "white" : "#666"} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedTag: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningTag: {
    backgroundColor: colors.warning,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    color: '#555',
  },
  warningText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  description: {
    fontSize: 12,
    color: '#777',
    marginLeft: 4,
  },
  deleteButton: {
    marginLeft: 6,
  },
});
