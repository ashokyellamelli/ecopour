import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';

const RECENT = ['Apple Juice', 'Almonds', 'Toor Dal', 'Pumpkin Seeds'];
const POPULAR = ['Cold pressed', 'Dry fruits', 'Pulses', 'Watermelon', 'Beetroot'];

export default function SearchScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subcategory?.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Search Bar */}
      <View style={styles.searchRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search EcoPour products..."
            placeholderTextColor={Colors.gray}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {query.length === 0 ? (
        <View style={styles.suggestions}>
          <Text style={styles.suggestionLabel}>Recent Searches</Text>
          <View style={styles.chips}>
            {RECENT.map(term => (
              <TouchableOpacity key={term} style={styles.chip} onPress={() => setQuery(term)}>
                <Text style={styles.chipIcon}>🕐</Text>
                <Text style={styles.chipText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.suggestionLabel}>Popular</Text>
          <View style={styles.chips}>
            {POPULAR.map(term => (
              <TouchableOpacity key={term} style={[styles.chip, styles.popularChip]} onPress={() => setQuery(term)}>
                <Text style={styles.chipIcon}>🔥</Text>
                <Text style={styles.chipText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.noResults}>
          <Text style={styles.noResultsEmoji}>😕</Text>
          <Text style={styles.noResultsTitle}>No results for "{query}"</Text>
          <Text style={styles.noResultsSub}>Try a different keyword</Text>
        </View>
      ) : (
        <FlatList
          data={results}
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
          ListHeaderComponent={
            <Text style={styles.resultsCount}>{results.length} result{results.length !== 1 ? 's' : ''}</Text>
          }
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: Colors.white, gap: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.lightGray, alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { fontSize: 18, color: Colors.text },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.lightGray, borderRadius: 12,
    paddingHorizontal: 12, height: 44, gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text },
  clearBtn: { fontSize: 14, color: Colors.gray, padding: 4 },
  suggestions: { padding: 20 },
  suggestionLabel: {
    fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 12, marginTop: 8,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.white, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.border,
  },
  popularChip: { backgroundColor: '#FFF8E1', borderColor: '#FFE082' },
  chipIcon: { fontSize: 14 },
  chipText: { fontSize: 13, color: Colors.text },
  noResults: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  noResultsEmoji: { fontSize: 64, marginBottom: 16 },
  noResultsTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  noResultsSub: { fontSize: 14, color: Colors.textLight },
  grid: { padding: 16 },
  gridRow: { justifyContent: 'space-between' },
  resultsCount: {
    fontSize: 12, color: Colors.gray, marginBottom: 8,
  },
});
