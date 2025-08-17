import React from 'react';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Text, ScrollView, View, Button, Input, Choice, Menu, Modal, Log } from '@/components/Themed';
import { initDatabase } from '@/database/migrations'
import { getSstore, getUniforms, getOperations, insertUniform, insertOperation, deleteUniform, deleteOperation } from '@/database/services'
import { ResetDbButton } from '@/components/resetDbButton';

export default function TabOneScreen() {
  // CONSTANTS
  const [uniforms, setUniforms] = useState<unknown | null>(null);
  const [operations, setOperations] = useState<any[] | null>(null);
  const [uniformType, setUniformType] = useState('');
  const [uniformSize, setUniformSize] = useState('');
  const [operationStore, setOperationStore] = useState('');
  const [selectedStoreName, setSelectedStoreName] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [operationType, setOperationType] = useState('');
  const [operationConcept, setOperationConcept] = useState('');
  const [operationUniform, setOperationUniform] = useState('');
  const [operationQuantity, setOperationQuantity] = useState('');
  const [operationDate, setOperationDate] = useState(new Date().toISOString().split('T')[0]);

  const [showUniformModal, setShowUniformModal] = useState(false);
  const [newUniformType, setNewUniformType] = useState('');
  const [newUniformSize, setNewUniformSize] = useState('');

  // EFFECTS
  useFocusEffect(
    React.useCallback(() => {
      const setup = async () => {
        await initDatabase();
        const fetchedUniforms = await getUniforms();
        setUniforms(fetchedUniforms);
        const fetchedOperations = await getOperations();
        setOperations(fetchedOperations);
        const sstore = await getSstore();
        if (Array.isArray(sstore) && sstore.length > 0) {
          const typedSstore = sstore as { store: number }[];
          const storeId = typedSstore[0].store;
          setSelectedStoreId(storeId);
          const stores = await import('@/database/services').then(mod => mod.getStores());
          type Store = { id: number; name: string };
          const found = Array.isArray(stores) ? (stores as Store[]).find((s: Store) => s.id === storeId) : null;
          setSelectedStoreName(found ? found.name : '');
          setOperationStore(storeId.toString());
        } else {
          setSelectedStoreName('');
          setOperationStore('');
        }
      };
      setup();
    }, [])
  );

  const addOperation = async () => {
    if (!operationType.trim() || !operationConcept.trim() || !operationUniform.trim() || !operationQuantity.trim() || !operationDate) return;
    try {
      const store = await getSstore();
      await insertOperation({
        store: parseInt(operationStore, 10),
        type: operationType.trim(),
        concept: operationConcept.trim(),
        uniform: parseInt(operationUniform.trim(), 10),
        quantity: parseInt(operationQuantity.trim(), 10),
        date: operationDate,
      });
      const updatedOperations = await getOperations();
      setOperations(updatedOperations);
      setOperationType('');
      setOperationConcept('');
      setOperationUniform('');
      setOperationQuantity('');
      setOperationDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error('Error adding operation:', error);
    }
  };

  const removeUniform = async (id: number) => {
    try {
      await deleteUniform({ id: id });
      const updatedUniforms = await getUniforms();
      setUniforms(updatedUniforms);
    } catch (error) {
      console.error('Error removing uniform:', error);
    }
  };

  // RENDERING
  if (selectedStoreId === null) {
    return(
      <View style={styles.container}>
        <Text style={styles.text}>Presione el carrito para seleccionar una tienda</Text>
      </View>
    )
  }

  if (selectedStoreId !== null) {
    if (operations === null) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Loading...</Text>
        </View>
      );
    }

    if (Array.isArray(operations) && operations.length === 0) {
      return (
        <View style={styles.container}>
          <View style={styles.subcontainer}>
            <Text style={styles.text}>Tienda</Text>
            <Input style={styles.input} placeholder="Tienda" value={selectedStoreName} editable={false} />
            <Text style={styles.text}>Operación</Text>
            <Choice value={operationType} optionA="Entrada" optionB="Salida" onChange={setOperationType} />
            <Text style={styles.text}>Concepto</Text>
            <Input style={styles.input} placeholder="Concepto" value={operationConcept} onChangeText={setOperationConcept} />
            <Text style={styles.text}>Uniforme</Text> 
            <Menu
              value={operationUniform}
              options={
                Array.isArray(uniforms)
                  ? [
                      ...uniforms.map((u: any) => ({ label: `${u.type} ${u.size}`, value: u.id.toString() })),
                      { label: '+ Agregar nuevo uniforme...', value: '__add__' }
                    ]
                  : []
              }
              onChange={val => {
                if (val === '__add__') {
                  setShowUniformModal(true);
                } else {
                  setOperationUniform(val);
                }
              }}
            />
            {/* Modal for adding a new uniform */}
            <Modal visible={showUniformModal} onRequestClose={() => setShowUniformModal(false)}>
              <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 8, minWidth: 250 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Agregar Uniforme</Text>
                <Input
                  style={{ marginBottom: 8 }}
                  placeholder="Tipo"
                  value={newUniformType}
                  onChangeText={setNewUniformType}
                />
                <Input
                  style={{ marginBottom: 16 }}
                  placeholder="Talla"
                  value={newUniformSize}
                  onChangeText={setNewUniformSize}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Button
                    title="Cancelar"
                    onPress={() => {
                      setShowUniformModal(false);
                      setNewUniformType('');
                      setNewUniformSize('');
                    }}
                    style={{ marginRight: 8 }}
                  />
                  <Button
                    title="Agregar"
                    onPress={async () => {
                      if (!newUniformType.trim() || !newUniformSize.trim()) return;
                      await insertUniform({ type: newUniformType.trim(), size: newUniformSize.trim() });
                      const updatedUniforms = await getUniforms();
                      setUniforms(updatedUniforms);
                      setShowUniformModal(false);
                      setNewUniformType('');
                      setNewUniformSize('');
                    }}
                  />
                </View>
              </View>
            </Modal>
          </View>
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        </View>
      );
    }

    if (Array.isArray(operations) && operations.length > 0) {
      return (
        <View style={styles.container}>
          <View style={styles.subcontainer}>
            <Text style={styles.text}>Tienda</Text>
            <Input
              style={styles.input}
              placeholder="Tienda"
              value={selectedStoreName}
              editable={false}
            />
          </View>
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        </View>
      );
    }
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
