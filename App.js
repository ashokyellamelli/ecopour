import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';

import { CartProvider, useCart } from './src/context/CartContext';
import { Colors } from './src/theme/colors';

import HomeScreen from './src/screens/HomeScreen';
import ShopScreen from './src/screens/ShopScreen';
import CartScreen from './src/screens/CartScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import SearchScreen from './src/screens/SearchScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CartTabIcon({ color, size }) {
  const { cartCount } = useCart();
  return (
    <View>
      <Text style={{ fontSize: size, color }}>🛒</Text>
      {cartCount > 0 && (
        <View style={{
          position: 'absolute', top: -4, right: -6,
          backgroundColor: Colors.error, borderRadius: 8,
          minWidth: 16, height: 16,
          alignItems: 'center', justifyContent: 'center',
          paddingHorizontal: 3,
        }}>
          <Text style={{ color: '#fff', fontSize: 9, fontWeight: '800' }}>
            {cartCount > 9 ? '9+' : cartCount}
          </Text>
        </View>
      )}
    </View>
  );
}

function TabIcon({ emoji, color }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <TabIcon emoji="🏠" color={color} />,
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopScreen}
        options={{
          tabBarLabel: 'Shop',
          tabBarIcon: ({ color }) => <TabIcon emoji="🛍️" color={color} />,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color, size }) => <CartTabIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon emoji="👤" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </CartProvider>
    </SafeAreaProvider>
  );
}
