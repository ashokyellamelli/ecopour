import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { PRODUCTS, CATEGORIES, TESTIMONIALS } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';

const { width } = Dimensions.get('window');

const BANNERS = [
  {
    id: 1,
    title: 'Nature\'s Energy\nin Every Sip',
    subtitle: 'Cold-pressed, no sugar, no preservatives',
    emoji: '🍹',
    bg: ['#E8F5E9', '#C8E6C9'],
    accent: Colors.primary,
  },
  {
    id: 2,
    title: 'Wholesome\nDry Fruits',
    subtitle: 'Handpicked. Fresh. Nutritious.',
    emoji: '🌰',
    bg: ['#FFF8E1', '#FFECB3'],
    accent: Colors.secondary,
  },
  {
    id: 3,
    title: 'Farm-Fresh\nPulses',
    subtitle: 'Sustainably sourced, naturally processed',
    emoji: '🌾',
    bg: ['#F3E5F5', '#E1BEE7'],
    accent: '#8E24AA',
  },
];

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { cartCount } = useCart();
  const [activeBanner, setActiveBanner] = useState(0);

  const featuredProducts = PRODUCTS.filter(p => p.featured && p.inStock);
  const onSaleProducts = PRODUCTS.filter(p => p.originalPrice && p.inStock).slice(0, 6);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Good morning! 👋</Text>
          <Text style={styles.tagline}>EcoPour — Pure. Natural. Refreshing.</Text>
        </View>
        <View style={styles.topBarActions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Search')}
          >
            <Text style={styles.topIcon}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.topIcon}>🛒</Text>
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const page = Math.round(e.nativeEvent.contentOffset.x / (width - 32));
            setActiveBanner(page);
          }}
          style={styles.bannerScroll}
        >
          {BANNERS.map((banner) => (
            <TouchableOpacity
              key={banner.id}
              activeOpacity={0.95}
              style={[styles.heroBanner, { backgroundColor: banner.bg[0] }]}
              onPress={() => navigation.navigate('Shop')}
            >
              <View style={styles.bannerContent}>
                <Text style={[styles.bannerTitle, { color: banner.accent }]}>
                  {banner.title}
                </Text>
                <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                <TouchableOpacity
                  style={[styles.bannerBtn, { backgroundColor: banner.accent }]}
                  onPress={() => navigation.navigate('Shop')}
                >
                  <Text style={styles.bannerBtnText}>Shop Now →</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.bannerEmoji}>{banner.emoji}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Dots */}
        <View style={styles.dots}>
          {BANNERS.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeBanner && styles.dotActive]} />
          ))}
        </View>

        {/* Why EcoPour */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trustRow}
        >
          {[
            { emoji: '🌱', label: 'Chemical Free' },
            { emoji: '🚜', label: 'Farm Direct' },
            { emoji: '♻️', label: 'Eco Packaging' },
            { emoji: '💯', label: 'No Preservatives' },
            { emoji: '🏆', label: 'Premium Quality' },
          ].map((item) => (
            <View key={item.label} style={styles.trustChip}>
              <Text style={styles.trustEmoji}>{item.emoji}</Text>
              <Text style={styles.trustLabel}>{item.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoriesRow}>
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onPress={() => navigation.navigate('Shop', { categoryId: cat.id })}
              />
            ))}
          </View>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⭐ Featured Products</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredProducts}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                style={styles.horizontalCard}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
              />
            )}
          />
        </View>

        {/* On Sale */}
        <View style={[styles.section, styles.saleSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 On Sale Now</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {onSaleProducts.map(item => (
              <ProductCard
                key={item.id}
                product={item}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
              />
            ))}
          </View>
        </View>

        {/* Process Banner */}
        <View style={styles.processBanner}>
          <Text style={styles.processTitle}>From Farm to Your Table 🌿</Text>
          <Text style={styles.processSubtitle}>
            Ethically sourced → Carefully handpicked → Natural cleaning → Eco-friendly packaging → Delivered fresh
          </Text>
        </View>

        {/* Testimonials */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 What Our Customers Say</Text>
          {TESTIMONIALS.map(t => (
            <View key={t.id} style={styles.testimonialCard}>
              <View style={styles.testimonialHeader}>
                <Text style={styles.testimonialEmoji}>{t.emoji}</Text>
                <View>
                  <Text style={styles.testimonialName}>{t.name}</Text>
                  <Text style={styles.testimonialLocation}>📍 {t.location}</Text>
                </View>
                <View style={styles.starsContainer}>
                  {'★★★★★'.split('').map((s, i) => (
                    <Text key={i} style={styles.starFilled}>{s}</Text>
                  ))}
                </View>
              </View>
              <Text style={styles.testimonialText}>{t.text}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  greeting: { fontSize: 13, color: Colors.textLight },
  tagline: { fontSize: 15, fontWeight: '700', color: Colors.primary, marginTop: 2 },
  topBarActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topIcon: { fontSize: 18 },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: { color: Colors.white, fontSize: 10, fontWeight: '800' },
  bannerScroll: { marginTop: 16, paddingLeft: 16 },
  heroBanner: {
    width: width - 32,
    marginRight: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    height: 170,
    overflow: 'hidden',
  },
  bannerContent: { flex: 1 },
  bannerTitle: { fontSize: 22, fontWeight: '800', lineHeight: 28 },
  bannerSubtitle: { fontSize: 12, color: Colors.textLight, marginTop: 6, marginBottom: 16 },
  bannerBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerBtnText: { color: Colors.white, fontSize: 13, fontWeight: '700' },
  bannerEmoji: { fontSize: 72, opacity: 0.85 },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  dotActive: { backgroundColor: Colors.primary, width: 18 },
  trustRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  trustChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  trustEmoji: { fontSize: 16 },
  trustLabel: { fontSize: 12, fontWeight: '600', color: Colors.text },
  section: { paddingHorizontal: 16, marginTop: 20 },
  saleSection: { paddingHorizontal: 16 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.text },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  categoriesRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  horizontalList: { paddingRight: 16, gap: 12 },
  horizontalCard: { width: 160 },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  processBanner: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: Colors.primaryDark,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  processTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  processSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  testimonialCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  testimonialEmoji: { fontSize: 36 },
  testimonialName: { fontSize: 14, fontWeight: '700', color: Colors.text },
  testimonialLocation: { fontSize: 12, color: Colors.textLight },
  starsContainer: { flexDirection: 'row', marginLeft: 'auto' },
  starFilled: { color: Colors.secondary, fontSize: 14 },
  testimonialText: { fontSize: 13, color: Colors.textLight, lineHeight: 20, fontStyle: 'italic' },
});
