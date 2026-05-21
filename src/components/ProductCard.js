import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function ProductCard({ product, onPress, style }) {
  const { addToCart, isInCart, getQuantity, updateQuantity } = useCart();
  const qty = getQuantity(product.id);

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.92}
    >
      {/* Badge */}
      {product.badge && (
        <View style={[
          styles.badge,
          product.badge === 'BEST SELLER' ? styles.badgeBestSeller :
          product.badge === 'NEW' ? styles.badgeNew : styles.badgeSale
        ]}>
          <Text style={styles.badgeText}>{product.badge}</Text>
        </View>
      )}

      {!product.inStock && (
        <View style={styles.soldOutOverlay}>
          <Text style={styles.soldOutText}>SOLD OUT</Text>
        </View>
      )}

      {/* Product Emoji Image */}
      <View style={styles.imageContainer}>
        <Text style={styles.emoji}>{product.emoji}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.unit}>{product.unit}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{product.price}</Text>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
          )}
        </View>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.ratingText}>{product.rating}</Text>
          <Text style={styles.reviewCount}>({product.reviews})</Text>
        </View>
      </View>

      {/* Add to Cart Button */}
      {product.inStock && (
        <View style={styles.cartAction}>
          {qty === 0 ? (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addToCart(product)}
              activeOpacity={0.8}
            >
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.qtyControl}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(product.id, qty - 1)}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{qty}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(product.id, qty + 1)}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeSale: { backgroundColor: Colors.error },
  badgeBestSeller: { backgroundColor: Colors.secondary },
  badgeNew: { backgroundColor: Colors.primary },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  soldOutOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    zIndex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldOutText: {
    color: Colors.error,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  imageContainer: {
    height: 110,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 56,
  },
  info: {
    padding: 10,
  },
  name: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: 2,
    fontSize: 13,
  },
  unit: {
    ...Typography.caption,
    color: Colors.gray,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  price: {
    ...Typography.price,
    color: Colors.primary,
  },
  originalPrice: {
    ...Typography.priceStrike,
    color: Colors.gray,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  star: {
    color: Colors.secondary,
    fontSize: 12,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text,
  },
  reviewCount: {
    fontSize: 10,
    color: Colors.gray,
  },
  cartAction: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    borderRadius: 8,
    overflow: 'hidden',
  },
  qtyBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  qtyBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
  qtyText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});
