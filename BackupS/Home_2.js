/// complete ui

/// 1.05 // bas+-  play song  detect output  no bugs

// In App.js in a new project // navigation stack ///////////////////

import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Button} from 'react-native';
import {NativeModules} from 'react-native';

const {AudioPlayer} = NativeModules;

const MIN_BASS = 0;
const MAX_BASS = 1000;
const STEP = 50;

export default function BassControl() {
  const [bass, setBass] = useState(0);
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

  ///////////////////////////////////////// BASS func /////////////////////////////////////////////
  const setNativeBass = value => {
    AudioPlayer.setBassStrength(value);
  };

  const increaseBass = () => {
    setBass(prev => {
      const next = Math.min(prev + STEP, MAX_BASS);
      setNativeBass(next);
      return next;
    });
  };

  const decreaseBass = () => {
    setBass(prev => {
      const next = Math.max(prev - STEP, MIN_BASS);
      setNativeBass(next);
      return next;
    });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={decreaseBass}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.value}>{bass}</Text>
      <TouchableOpacity style={styles.button} onPress={increaseBass}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 24,
    backgroundColor: 'black',
  },
  button: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 50,
    marginHorizontal: 16,
  },
  buttonText: {color: '#fff', fontSize: 32, fontWeight: 'bold'},
  value: {
    color: '#2196f3',
    fontSize: 24,
    fontWeight: 'bold',
    minWidth: 60,
    textAlign: 'center',
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
