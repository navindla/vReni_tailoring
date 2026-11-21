
////// v1.0 home screen music app




import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, NativeModules } from 'react-native';

const { AudioPlayer } = NativeModules;

export default function App() {
  const [outputDevice, setOutputDevice] = useState('Unknown');

  // ✅ Detects output and plays MP3 with deep bass if supported
  const handlePlayWithBass = async () => {
    try {
      const device = await AudioPlayer.getAudioOutputDevice();
      setOutputDevice(device); // update the UI
      AudioPlayer.playAudio(); // bass is applied natively based on device
    } catch (error) {
      console.error('Error during playback:', error);
    }
  };

  // Optional: Just detect output
  const detectOnly = async () => {
    try {
      const device = await AudioPlayer.getAudioOutputDevice();
      setOutputDevice(device);
    } catch (error) {
      console.error('Detection error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎧 DeepBass Audio Player</Text>

      <View style={styles.buttonContainer}>
        <Button title="🔊 Play with Smart Bass" onPress={handlePlayWithBass} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="🎚 Detect Output Device" onPress={detectOnly} />
      </View>

      <Text style={styles.outputText}>Current Output: {outputDevice}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#121212',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 40,
    color: '#ffffff',
  },
  buttonContainer: {
    marginVertical: 12,
    width: '100%',
  },
  outputText: {
    fontSize: 18,
    marginTop: 30,
    color: '#00ffcc',
  },
});
