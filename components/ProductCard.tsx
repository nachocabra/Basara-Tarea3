import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, ImageSourcePropType } from 'react-native';

export type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
  image: ImageSourcePropType;
};

export type ProductCardProps = {
  item: Product;
  isFavorite?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
};

export default function ProductCard({ item, isFavorite = false, onPress, onLongPress }: ProductCardProps) {
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={[styles.card, isFavorite && styles.cardFav]}>
      <Image source={item.image} style={styles.thumb} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.title}>{isFavorite ? '⭐ ' : ''}{item.title}</Text>
        <Text style={styles.price}>${item.price.toLocaleString('es-AR')}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#101a2e',
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1f2c49',
  },
  cardFav: {
    borderColor: '#ffd54d',
    shadowColor: '#ffd54d',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  thumb: { width: 72, height: 72, borderRadius: 10, marginRight: 12 },
  info: { flex: 1, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  price: { color: '#9ab7ff', fontSize: 14, fontWeight: '600' },
});