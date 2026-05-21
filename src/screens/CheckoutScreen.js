import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { useCart } from '../context/CartContext';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: '📱', sub: 'PhonePe, GPay, Paytm' },
  { id: 'card', label: 'Card', icon: '💳', sub: 'Credit / Debit' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵', sub: 'Pay when delivered' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦', sub: 'All major banks' },
];

export default function CheckoutScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { items, cartTotal, savings, clearCart } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [step, setStep] = useState(1); // 1=address, 2=payment, 3=review

  const deliveryFee = cartTotal < 499 ? 40 : 0;
  const finalTotal = cartTotal + deliveryFee;

  const handlePlaceOrder = () => {
    if (!name.trim() || !phone.trim() || !address.trim() || !pincode.trim()) {
      Alert.alert('Missing Details', 'Please fill in all delivery details');
      return;
    }
    Alert.alert(
      '🎉 Order Placed!',
      `Your order has been placed successfully!\n\nOrder total: ₹${finalTotal}\nEstimated delivery: 2-3 business days\n\nThank you for choosing EcoPour! 🌿`,
      [
        {
          text: 'Continue Shopping',
          onPress: () => { clearCart(); navigation.navigate('Home'); }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Steps */}
      <View style={styles.steps}>
        {['Delivery', 'Payment', 'Review'].map((s, i) => (
          <React.Fragment key={s}>
            <TouchableOpacity style={styles.step} onPress={() => setStep(i + 1)}>
              <View style={[styles.stepCircle, step >= i + 1 && styles.stepCircleActive]}>
                <Text style={[styles.stepNum, step >= i + 1 && styles.stepNumActive]}>
                  {step > i + 1 ? '✓' : i + 1}
                </Text>
              </View>
              <Text style={[styles.stepLabel, step === i + 1 && styles.stepLabelActive]}>{s}</Text>
            </TouchableOpacity>
            {i < 2 && <View style={[styles.stepLine, step > i + 1 && styles.stepLineActive]} />}
          </React.Fragment>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {step === 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 Delivery Address</Text>

            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              placeholderTextColor={Colors.gray}
            />

            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="+91 XXXXX XXXXX"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor={Colors.gray}
            />

            <Text style={styles.inputLabel}>Full Address *</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Flat/House No, Street, Area, Landmark"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              placeholderTextColor={Colors.gray}
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>City</Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                  placeholderTextColor={Colors.gray}
                />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Pincode *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="500000"
                  value={pincode}
                  onChangeText={setPincode}
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholderTextColor={Colors.gray}
                />
              </View>
            </View>

            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                🚚 Currently delivering across Hyderabad & Telangana. Free delivery on orders above ₹499.
              </Text>
            </View>

            <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(2)}>
              <Text style={styles.nextBtnText}>Continue to Payment →</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💳 Payment Method</Text>
            {PAYMENT_METHODS.map(method => (
              <TouchableOpacity
                key={method.id}
                style={[styles.paymentCard, paymentMethod === method.id && styles.paymentCardActive]}
                onPress={() => setPaymentMethod(method.id)}
              >
                <Text style={styles.paymentIcon}>{method.icon}</Text>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentLabel}>{method.label}</Text>
                  <Text style={styles.paymentSub}>{method.sub}</Text>
                </View>
                <View style={[styles.radio, paymentMethod === method.id && styles.radioActive]}>
                  {paymentMethod === method.id && <View style={styles.radioFill} />}
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(3)}>
              <Text style={styles.nextBtnText}>Review Order →</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Order Review</Text>

            {/* Delivery Summary */}
            <View style={styles.reviewCard}>
              <Text style={styles.reviewCardTitle}>📍 Delivery To</Text>
              <Text style={styles.reviewText}>{name || '—'}</Text>
              <Text style={styles.reviewText}>{phone || '—'}</Text>
              <Text style={styles.reviewText}>{address || '—'}</Text>
              <Text style={styles.reviewText}>{city} - {pincode || '—'}</Text>
            </View>

            {/* Payment Summary */}
            <View style={styles.reviewCard}>
              <Text style={styles.reviewCardTitle}>💳 Payment</Text>
              <Text style={styles.reviewText}>
                {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}
              </Text>
            </View>

            {/* Items Summary */}
            <View style={styles.reviewCard}>
              <Text style={styles.reviewCardTitle}>🛒 Items ({items.length})</Text>
              {items.map(item => (
                <View key={item.id} style={styles.orderItem}>
                  <Text style={styles.orderItemEmoji}>{item.emoji}</Text>
                  <Text style={styles.orderItemName}>{item.name} × {item.quantity}</Text>
                  <Text style={styles.orderItemPrice}>₹{item.price * item.quantity}</Text>
                </View>
              ))}
            </View>

            {/* Price Breakdown */}
            <View style={styles.reviewCard}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLbl}>Subtotal</Text>
                <Text style={styles.priceVal}>₹{cartTotal}</Text>
              </View>
              {savings > 0 && (
                <View style={styles.priceRow}>
                  <Text style={[styles.priceLbl, { color: Colors.success }]}>Discount</Text>
                  <Text style={[styles.priceVal, { color: Colors.success }]}>−₹{savings}</Text>
                </View>
              )}
              <View style={styles.priceRow}>
                <Text style={styles.priceLbl}>Delivery</Text>
                <Text style={[styles.priceVal, deliveryFee === 0 && { color: Colors.success }]}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </Text>
              </View>
              <View style={[styles.priceRow, styles.totalRow]}>
                <Text style={styles.totalLbl}>Total</Text>
                <Text style={styles.totalVal}>₹{finalTotal}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Place Order */}
      {step === 3 && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
          <View>
            <Text style={styles.payTotal}>₹{finalTotal}</Text>
            <Text style={styles.payLabel}>Total Payable</Text>
          </View>
          <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder} activeOpacity={0.85}>
            <Text style={styles.placeOrderText}>🌿 Place Order</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
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
  steps: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 16,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  step: { alignItems: 'center', flex: 0 },
  stepCircle: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.lightGray, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.border,
  },
  stepCircleActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stepNum: { fontSize: 12, fontWeight: '700', color: Colors.gray },
  stepNumActive: { color: Colors.white },
  stepLabel: { fontSize: 11, color: Colors.gray, marginTop: 4, fontWeight: '500' },
  stepLabelActive: { color: Colors.primary, fontWeight: '700' },
  stepLine: { flex: 1, height: 2, backgroundColor: Colors.border, marginHorizontal: 4, marginBottom: 16 },
  stepLineActive: { backgroundColor: Colors.primary },
  scroll: { flex: 1 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: Colors.textLight, marginBottom: 6 },
  input: {
    backgroundColor: Colors.white, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: Colors.text,
    borderWidth: 1, borderColor: Colors.border,
    marginBottom: 14,
  },
  multilineInput: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  noteBox: {
    backgroundColor: '#E3F2FD', borderRadius: 12, padding: 12,
    marginBottom: 20,
  },
  noteText: { fontSize: 13, color: '#1565C0', lineHeight: 20 },
  nextBtn: {
    backgroundColor: Colors.primary, borderRadius: 16,
    paddingVertical: 16, alignItems: 'center',
  },
  nextBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
  paymentCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: 16,
    padding: 16, marginBottom: 10,
    borderWidth: 2, borderColor: Colors.border,
  },
  paymentCardActive: { borderColor: Colors.primary, backgroundColor: Colors.accent },
  paymentIcon: { fontSize: 28, width: 44 },
  paymentInfo: { flex: 1 },
  paymentLabel: { fontSize: 15, fontWeight: '700', color: Colors.text },
  paymentSub: { fontSize: 12, color: Colors.gray },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: Colors.primary },
  radioFill: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  reviewCard: {
    backgroundColor: Colors.white, borderRadius: 16,
    padding: 16, marginBottom: 12,
  },
  reviewCardTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 10 },
  reviewText: { fontSize: 14, color: Colors.textLight, marginBottom: 3 },
  orderItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, gap: 10 },
  orderItemEmoji: { fontSize: 22 },
  orderItemName: { flex: 1, fontSize: 13, color: Colors.text },
  orderItemPrice: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  priceLbl: { fontSize: 14, color: Colors.textLight },
  priceVal: { fontSize: 14, fontWeight: '600', color: Colors.text },
  totalRow: { borderTopWidth: 1, borderTopColor: Colors.border, marginTop: 6, paddingTop: 10 },
  totalLbl: { fontSize: 16, fontWeight: '800', color: Colors.text },
  totalVal: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  bottomBar: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: Colors.white, paddingHorizontal: 20, paddingTop: 16,
    borderTopWidth: 1, borderTopColor: Colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 12,
  },
  payTotal: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  payLabel: { fontSize: 11, color: Colors.gray },
  placeOrderBtn: {
    flex: 1, backgroundColor: Colors.primary, borderRadius: 16,
    paddingVertical: 16, alignItems: 'center',
  },
  placeOrderText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
