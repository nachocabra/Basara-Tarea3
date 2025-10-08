import React from 'react';
import { Modal, View, Text, Image, Pressable, StyleSheet, ImageSourcePropType } from 'react-native';

type ResizeMode = 'cover' | 'contain' | 'stretch';

type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
  image: ImageSourcePropType;
};

type Props = {
  visible: boolean;
  product: Product | null;
  resizeMode: ResizeMode;
  onChangeResizeMode: (mode: ResizeMode) => void;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

const MODES: ResizeMode[] = ['cover', 'contain', 'stretch'];

export default function ProductModal({
  visible,
  product,
  resizeMode,
  onChangeResizeMode,
  onClose,
  isFavorite,
  onToggleFavorite,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {product && (
            <>
              <Image source={product.image} style={styles.bigImage} resizeMode={resizeMode} />

              <Text style={styles.title}>{product.title}</Text>
              <Text style={styles.price}>${product.price.toLocaleString('es-AR')}</Text>
              <Text style={styles.desc}>{product.description}</Text>

              <View style={styles.row}>
                {MODES.map((mode) => (
                  <Pressable
                    key={mode}
                    style={[styles.modeBtn, resizeMode === mode && styles.modeBtnActive]}
                    onPress={() => onChangeResizeMode(mode)}
                  >
                    <Text style={styles.modeText}>{mode}</Text>
                  </Pressable>
                ))}
              </View>

              <View style={styles.actions}>
                <Pressable style={styles.primaryBtn} onPress={onClose}>
                  <Text style={styles.primaryBtnText}>Cerrar</Text>
                </Pressable>

                <Pressable style={styles.secondaryBtn} onPress={onToggleFavorite}>
                  <Text style={styles.secondaryBtnText}>
                    {isFavorite ? 'Quitar favorito' : 'Marcar favorito'}
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#0f1a2d',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#203254',
  },
  bigImage: { width: '100%', height: 240, borderRadius: 12, backgroundColor: '#0a1222' },
  title: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 12 },
  price: { color: '#9ab7ff', fontSize: 16, fontWeight: '700', marginTop: 4 },
  desc: { color: '#c8d5ff', marginTop: 8, lineHeight: 20 },
  row: { flexDirection: 'row', gap: 8, marginTop: 12 },
  modeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a3c64',
    backgroundColor: '#12203a',
  },
  modeBtnActive: { borderColor: '#7aa2ff', backgroundColor: '#1a2b4c' },
  modeText: { color: '#d7e3ff', fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14, justifyContent: 'flex-end' },
  primaryBtn: {
    backgroundColor: '#3b6cff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
  secondaryBtn: {
    backgroundColor: '#0f1a2d',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a3c64',
  },
  secondaryBtnText: { color: '#c8d5ff', fontWeight: '700' },
});
