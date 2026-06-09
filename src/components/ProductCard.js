import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { checkForWarnings } from '../utils/allergenUtils';
import colors from '../constants/colors';

export default function ProductCard({ product, onPress, preferences }) {
  const warnings = checkForWarnings(product, preferences);
  const hasWarnings = warnings.length > 0;

  return (
    <TouchableOpacity 
      style={[styles.container, hasWarnings && styles.warningContainer]} 
      onPress={onPress}
    >
      <View style={styles.contentContainer}>
        <View style={styles.leftSection}>
          <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.manufacturer} numberOfLines={1}>{product.manufacturer}</Text>
          
          {/* Basic nutritional info preview — only show when data exists */}
          {product.nutritionalInfo?.calories > 0 && (
            <View style={styles.nutritionPreview}>
              <Text style={styles.nutritionItem}>
                {product.nutritionalInfo.calories} kcal
              </Text>
              {product.nutritionalInfo?.protein > 0 && (
                <Text style={styles.nutritionItem}>
                  Protein: {product.nutritionalInfo.protein}g
                </Text>
              )}
            </View>
          )}
        </View>
        
        <View style={styles.rightSection}>
          {hasWarnings ? (
            <View style={styles.warningBadge}>
              <Feather name="alert-triangle" size={18} color="white" />
              <Text style={styles.warningCount}>
                {warnings.length}
              </Text>
            </View>
          ) : (
            <View style={styles.okBadge}>
              <Feather name="check-circle" size={22} color={colors.green} />
            </View>
          )}
          <Feather name="chevron-right" size={20} color="#aaa" />
        </View>
      </View>
      
      {/* Badge for e-codes if present */}
      {product.eCodes && product.eCodes.length > 0 && (
        <View style={styles.badgeContainer}>
          <View style={styles.eCodeBadge}>
            <Text style={styles.eCodeText}>
              {product.eCodes.length} E-codes
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  warningContainer: {
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
    paddingRight: a5,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  manufacturer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  nutritionPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  nutritionItem: {
    fontSize: 12,
    color: '#888',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 10,
  },
  warningCount: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  okBadge: {
    marginRight: 10,
  },
  badgeContainer: {
    position: 'absolute',
    top: -10,
    right: 10,
  },
  eCodeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eCodeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
