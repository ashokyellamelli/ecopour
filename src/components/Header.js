import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';

export default function Header({ title, showBack, onBack, rightIcon, onRight, transparent }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container,
      { paddingTop: insets.top + 8 },
      transparent && styles.transparent,
    ]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.row}>
        {showBack ? (
          <TouchableOpacity style={styles.iconBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        ) : <View style={styles.iconBtn} />}

        <Text style={styles.title}>{title}</Text>

        {rightIcon ? (
          <TouchableOpacity style={styles.iconBtn} onPress={onRight} activeOpacity={0.7}>
            <Text style={styles.rightIcon}>{rightIcon}</Text>
          </TouchableOpacity>
        ) : <View style={styles.iconBtn} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  transparent: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
  },
  backIcon: {
    fontSize: 20,
    color: Colors.text,
  },
  rightIcon: {
    fontSize: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
  },
});
