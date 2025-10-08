import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  ImageSourcePropType,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import ProductCard from '../../components/ProductCard';
import ProductModal from '../../components/ProductModal';

// =========================
// URL base del backend (Base URL)
// =========================
const BASE_URL = 'http://192.168.1.205:3001'; // <— tu IP local + puerto

// Tipo que usa tu <ProductCard />
type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
  image: ImageSourcePropType; // en RN las imágenes remotas son { uri: string }
};

// Tipo que llega desde el backend (API)
type ProductoAPI = {
  id: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string; // campo tal como viene del back
};

// =========================
// API inline (GET y POST)
// =========================
async function listProducts(): Promise<ProductoAPI[]> {
  const r = await fetch(`${BASE_URL}/products`);
  if (!r.ok) throw new Error(`GET /products -> ${r.status}`);
  return r.json();
}

async function createProduct(body: Omit<ProductoAPI, 'id'>): Promise<ProductoAPI> {
  const r = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`POST /products -> ${r.status}`);
  return r.json();
}

export default function App() {
  // estado de UI
  const [query, setQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Product | null>(null);
  const [resizeMode, setResizeMode] = useState<'cover' | 'contain' | 'stretch'>('cover');

  // estado de datos y red
  const [items, setItems] = useState<ProductoAPI[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorRed, setErrorRed] = useState<string | null>(null);

  // ===== Modal "Nuevo producto" =====
  const [showNew, setShowNew] = useState(false);
  const [titleNew, setTitleNew] = useState('');
  const [priceNew, setPriceNew] = useState('');
  const [descNew, setDescNew] = useState('');
  const [imgNew, setImgNew] = useState('');
  const [saving, setSaving] = useState(false);
  const [errForm, setErrForm] = useState<string | null>(null);

  // Traer productos desde el backend
  const load = async () => {
    try {
      setCargando(true);
      setErrorRed(null);
      const data = await listProducts();
      setItems(data);
    } catch (e: any) {
      console.log('Error fetch:', e?.message || String(e));
      setErrorRed('No pude traer productos. Revisá URL/IP/puerto/firewall.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Adaptar los datos del back al tipo que consume ProductCard
  const productosAdaptados: Product[] = useMemo(() => {
    return items.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      description: p.description,
      image: { uri: p.imageUrl }, // adaptar imageUrl -> { uri }
    }));
  }, [items]);

  // Filtro por título
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return productosAdaptados;
    return productosAdaptados.filter((p) => p.title.toLowerCase().includes(q));
  }, [query, productosAdaptados]);

  // Favoritos (press/longPress)
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Guardar nuevo (POST)
  const handleSaveNew = async () => {
    const priceNum = Number(priceNew);
    if (!titleNew || !descNew || !imgNew || Number.isNaN(priceNum)) {
      setErrForm('Completá todos los campos. El precio debe ser número.');
      return;
    }
    try {
      setSaving(true);
      setErrForm(null);
      const creado = await createProduct({
        title: titleNew,
        price: priceNum,
        description: descNew,
        imageUrl: imgNew, // usá HTTPS para iOS
      });

      // Opción A: refrescar desde el backend
      // await load();

      // Opción B: insertar arriba sin pedir de nuevo
      setItems((prev) => [creado, ...prev]);

      setShowNew(false);
      setTitleNew('');
      setPriceNew('');
      setDescNew('');
      setImgNew('');
    } catch (e: any) {
      setErrForm(e?.message || 'Error creando el producto');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Galería</Text>

      {/* Mensajes de red / debug rápido */}
      {cargando && (
        <Text style={{ color: '#fff', paddingHorizontal: 16 }}>
          Cargando productos...
        </Text>
      )}
      {errorRed && (
        <Text style={{ color: '#f66', paddingHorizontal: 16 }}>{errorRed}</Text>
      )}
      <Text style={{ color: '#9cf', paddingHorizontal: 16 }}>
        Items: {items.length}
      </Text>

      {/* Buscador */}
      <TextInput
        placeholder="Filtrar por título..."
        placeholderTextColor="#8aa0c7"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />

      {/* Lista */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            isFavorite={favorites.has(item.id)}
            onPress={() => setSelected(item)}
            onLongPress={() => toggleFavorite(item.id)}
          />
        )}
      />

      {/* Modal de producto */}
      <ProductModal
        visible={!!selected}
        product={selected}
        resizeMode={resizeMode}
        onChangeResizeMode={setResizeMode}
        isFavorite={selected ? favorites.has(selected.id) : false}
        onToggleFavorite={() => selected && toggleFavorite(selected.id)}
        onClose={() => setSelected(null)}
      />

      {/* Modal NUEVO producto */}
      <Modal transparent visible={showNew} animationType="slide" onRequestClose={() => setShowNew(false)}>
        <View style={S.backdrop}>
          <View style={S.card}>
            <Text style={S.title}>Nuevo producto</Text>
            {!!errForm && <Text style={S.err}>{errForm}</Text>}

            <TextInput style={S.input} placeholder="Título" placeholderTextColor="#8aa0c7"
              value={titleNew} onChangeText={setTitleNew} />
            <TextInput style={S.input} placeholder="Precio (número)" placeholderTextColor="#8aa0c7"
              value={priceNew} onChangeText={setPriceNew} keyboardType="numeric" />
            <TextInput style={[S.input,{height:80}]} placeholder="Descripción" placeholderTextColor="#8aa0c7"
              value={descNew} onChangeText={setDescNew} multiline />
            <TextInput style={S.input} placeholder="URL de imagen (https)" placeholderTextColor="#8aa0c7"
              value={imgNew} onChangeText={setImgNew} />

            <View style={S.row}>
              <TouchableOpacity style={[S.btn, S.cancel]} disabled={saving} onPress={() => setShowNew(false)}>
                <Text style={S.btnTx}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[S.btn, S.save]} disabled={saving} onPress={handleSaveNew}>
                {saving ? <ActivityIndicator/> : <Text style={S.btnTx}>Guardar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Botón flotante (＋) */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowNew(true)}>
        <Text style={styles.fabTxt}>＋</Text>
      </TouchableOpacity>
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
  listContent: { padding: 16, paddingBottom: 90 },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: '#2563eb',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  fabTxt: { color: '#fff', fontSize: 28, lineHeight: 28, fontWeight: '800' },
});

const S = StyleSheet.create({
  backdrop:{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',padding:16},
  card:{backgroundColor:'#0b1220',borderRadius:16,padding:16,borderWidth:1,borderColor:'#203254'},
  title:{color:'#fff',fontSize:18,fontWeight:'700',marginBottom:8},
  input:{
    borderWidth:1,borderColor:'#203254',borderRadius:12,
    paddingHorizontal:12,paddingVertical:10,color:'#fff',marginBottom:10,backgroundColor:'#16233b',
  },
  row:{flexDirection:'row',gap:12,justifyContent:'flex-end',marginTop:4},
  btn:{paddingHorizontal:16,paddingVertical:10,borderRadius:12},
  cancel:{backgroundColor:'#2b344a'}, 
  save:{backgroundColor:'#2563eb'},
  btnTx:{color:'#fff',fontWeight:'700'},
  err:{color:'#ff6b6b',marginBottom:8},
});

