import React from 'react';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Text, ScrollView, View, Button, Input, Store } from '@/components/Themed';
import { initDatabase } from '@/database/migrations'
import { getStores, getSstore, insertStore, insertSstore, deleteStore, deleteSstore } from '@/database/services'

export default function TabOneScreen() {
  // CONSTANTS
  const [stores, setStores] = useState<unknown | null>(null);
  const [sstore, setSstore] = useState<unknown | null>(null);
  const [storeName, setStoreName] = useState('');

  // EFFECTS
  useFocusEffect(
    React.useCallback(() => {
      const setup = async () => {
        await initDatabase();
        const fetchedStores = await getStores();
        setStores(fetchedStores);
        const fetchedSstore = await getSstore();
        setSstore(fetchedSstore);
      };
      setup();
    }, [])
  );

  // FUNCTIONS
  const addStore = async () => {
    if (!storeName.trim()) return;
    try {
      await insertStore({ name: storeName.trim() });
      const updatedStores = await getStores();
      setStores(updatedStores);
      setStoreName('');
    } catch (error) {
      console.error('Error adding store:', error);
    }
  };

  const addSstore = async (id: number) => {
    try {
      if (sstore && Array.isArray(sstore) && sstore.length > 0) {
        for (const selected of sstore) {
          await deleteSstore({ id: selected.id });
        }
      }
      await insertSstore({ store: id });
      const updatedSstore = await getSstore();
      setSstore(updatedSstore);
    } catch (error) {
      console.error('Error adding sstore:', error);
    }
  };

  const removeStore = async (id: number) => {
    try {
      await deleteStore({ id: id });
      const updatedStores = await getStores();
      setStores(updatedStores);
    } catch (error) {
      console.error('Error removing store:', error);
    }
  };

  // RENDERING
  if (stores === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  if (!Array.isArray(stores) || stores.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.subcontainer}>
          <Text style={styles.text}>Nombre</Text>
          <Input style={styles.input} placeholder="Nombre de la tienda" value={storeName} onChangeText={setStoreName} />
          <Button title="AGREGAR" onPress={addStore} />
        </View>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      </View>
    );
  }

  if (Array.isArray(stores) && stores.length > 0) {
    return (
      <ScrollView style={styles.scrollcontainer} contentContainerStyle={styles.contentContainer}>
        <View style={styles.subcontainer}>
          <Text style={styles.text}>Nombre</Text>
          <Input style={styles.input} placeholder="Nombre de la tienda" value={storeName} onChangeText={setStoreName} />
          <Button title="AGREGAR" onPress={addStore} />
        </View>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <View style={styles.subcontainer}>
          {Array.isArray(stores) && stores.map((store: any) => (
            <Store
              key={store.id}
              name={store.name}
              onPress={() => addSstore(store.id)}
              onLongPress={() => removeStore(store.id)}
              style={
                sstore && Array.isArray(sstore) && sstore.some((sel: any) => sel.store === store.id)
                  ? { borderColor: '#3fcc7f', borderWidth: 2 }
                  : undefined
              }
            />
          ))}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 16,
  },
  scrollcontainer: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 16,
  },
  subcontainer: {
    width: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  text: {
    textAlign: 'left',
    width: '80%',
    marginBottom: 4,
  },
  input: {
    marginBottom: 12,
  },
});
