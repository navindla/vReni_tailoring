



import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const PROGRESS_BAR_WIDTH = Dimensions.get('window').width * 0.55; // 80% of screen width
const PROGRESS_BAR_HEIGHT = 7; // px
const ANIMATION_DURATION = 5000; // ms

export default function AnimatedProgressBar() {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate from 0 to 1 in 1.5 seconds
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      useNativeDriver: false, // width can't use native driver
    }).start();
  }, []);

  const widthInterpolated = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, PROGRESS_BAR_WIDTH],
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressBarBackground}>
        <Animated.View
          style={[
            styles.progressBarFill,
            { width: widthInterpolated }
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 4,
  },
  progressBarBackground: {
    width: PROGRESS_BAR_WIDTH,
    height: PROGRESS_BAR_HEIGHT,
    backgroundColor: '#222',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#444',
  },
  progressBarFill: {
    height: PROGRESS_BAR_HEIGHT,
    backgroundColor: '#1DB954',
    borderRadius: 8,
  },
});
