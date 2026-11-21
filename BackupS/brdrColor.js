

import React from 'react';
import { Dimensions, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor 
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function AnimatedCard() {
  const [isOn, setIsOn] = React.useState(false);
  const borderAnim = useSharedValue(0);

  // Animate border color based on isOn state
  React.useEffect(() => {
    borderAnim.value = withTiming(isOn ? 1 : 0, { duration: 1400 });
  }, [isOn]);

  // Animated style for border color
  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      borderAnim.value,
      [0, 1],
      ['#000', '#0018A8'] // black to blue #6F00FF #0018A8
    ),
  }));

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => setIsOn(prev => !prev)}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>{isOn ? 'off' : 'on'}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width,
    height,
    backgroundColor: '#000',
    borderWidth: 8,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    backgroundColor: '#222',
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
