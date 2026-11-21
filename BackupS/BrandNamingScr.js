/////////////// staring scr ////////////////////

import React from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';

const {height, width} = Dimensions.get('window');

const specs = [
  '• High-pass filter at 3.2kHz',
  '• Custom Bass Boost Technology',
  '• Soft clipping (tanh) to generate rich harmonic excitation',
  '• AI-Powered Sound Enhancement',
  '• Deep bass ranges 0 to 1000',
  '• C++ (NDK): real time Harmonic Enhancement DSP logic',
];

export default function StartingScreen() {
  const [isOn, setIsOn] = React.useState(true);
  const borderAnim = useSharedValue(0);

  // Animate border color based on isOn state
  React.useEffect(() => {
    borderAnim.value = withTiming(isOn ? 1 : 0, {duration: 2000});
  }, [isOn]);

  // Animated style for border color
  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      borderAnim.value,
      [0, 1],
      ['#000', '#0018A8'], // black to blue #6F00FF #0018A8
    ),
  }));

  return (
    <View style={[{flex: 1, padding: 14, backgroundColor: 'black'}]}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <StatusBar backgroundColor="#121212" barStyle="light-content" />
        {/* Brand Name & Caption */}
        <View style={styles.brandContainer}>
          <Text style={styles.brandName}>
            Harmovengine
            <Text style={styles.trademark}>™</Text>
          </Text>
          <Text style={styles.caption}>
            crafted for clarity, tuned for depth
          </Text>
        </View>

        {/* Background Image with Specs */}
        <ImageBackground
          source={require('./Imgs/mainBg01.jpg')} // Replace with your image path
          style={styles.imageBackground}
          resizeMode="cover">
          <View style={styles.specsContainer}>
            {specs.map((spec, index) => (
              <Text key={index} style={styles.specText}>
                {spec}
              </Text>
            ))}
          </View>
        </ImageBackground>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading sound engine...</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // dark background
    paddingTop: 60,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    borderWidth: 2,
    // borderColor: 'red',
    borderRadius: 12,
  },
  brandContainer: {
    alignItems: 'center',
  },
  brandName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#1DB954', // bright green accent
  },

  trademark: {
    fontSize: 33,
    fontWeight: '900',
    color: '#1DB954',
    marginBottom: 38,
  },

  caption: {
    marginTop: 2,
    fontSize: 13.5,
    fontWeight: '500',
    color: '#ccc',
    fontStyle: 'italic',
  },
  imageBackground: {
    height: height * 0.64,
    // width: width - 48, // padding horizontal * 2
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.6)', // fallback dark overlay
  },
  specsContainer: {
    height: 400,
    backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent black
    padding: 20,
    borderRadius: 16,
    paddingVertical: 44,
  },
  specText: {
    color: '#fff',
    fontSize: 14.5,
    marginBottom: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  loadingText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '400',
  },
});
