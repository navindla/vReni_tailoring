// 


////////////// v2.0



import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons2 from 'react-native-vector-icons/SimpleLineIcons';
import MatIcon from 'react-native-vector-icons/Ionicons';

export default function TripleButton({
  onMinus,
  onLibrary,
  onPlus,
  width = 270, // default width, can be customized
}) {
  return (
    <View style={[styles.container, { width }]}>
      {/* Minus Button */}
      <TouchableOpacity style={styles.button} onPress={onMinus} activeOpacity={0.7}>
        <MaterialCommunityIcons2 name="minus" size={28} color="red" />
        <Text style={styles.label}>Bass</Text>
      </TouchableOpacity>
      {/* Library Button */}
      <TouchableOpacity style={styles.button} onPress={onLibrary} activeOpacity={0.7}>
        <MatIcon name="library-sharp" size={28} color="skyblue" />
        <Text style={[styles.label, styles.libraryLabel]}>Open Library</Text>
      </TouchableOpacity>
      {/* Plus Button */}
      <TouchableOpacity style={styles.button} onPress={onPlus} activeOpacity={0.7}>
        <MaterialCommunityIcons2 name="plus" size={28} color="red" />
        <Text style={styles.label}>Bass</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80, // Increased to fit icon + label
    flexDirection: 'row',
    borderRadius: 18,
    borderWidth: 4,
    borderColor: 'red',
    backgroundColor: '#181818',
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 2,
    fontSize: 9,
    color: 'gray',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  libraryLabel: {
    color: 'yellow',
  //  fontWeight: 'bold',
    fontSize: 9.6,
  },
});
