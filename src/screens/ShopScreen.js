import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  FlatList, TextInput, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { PRODUCTS, CATEGORIES } from '../data/products';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { useCart } from '../context/CartContext';

const SORT_OPTIONS = ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Discount'];

export default function ShopScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const initCategory = route?.params?.categoryId || 'all';
  const [selectedCategory, setSelectedCategory] = useState(initCategory);
  const [sortBy, setSortBy] = useState('Relevance');
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case 'Price: Low to High': result.sort((a, b) => a.price - b.price); break;
      case 'Price: High to Low': result.sort((a, b) => b.price - a.price); break;
      case 'Rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'Discount':
        result.sort((a, b) => {
          const discA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) : 0;
          const discB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) : 0;
          return discB - discA;
        });
        break;
      default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return result;
  }, [selectedCategory, sortBy, searchQuery]);

  const allCategories = [
    { id: 'all', name: 'All\nProducts', emoji: '🛍️', color: '#E8F5E9', iconBg: Colors.primary },
    ...CATEGORIES,
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🌿 EcoPour Shop</Text>
        <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.cartIcon}>🛒</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search juices, dry fruits, pulses..."
          placeholderTextColor={Colors.gray}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
        style={styles.categoriesContainer}
      >
        {allCategories.map(cat => (
          <CategoryCard
            key={cat.id}
            category={cat}
            isSelected={selectedCategory === cat.id}
            onPress={() => setSelectedCategory(cat.id)}
          />
        ))}
      </ScrollView>

      {/* Sort Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sortRow}
      >
        {SORT_OPTIONS.map(option => (
          <TouchableOpacity
            key={option}
            style={[styles.sortChip, sortBy === option && styles.sortChipActive]}
            onPress={() => setSortBy(option)}
          >
            <Text style={[styles.sortChipText, sortBy === option && styles.sortChipTextActive]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results Count */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>No products found</Text>
          <Text style={styles.emptySubtitle}>Try a different search or category</Text>
          <TouchableOpacity style={styles.clearBtn} onPress={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
            <Text style={styles.clearBtnText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          numColumns={2}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.gridRow}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
            />
          )}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  cartBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.lightGray, alignItems: 'center', justifyContent: 'center',
  },
  cartIcon: { fontSize: 18 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text },
  clearIcon: { fontSize: 14, color: Colors.gray, padding: 4 },
  categoriesContainer: { maxHeight: 110 },
  categoriesScroll: { paddingHorizontal: 16, gap: 10, paddingVertical: 4 },
  sortRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  sortChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  sortChipText: { fontSize: 12, fontWeight: '500', color: Colors.textLight },
  sortChipTextActive: { color: Colors.white, fontWeight: '700' },
  resultsRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsText: { fontSize: 12, color: Colors.gray },
  grid: { paddingHorizontal: 16 },
  gridRow: { justifyContent: 'space-between' },
  emptyState: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40,
  },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: Colors.textLight, marginBottom: 24 },
  clearBtn: {
    backgroundColor: Colors.primary, borderRadius: 20,
    paddingHorizontal: 24, paddingVertical: 10,
  },
  clearBtnText: { color: Colors.white, fontWeight: '600' },
});
