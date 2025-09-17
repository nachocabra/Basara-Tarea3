import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Image, TextInput, Pressable, Modal, StyleSheet } from 'react-native';


const products = [
  {
    id: '1',
    title: 'Zapatillas Runner',
    price: 59999,
    description: 'Zapatillas livianas para entrenar todos los días. Suela con buena tracción.',
    // Imagen local (asegurate de tener esta ruta):
    image: { uri: 'https://images.unsplash.com/photo-1518449073234-4f6a97a66c0f' },
    isLocal: true,
  },
  {
    id: '2',
    title: 'Auriculares BT',
    price: 32999,
    description: 'Auriculares Bluetooth con cancelación pasiva y 20h de batería.',
    // Imagen por URI (remota):
    image: { uri: 'https://images.unsplash.com/photo-1518449073234-4f6a97a66c0f' },
  },
  {
    id: '3',
    title: 'Mochila Urbana',
    price: 27999,
    description: 'Mochila resistente al agua con compartimento para notebook 15.6".',
    image: { uri: 'https://images.unsplash.com/photo-1520975922203-bc1e7298a8b0' },
  },
  {
    id: '4',
    title: 'Remera DryFit',
    price: 14999,
    description: 'Tela respirable y liviana para entrenamientos intensos.',
    image: { uri: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab' },
  },
];

export default function Galeria() {
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState(new Set()); // guarda ids
  const [selected, setSelected] = useState(null); // producto seleccionado para el modal
  const [resizeMode, setResizeMode] = useState('cover'); // cover | contain | stretch

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(p => p.title.toLowerCase().includes(q));
  }, [query]);

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const renderItem = ({ item }) => {
    const fav = favorites.has(item.id);
    return (
      <Pressable
        onPress={() => setSelected(item)}
        onLongPress={() => toggleFavorite(item.id)}
        style={[styles.card, fav && styles.cardFav]}
      >
        <Image source={item.image} style={styles.thumb} resizeMode="cover" />
        <View style={styles.info}>
          <Text style={styles.title}>
            {fav ? '⭐ ' : ''}{item.title}
          </Text>
          <Text style={styles.price}>${item.price.toLocaleString('es-AR')}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Galería</Text>

      <TextInput
        placeholder="Filtrar por título..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      {/* Modal de detalle */}
      <Modal
        visible={!!selected}
        transparent
        animationType="slide"
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {selected && (
              <>
                <Image
                  source={selected.image}
                  style={styles.bigImage}
                  resizeMode={resizeMode}
                />
                <Text style={styles.modalTitle}>{selected.title}</Text>
                <Text style={styles.modalPrice}>${selected.price.toLocaleString('es-AR')}</Text>
                <Text style={styles.modalDesc}>{selected.description}</Text>

                <View style={styles.resizeRow}>
                  {['cover', 'contain', 'stretch'].map(mode => (
                    <Pressable
                      key={mode}
                      style={[styles.modeBtn, resizeMode === mode && styles.modeBtnActive]}
                      onPress={() => setResizeMode(mode)}
                    >
                      <Text style={styles.modeText}>{mode}</Text>
                    </Pressable>
                  ))}
                </View>

                <View style={styles.actionsRow}>
                  <Pressable style={styles.primaryBtn} onPress={() => setSelected(null)}>
                    <Text style={styles.primaryBtnText}>Cerrar</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.secondaryBtn]}
                    onPress={() => {
                      toggleFavorite(selected.id);
                    }}
                  >
                    <Text style={styles.secondaryBtnText}>
                      {favorites.has(selected?.id) ? 'Quitar favorito' : 'Marcar favorito'}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1220' },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  input: {
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#16233b',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#203254',
  },
  listContent: { padding: 16, paddingBottom: 40 },
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

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#0f1a2d',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#203254',
  },
  bigImage: { width: '100%', height: 240, borderRadius: 12, backgroundColor: '#0a1222' },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 12 },
  modalPrice: { color: '#9ab7ff', fontSize: 16, fontWeight: '700', marginTop: 4 },
  modalDesc: { color: '#c8d5ff', marginTop: 8, lineHeight: 20 },

  resizeRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  modeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a3c64',
    backgroundColor: '#12203a',
  },
  modeBtnActive: {
    borderColor: '#7aa2ff',
    backgroundColor: '#1a2b4c',
  },
  modeText: { color: '#d7e3ff', fontWeight: '700' },

  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 14, justifyContent: 'flex-end' },
  primaryBtn: { backgroundColor: '#3b6cff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
  secondaryBtn: { backgroundColor: '#0f1a2d', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#2a3c64' },
  secondaryBtnText: { color: '#c8d5ff', fontWeight: '700' },
});
