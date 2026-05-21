import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 56) / 3;

export default function CategoryCard({ category, onPress, isSelected }) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: category.color },
        isSelected && styles.selectedCard,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.iconCircle, { backgroundColor: category.iconBg }]}>
        <Text style={styles.emoji}>{category.emoji}</Text>
      </View>
      <Text style={[styles.name, isSelected && styles.selectedName]}>
        {category.name}
      </Text>
      {isSelected && <View style={styles.selectedDot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 24,
  },
  name: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 15,
  },
  selectedName: {
    color: Colors.primary,
  },
  selectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
});
