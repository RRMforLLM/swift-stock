import React from 'react';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Text, ScrollView, View, Button, Input, Log } from '@/components/Themed';
import { initDatabase } from '@/database/migrations'
import { getTodos, getDones, insertTodo, insertDone, deleteTodo } from '@/database/services'

export default function TabOneScreen() {
  // CONSTANTS
  const [todos, setTodos] = useState<unknown[] | null>(null);
  const [dones, setDones] = useState<unknown[] | null>(null);
  const [todoSubject, setTodoSubject] = useState('');
  const [todoDetails, setTodoDetails] = useState('');
  const [todoDeadline, setTodoDeadline] = useState(new Date().toISOString().split('T')[0]);

  // EFFECTS
  useFocusEffect(
    React.useCallback(() => {
      const setup = async () => {
        await initDatabase();
        const fetchedTodos = await getTodos();
        setTodos(fetchedTodos);
        const fetchedDones = await getDones();
        setDones(fetchedDones);
      };
      setup();
    }, [])
  );

  // FUNCTIONS
  const addTodo = async () => {
    if (!todoSubject.trim() || !todoDetails.trim() || !todoDeadline.trim()) return;
    try {
      await insertTodo({
        subject: todoSubject.trim(),
        details: todoDetails.trim(),
        deadline: todoDeadline.trim()
      });
      const updatedTodos = await getTodos();
      setTodos(updatedTodos);
      setTodoSubject('');
      setTodoDetails('');
      setTodoDeadline(new Date().toISOString().split('T')[0]);
    } catch(error) {
      console.error('Error adding todo:', error);
    }
  };

  const doTodo = async (id: number) => {
    try {
      await insertDone({ todo: id });
      const updatedTodos = await getTodos();
      setTodos(updatedTodos);
      const updatedDones = await getDones();
      setDones(updatedDones);
    } catch(error) {
      console.error('Error doing todo:', error);
    }
  };

  const removeTodo = async (id: number) => {
    try {
      await deleteTodo({ id: id });
      const updatedTodos = await getTodos();
      setTodos(updatedTodos);
    } catch(error) {
      console.error('Error deleting todo:', error);
    }
  };

  // RENDERING
  if (todos === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  if (todos.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.subcontainer}>
          <Text style={styles.text}>Subject</Text>
          <Input style={styles.input} placeholder="Todo subject" value={todoSubject} onChangeText={setTodoSubject} />
          <Text style={styles.text}>Details</Text>
          <Input style={styles.input} placeholder="Todo details" value={todoDetails} onChangeText={setTodoDetails} />
          <Text style={styles.text}>Deadline</Text>
          <Input style={styles.input} placeholder="Todo deadline" value={todoDeadline} onChangeText={setTodoDeadline} />
          <Button title="ADD" onPress={addTodo} />
        </View>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      </View>
    );
  }

  if (todos.length > 0) {
    return (
      <ScrollView style={styles.scrollcontainer} contentContainerStyle={styles.contentContainer}>
        <View style={styles.subcontainer}>
          <Text style={styles.text}>Subject</Text>
          <Input style={styles.input} placeholder="Todo subject" value={todoSubject} onChangeText={setTodoSubject} />
          <Text style={styles.text}>Details</Text>
          <Input style={styles.input} placeholder="Todo details" value={todoDetails} onChangeText={setTodoDetails} />
          <Text style={styles.text}>Deadline</Text>
          <Input style={styles.input} placeholder="Todo deadline" value={todoDeadline} onChangeText={setTodoDeadline} />
          <Button title="ADD" onPress={addTodo} />
        </View>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <View style={styles.subcontainer}>
          {(() => {
            const doneIds = new Set((dones || []).map((done: any) => done.todo.id));
            return (todos || [])
              .filter((todo: any) => !doneIds.has(todo.id))
              .sort((a: any, b: any) => {
                if (!a.deadline) return 1;
                if (!b.deadline) return -1;
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
              })
              .map((todo: any) => (
                <Todo
                  key={todo.id}
                  subject={todo.subject}
                  details={todo.details}
                  deadline={todo.deadline}
                  onPress={() => doTodo(todo.id)}
                  onLongPress={() => removeTodo(todo.id)}
                />
              ));
          })()}
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
