import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { useCart } from '../context/CartContext';

export default function CartScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { items, updateQuantity, removeFromCart, cartTotal, cartCount, savings, clearCart } = useCart();

  const deliveryFee = cartTotal > 0 && cartTotal < 499 ? 40 : 0;
  const finalTotal = cartTotal + deliveryFee;

  if (items.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add some natural goodness to your cart!</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.navigate('Shop')}
          >
            <Text style={styles.shopBtnText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart ({cartCount})</Text>
        <TouchableOpacity
          onPress={() => Alert.alert('Clear Cart', 'Remove all items?', [
            { text: 'Cancel' },
            { text: 'Clear', onPress: clearCart, style: 'destructive' }
          ])}
        >
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Free delivery banner */}
      {cartTotal < 499 && (
        <View style={styles.freeBanner}>
          <Text style={styles.freeBannerText}>
            🚚 Add ₹{499 - cartTotal} more for FREE delivery!
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min((cartTotal / 499) * 100, 100)}%` }]} />
          </View>
        </View>
      )}
      {cartTotal >= 499 && (
        <View style={[styles.freeBanner, styles.freeBannerSuccess]}>
          <Text style={[styles.freeBannerText, { color: Colors.primary }]}>
            ✅ You've unlocked FREE delivery!
          </Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={styles.itemsList}>
          {items.map(item => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.itemEmoji}>
                <Text style={styles.itemEmojiText}>{item.emoji}</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemUnit}>{item.unit}</Text>
                <View style={styles.itemPriceRow}>
                  <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                  {item.originalPrice && (
                    <Text style={styles.itemOriginal}>₹{item.originalPrice * item.quantity}</Text>
                  )}
                </View>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity
                  onPress={() => removeFromCart(item.id)}
                  style={styles.removeBtn}
                >
                  <Text style={styles.removeBtnText}>🗑️</Text>
                </TouchableOpacity>
                <View style={styles.qtyControl}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Text style={styles.qtyBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Savings */}
        {savings > 0 && (
          <View style={styles.savingsBox}>
            <Text style={styles.savingsText}>🎉 You're saving ₹{savings} on this order!</Text>
          </View>
        )}

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({cartCount} items)</Text>
            <Text style={styles.summaryValue}>₹{cartTotal}</Text>
          </View>
          {savings > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: Colors.success }]}>Discount Savings</Text>
              <Text style={[styles.summaryValue, { color: Colors.success }]}>−₹{savings}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={[styles.summaryValue, deliveryFee === 0 && { color: Colors.success }]}>
              {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{finalTotal}</Text>
          </View>
        </View>

        {/* EcoPour Promise */}
        <View style={styles.promiseRow}>
          {[
            { emoji: '🌿', label: '100% Natural' },
            { emoji: '🚚', label: 'Fast Delivery' },
            { emoji: '↩️', label: 'Easy Returns' },
            { emoji: '🔒', label: 'Secure Pay' },
          ].map(item => (
            <View key={item.label} style={styles.promiseChip}>
              <Text style={styles.promiseEmoji}>{item.emoji}</Text>
              <Text style={styles.promiseLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Checkout Button */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.totalSummary}>
          <Text style={styles.bottomTotal}>₹{finalTotal}</Text>
          {savings > 0 && <Text style={styles.bottomSavings}>Saved ₹{savings}</Text>}
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Checkout')}
          activeOpacity={0.85}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Checkout →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  emptyContainer: {},
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.lightGray, alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { fontSize: 20, color: Colors.text },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  clearText: { fontSize: 14, color: Colors.error, fontWeight: '600' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyEmoji: { fontSize: 80, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: Colors.textLight, marginBottom: 32, textAlign: 'center' },
  shopBtn: {
    backgroundColor: Colors.primary, borderRadius: 20,
    paddingHorizontal: 32, paddingVertical: 14,
  },
  shopBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
  freeBanner: {
    backgroundColor: '#FFF8E1', paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#FFE082',
  },
  freeBannerSuccess: { backgroundColor: Colors.accent, borderBottomColor: Colors.primaryLight },
  freeBannerText: { fontSize: 13, fontWeight: '600', color: Colors.warning, marginBottom: 6 },
  progressBar: {
    height: 4, backgroundColor: Colors.border, borderRadius: 2, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', backgroundColor: Colors.secondary, borderRadius: 2,
  },
  itemsList: { padding: 16, gap: 12 },
  cartItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: 16, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    gap: 12,
  },
  itemEmoji: {
    width: 64, height: 64, borderRadius: 12,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
  },
  itemEmojiText: { fontSize: 36 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  itemUnit: { fontSize: 12, color: Colors.gray, marginBottom: 6 },
  itemPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemPrice: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  itemOriginal: { fontSize: 12, color: Colors.gray, textDecorationLine: 'line-through' },
  itemActions: { alignItems: 'center', gap: 8 },
  removeBtn: { padding: 4 },
  removeBtnText: { fontSize: 16 },
  qtyControl: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.lightGray, borderRadius: 10, overflow: 'hidden',
  },
  qtyBtn: {
    paddingHorizontal: 10, paddingVertical: 6, backgroundColor: Colors.primary,
  },
  qtyBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  qtyValue: {
    paddingHorizontal: 12, fontSize: 14, fontWeight: '700', color: Colors.text,
  },
  savingsBox: {
    marginHorizontal: 16, backgroundColor: '#E8F5E9', borderRadius: 12,
    padding: 12, borderWidth: 1, borderColor: Colors.primaryLight,
  },
  savingsText: { color: Colors.primary, fontWeight: '600', fontSize: 14, textAlign: 'center' },
  summaryCard: {
    marginHorizontal: 16, marginTop: 16, backgroundColor: Colors.white,
    borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 16 },
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10,
  },
  summaryLabel: { fontSize: 14, color: Colors.textLight },
  summaryValue: { fontSize: 14, fontWeight: '600', color: Colors.text },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 10 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: Colors.text },
  totalValue: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  promiseRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    margin: 16, backgroundColor: Colors.white, borderRadius: 16, padding: 16,
  },
  promiseChip: { alignItems: 'center', gap: 4 },
  promiseEmoji: { fontSize: 24 },
  promiseLabel: { fontSize: 11, fontWeight: '600', color: Colors.textLight, textAlign: 'center' },
  bottomBar: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: Colors.white, paddingHorizontal: 20, paddingTop: 16,
    borderTopWidth: 1, borderTopColor: Colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 12,
  },
  totalSummary: {},
  bottomTotal: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  bottomSavings: { fontSize: 11, color: Colors.success, fontWeight: '600' },
  checkoutBtn: {
    flex: 1, backgroundColor: Colors.primary, borderRadius: 16,
    paddingVertical: 16, alignItems: 'center',
  },
  checkoutBtnText: { color: Colors.white, fontSize: 15, fontWeight: '700' },
});
