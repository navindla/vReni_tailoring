
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LibraryEntryScreen({ onOpenLibrary }) {
  // Animation values
  const topFade = useRef(new Animated.Value(0)).current;
  const bottomFade = useRef(new Animated.Value(0)).current;
  const middleFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence: top and bottom fade in, then middle
    Animated.sequence([
      Animated.parallel([
        Animated.timing(topFade, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(bottomFade, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(middleFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#121212" barStyle="light-content" />

      {/* Top Circle */}
      <Animated.View style={[styles.circleContainer, { opacity: topFade }]}>
        <View style={styles.circle} />
      </Animated.View>

      {/* Middle Button */}
      <Animated.View style={{ opacity: middleFade }}>
        <TouchableOpacity
          style={styles.openLibraryBtn}
          activeOpacity={0.85}
          onPress={onOpenLibrary}
        >
          <Text style={styles.btnText}>Open Library</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom Circle */}
      <Animated.View style={[styles.circleContainer, { opacity: bottomFade }]}>
        {/* <View style={styles.circle} /> */}
        <TouchableOpacity style={styles.circle}>

        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const CIRCLE_SIZE = width * 0.48;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.08,
    borderWidth:2,
   // borderColor:'#fff'
  },
  circleContainer: {
    width: '100%',
    alignItems: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 9,
    borderColor: '#00b4fc', // electrifying blue
    backgroundColor: 'transparent',
  },
  openLibraryBtn: {
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
    width: width * 0.68,
    height: 60,
    backgroundColor: '#181c24',
    borderRadius: 30, // semi-circular ends
    borderWidth: 4,
    borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 23,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textShadowColor: '#ff0033',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
    textTransform: 'uppercase',
  },
});

