import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { useCart } from '../context/CartContext';

const MENU_SECTIONS = [
  {
    title: 'My Account',
    items: [
      { icon: '📦', label: 'My Orders', badge: '2 Active' },
      { icon: '❤️', label: 'Wishlist', badge: null },
      { icon: '📍', label: 'Saved Addresses', badge: null },
      { icon: '💳', label: 'Payment Methods', badge: null },
    ],
  },
  {
    title: 'Help & Support',
    items: [
      { icon: '💬', label: 'Chat with Us', badge: null },
      { icon: '📞', label: 'Call Support', badge: null },
      { icon: '❓', label: 'FAQs', badge: null },
      { icon: '↩️', label: 'Returns & Refunds', badge: null },
    ],
  },
  {
    title: 'About',
    items: [
      { icon: '🌿', label: 'About EcoPour', badge: null },
      { icon: '📄', label: 'Privacy Policy', badge: null },
      { icon: '📋', label: 'Terms & Conditions', badge: null },
      { icon: '⭐', label: 'Rate the App', badge: null },
    ],
  },
];

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { wishlist, cartCount } = useCart();
  const [notifications, setNotifications] = useState(true);
  const [offers, setOffers] = useState(true);
  const [isLoggedIn] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          {isLoggedIn ? (
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Ashok Yellamelli</Text>
              <Text style={styles.userEmail}>ashok.yellamelli@gmail.com</Text>
              <Text style={styles.userLocation}>📍 Hyderabad, Telangana</Text>
            </View>
          ) : (
            <View style={styles.guestInfo}>
              <Text style={styles.guestTitle}>Welcome to EcoPour! 🌿</Text>
              <Text style={styles.guestSubtitle}>Sign in for a better experience</Text>
              <View style={styles.authButtons}>
                <TouchableOpacity style={styles.loginBtn}>
                  <Text style={styles.loginBtnText}>Log In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.signupBtn}>
                  <Text style={styles.signupBtnText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Orders', value: '0', emoji: '📦' },
            { label: 'Wishlist', value: String(wishlist.length), emoji: '❤️' },
            { label: 'Cart', value: String(cartCount), emoji: '🛒' },
            { label: 'Saved', value: '₹0', emoji: '💰' },
          ].map(stat => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statEmoji}>{stat.emoji}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Notifications Toggle */}
        <View style={styles.togglesCard}>
          <Text style={styles.togglesTitle}>Preferences</Text>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleIcon}>🔔</Text>
              <View>
                <Text style={styles.toggleLabel}>Push Notifications</Text>
                <Text style={styles.toggleSub}>Order updates & reminders</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={notifications ? Colors.primary : Colors.gray}
            />
          </View>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleIcon}>🎁</Text>
              <View>
                <Text style={styles.toggleLabel}>Offers & Deals</Text>
                <Text style={styles.toggleSub}>Exclusive discounts & new arrivals</Text>
              </View>
            </View>
            <Switch
              value={offers}
              onValueChange={setOffers}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={offers ? Colors.primary : Colors.gray}
            />
          </View>
        </View>

        {/* Menu Sections */}
        {MENU_SECTIONS.map(section => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.menuItem,
                    idx < section.items.length - 1 && styles.menuItemBorder,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuItemIcon}>{item.icon}</Text>
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                  {item.badge && (
                    <View style={styles.menuBadge}>
                      <Text style={styles.menuBadgeText}>{item.badge}</Text>
                    </View>
                  )}
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* EcoPour Brand */}
        <View style={styles.brandBox}>
          <Text style={styles.brandEmoji}>🌿</Text>
          <Text style={styles.brandName}>ECOPOUR</Text>
          <Text style={styles.brandTagline}>Pure. Natural. Refreshing.</Text>
          <Text style={styles.brandAddress}>
            Flat No. C 508, Aparna Kanopy Tulip{'\n'}
            Gundlapochampalle, Hyderabad{'\n'}
            Telangana – 500014
          </Text>
          <Text style={styles.brandContact}>📞 +91 63016 84636</Text>
          <Text style={styles.brandContact}>✉️ info@ecopour.in</Text>
        </View>

        <Text style={styles.version}>EcoPour App v1.0.0</Text>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  profileHeader: {
    backgroundColor: Colors.primary, padding: 24,
    flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  avatarContainer: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarEmoji: { fontSize: 36 },
  userInfo: { flex: 1 },
  userName: { color: Colors.white, fontSize: 20, fontWeight: '800' },
  userEmail: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 },
  userLocation: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 },
  guestInfo: { flex: 1 },
  guestTitle: { color: Colors.white, fontSize: 18, fontWeight: '800' },
  guestSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2, marginBottom: 12 },
  authButtons: { flexDirection: 'row', gap: 10 },
  loginBtn: {
    backgroundColor: Colors.white, borderRadius: 20,
    paddingHorizontal: 20, paddingVertical: 8,
  },
  loginBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
  signupBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20,
    paddingHorizontal: 20, paddingVertical: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)',
  },
  signupBtnText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  statsRow: {
    flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 16, gap: 10,
  },
  statCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: 14,
    alignItems: 'center', paddingVertical: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  statEmoji: { fontSize: 22, marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: 10, color: Colors.gray, fontWeight: '500' },
  togglesCard: {
    marginHorizontal: 16, marginBottom: 8,
    backgroundColor: Colors.white, borderRadius: 16, padding: 16,
  },
  togglesTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 14,
  },
  toggleInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  toggleIcon: { fontSize: 22 },
  toggleLabel: { fontSize: 14, fontWeight: '600', color: Colors.text },
  toggleSub: { fontSize: 12, color: Colors.gray },
  menuSection: { marginHorizontal: 16, marginBottom: 8 },
  menuSectionTitle: { fontSize: 12, fontWeight: '700', color: Colors.gray, marginBottom: 8, marginLeft: 4, textTransform: 'uppercase' },
  menuCard: {
    backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, gap: 14,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuItemIcon: { fontSize: 20, width: 28 },
  menuItemLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: Colors.text },
  menuBadge: {
    backgroundColor: Colors.accent, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  menuBadgeText: { fontSize: 11, fontWeight: '700', color: Colors.primary },
  menuArrow: { fontSize: 20, color: Colors.gray },
  brandBox: {
    margin: 16, backgroundColor: Colors.primaryDark, borderRadius: 20,
    padding: 24, alignItems: 'center',
  },
  brandEmoji: { fontSize: 40, marginBottom: 8 },
  brandName: { color: Colors.white, fontSize: 22, fontWeight: '900', letterSpacing: 3 },
  brandTagline: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4, marginBottom: 16 },
  brandAddress: { color: 'rgba(255,255,255,0.7)', fontSize: 12, textAlign: 'center', lineHeight: 20, marginBottom: 10 },
  brandContact: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 4 },
  version: { textAlign: 'center', fontSize: 11, color: Colors.gray, marginBottom: 8 },
});
