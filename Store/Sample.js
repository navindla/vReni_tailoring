



import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Scr_1() {
  const [username, setUsername] = useState('');
  const [storedUsername, setStoredUsername] = useState('');

  const saveUsername = async () => {
    try {
      await AsyncStorage.setItem('USERNAME_KEY', username);
      alert('Username saved!');
      setUsername('');
    } catch (e) {
      console.error('Failed to save username:', e);
    }
  };

  const loadUsername = async () => {
    try {
      const value = await AsyncStorage.getItem('USERNAME_KEY');
      if (value !== null) {
        setStoredUsername(value);
      }
    } catch (e) {
      console.error('Failed to load username:', e);
    }
  };

  useEffect(() => {
    loadUsername();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stored Username: {storedUsername}</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your username"
        style={styles.input}
      />
      <Button title="Save Username" onPress={saveUsername} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 10,
  },
});
