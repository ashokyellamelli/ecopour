import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { product } = route.params;
  const { addToCart, isInCart, getQuantity, updateQuantity, addToWishlist, isInWishlist } = useCart();
  const [selectedQty, setSelectedQty] = useState(1);

  const qty = getQuantity(product.id);
  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <View style={styles.container}>
      {/* Back button */}
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.navBtnText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navBtn, inWishlist && styles.navBtnActive]}
          onPress={() => addToWishlist(product)}
        >
          <Text style={styles.navBtnText}>{inWishlist ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          {product.badge && (
            <View style={[
              styles.badge,
              product.badge === 'BEST SELLER' ? styles.badgeGold :
              product.badge === 'NEW' ? styles.badgeGreen : styles.badgeRed
            ]}>
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          )}
          <Text style={styles.heroEmoji}>{product.emoji}</Text>
          {discount && (
            <View style={styles.discountBubble}>
              <Text style={styles.discountText}>{discount}% OFF</Text>
            </View>
          )}
        </View>

        {/* Details */}
        <View style={styles.details}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{product.name}</Text>
            <View style={styles.ratingPill}>
              <Text style={styles.ratingPillStar}>★</Text>
              <Text style={styles.ratingPillText}>{product.rating}</Text>
            </View>
          </View>
          <Text style={styles.reviews}>{product.reviews} verified reviews</Text>

          {/* Price */}
          <View style={styles.priceBlock}>
            <Text style={styles.price}>₹{product.price}</Text>
            {product.originalPrice && (
              <>
                <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>Save ₹{product.originalPrice - product.price}</Text>
                </View>
              </>
            )}
          </View>

          {/* Info chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.infoScroll}>
            {[
              { label: 'Unit', value: product.unit },
              { label: 'Packaging', value: product.packaging },
              { label: 'Shelf Life', value: product.shelfLife },
            ].map(info => (
              <View key={info.label} style={styles.infoChip}>
                <Text style={styles.infoLabel}>{info.label}</Text>
                <Text style={styles.infoValue}>{info.value}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Description */}
          <Text style={styles.sectionLabel}>About this product</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Benefits */}
          <Text style={styles.sectionLabel}>Key Benefits</Text>
          <View style={styles.benefitsGrid}>
            {product.benefits.map((benefit, i) => (
              <View key={i} style={styles.benefitChip}>
                <Text style={styles.benefitCheck}>✓</Text>
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          {/* Why EcoPour */}
          <View style={styles.whyBox}>
            <Text style={styles.whyTitle}>🌿 Why EcoPour?</Text>
            <Text style={styles.whyText}>
              100% natural • Chemical-free • Sustainably sourced directly from local farmers •
              Eco-friendly packaging • No artificial preservatives or colors
            </Text>
          </View>

          {!product.inStock && (
            <View style={styles.outOfStock}>
              <Text style={styles.outOfStockText}>⚠️ Currently out of stock</Text>
            </View>
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTA */}
      {product.inStock && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
          {inCart ? (
            <View style={styles.qtyCartRow}>
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
              <TouchableOpacity
                style={styles.checkoutBtn}
                onPress={() => navigation.navigate('Cart')}
              >
                <Text style={styles.checkoutBtnText}>Go to Cart →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.addToCartRow}>
              <View style={styles.totalBlock}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalPrice}>₹{product.price * selectedQty}</Text>
              </View>
              <TouchableOpacity
                style={styles.addToCartBtn}
                onPress={() => addToCart(product)}
                activeOpacity={0.85}
              >
                <Text style={styles.addToCartText}>🛒 Add to Cart</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 100,
    paddingHorizontal: 16,
  },
  navBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 6, elevation: 4,
  },
  navBtnActive: { backgroundColor: '#FFF0F0' },
  navBtnText: { fontSize: 20 },
  hero: {
    height: 280,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroEmoji: { fontSize: 130 },
  badge: {
    position: 'absolute',
    top: 80, left: 20,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 8,
  },
  badgeRed: { backgroundColor: Colors.error },
  badgeGold: { backgroundColor: Colors.secondary },
  badgeGreen: { backgroundColor: Colors.primary },
  badgeText: { color: Colors.white, fontSize: 11, fontWeight: '800' },
  discountBubble: {
    position: 'absolute',
    bottom: 20, right: 20,
    backgroundColor: Colors.error,
    borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  discountText: { color: Colors.white, fontWeight: '800', fontSize: 13 },
  details: { padding: 20 },
  nameRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', gap: 12,
  },
  name: { fontSize: 24, fontWeight: '800', color: Colors.text, flex: 1 },
  ratingPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.primary, borderRadius: 16,
    paddingHorizontal: 10, paddingVertical: 5, gap: 4,
  },
  ratingPillStar: { color: Colors.white, fontSize: 14 },
  ratingPillText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  reviews: { color: Colors.gray, fontSize: 13, marginTop: 4, marginBottom: 16 },
  priceBlock: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16,
  },
  price: { fontSize: 28, fontWeight: '800', color: Colors.primary },
  originalPrice: {
    fontSize: 18, color: Colors.gray,
    textDecorationLine: 'line-through',
  },
  savingsBadge: {
    backgroundColor: '#E8F5E9', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  savingsText: { color: Colors.primary, fontSize: 12, fontWeight: '700' },
  infoScroll: { marginBottom: 16 },
  infoChip: {
    backgroundColor: Colors.lightGray, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    marginRight: 10, alignItems: 'center',
  },
  infoLabel: { fontSize: 10, color: Colors.gray, fontWeight: '600', textTransform: 'uppercase' },
  infoValue: { fontSize: 13, fontWeight: '700', color: Colors.text, marginTop: 2 },
  sectionLabel: {
    fontSize: 16, fontWeight: '700', color: Colors.text,
    marginBottom: 10, marginTop: 16,
  },
  description: { fontSize: 14, color: Colors.textLight, lineHeight: 22 },
  benefitsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  benefitChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.accent, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8, gap: 6,
  },
  benefitCheck: { color: Colors.primary, fontWeight: '800', fontSize: 14 },
  benefitText: { fontSize: 13, fontWeight: '500', color: Colors.primary },
  whyBox: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 16, padding: 16, marginTop: 20,
  },
  whyTitle: { color: Colors.white, fontSize: 15, fontWeight: '800', marginBottom: 8 },
  whyText: { color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 20 },
  outOfStock: {
    backgroundColor: '#FFF3E0', borderRadius: 12, padding: 16,
    alignItems: 'center', marginTop: 16,
  },
  outOfStockText: { color: Colors.warning, fontWeight: '700', fontSize: 14 },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white, paddingHorizontal: 20, paddingTop: 16,
    borderTopWidth: 1, borderTopColor: Colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 12,
  },
  addToCartRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  totalBlock: {},
  totalLabel: { fontSize: 12, color: Colors.gray },
  totalPrice: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  addToCartBtn: {
    flex: 1, backgroundColor: Colors.primary, borderRadius: 16,
    paddingVertical: 16, alignItems: 'center',
  },
  addToCartText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  qtyCartRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  qtyControl: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.lightGray, borderRadius: 12, overflow: 'hidden',
  },
  qtyBtn: {
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: Colors.primary,
  },
  qtyBtnText: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  qtyText: {
    paddingHorizontal: 20, fontSize: 16, fontWeight: '700', color: Colors.text,
  },
  checkoutBtn: {
    flex: 1, backgroundColor: Colors.secondary, borderRadius: 16,
    paddingVertical: 16, alignItems: 'center',
  },
  checkoutBtnText: { color: Colors.white, fontSize: 15, fontWeight: '700' },
});
