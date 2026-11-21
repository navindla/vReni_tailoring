import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  NativeModules,
} from 'react-native';

const {AudioPlayer} = NativeModules;
const SCREEN_WIDTH = Dimensions.get('window').width;
const BAR_HEIGHT = 4;

export default function AudioProgressBar() {
  const [duration, setDuration] = useState(1); // Avoid division by zero
  const [position, setPosition] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Fetch duration once on mount
  useEffect(() => {
    AudioPlayer.getDuration()
      .then(setDuration)
      .catch(() => setDuration(1));
  }, []);

  // Poll current position every 200ms
  useEffect(() => {
    let isMounted = true;
    const interval = setInterval(() => {
      AudioPlayer.getCurrentPosition()
        .then(pos => {
          if (isMounted) setPosition(pos);
        })
        .catch(() => {});
    }, 200);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Animate progress bar width
  useEffect(() => {
    const progress = Math.min(position / duration, 1);
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 150,
      useNativeDriver: false, // width cannot use native driver
    }).start();
  }, [position, duration]);

  const widthInterpolated = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_WIDTH],
  });

  return (
    <View style={styles.container}>
      <View style={styles.barBackground}>
        <Animated.View style={[styles.barFill, {width: widthInterpolated}]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    marginVertical: 16,
  },
  barBackground: {
    width: '100%',
    height: BAR_HEIGHT,
    backgroundColor: '#222',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#444',
  },
  barFill: {
    height: BAR_HEIGHT,
    backgroundColor: '#00b4fc',
    borderRadius: 6,
  },
});

/////////////////////////////////////////////
