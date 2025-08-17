import React from 'react';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Text, ScrollView, View, Button, Input, Log } from '@/components/Themed';
import { initDatabase } from '@/database/migrations'
import { getSstore, getUniforms, getOperations, insertUniform, insertOperation, deleteUniform, deleteOperation } from '@/database/services'

export default function TabOneScreen() {
  // CONSTANTS
  const [uniforms, setUniforms] = useState<unknown | null>(null);
  const [operations, setOperations] = useState<unknown | null>(null);
  const [uniformType, setUniformType] = useState('');
  const [uniformSize, setUniformSize] = useState('');
  const [operationStore, setOperationStore] = useState('');
  const [operationType, setOperationType] = useState('');
  const [operationConcept, setOperationConcept] = useState('');
  const [operationUniform, setOperationUniform] = useState('');
  const [operationQuantity, setOperationQuantity] = useState('');
  const [operationDate, setOperationDate] = useState(new Date().toISOString().split('T')[0]);

  // EFFECTS
  useFocusEffect(
    React.useCallback(() => {
      const setup = async () => {
        await initDatabase();
        const fetchedUniforms = await getUniforms();
        setUniforms(fetchedUniforms);
        const fetchedOperations = await getOperations();
        setOperations(fetchedOperations);
      };
      setup();
    }, [])
  );

  // FUNCTIONS
  const addUniform = async () => {
    if (!uniformType.trim() || !uniformSize.trim()) return;
    try {
      await insertUniform({ type: uniformType.trim(), size: uniformSize.trim()});
      const updatedUniforms = await getUniforms();
      setUniforms(updatedUniforms);
      setUniformType('');
      setUniformSize('');
    } catch (error) {
      console.error('Error adding uniform:', error);
    }
  };

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
