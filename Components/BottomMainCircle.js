import React, {useRef, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Animated, Dimensions} from 'react-native';
import LottieView from 'lottie-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// You can move these to a shared styles file if you wish
const {width} = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.48;
const MEDIUM_CIRCLE = CIRCLE_SIZE * 0.6;

const styles = {
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediumCircle: {
    backgroundColor: '#23272e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#444',
  },
  demandText: {
    color: 'gray',
    fontSize: 13.5,
    fontWeight: '400',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
};

export default function BottomCircleStatus({demand, bassStrength}) {
  //const [demand, setDemand] = useState(0);

  // Animation for fade in
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Blinking animation for paused icon
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (demand === 2) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      blinkAnim.setValue(1);
    }
  }, [demand]);

  // Demo: cycle through states every 2 seconds (remove in production)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setDemand(prev => (prev + 1) % 6);
  //   }, 2000);
  //   return () => clearInterval(interval);
  // }, []);

  const renderDemandContent = () => {
    switch (demand) {
      case 0:
        return (
          <LottieView
            source={require('../LottieFiles/loti3.json')}
            autoPlay
            loop
            style={{width: 60, height: 60}}
          />
        );
      case 1:
        return <Text style={styles.demandText}>Bass {bassStrength}</Text>;
      case 2:
        return (
          <Animated.View style={{opacity: blinkAnim}}>
            <Ionicons name="pause-circle" size={48} color="#bbb" />
          </Animated.View>
        );
      case 3:
        return (
          <View style={styles.rowCenter}>
            <Text style={styles.demandText}>Connected to </Text>
            <Ionicons name="ear" size={32} color="#bbb" />
          </View>
        );
      case 4:
        return (
          <View style={styles.rowCenter}>
            <Text style={styles.demandText}>Connected to </Text>
            <Ionicons name="volume-high" size={32} color="#bbb" />
          </View>
        );
      case 5:
        return (
          <View style={styles.rowCenter}>
            <Text style={styles.demandText}>Connected to </Text>
            <Ionicons name="bluetooth" size={32} color="#bbb" />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Animated.View style={[styles.circleContainer, {opacity: fadeAnim}]}>
      <TouchableOpacity
        onPress={() => console.log('pressed main BCircle')}
        style={styles.circle}
        activeOpacity={1}>
        <View
          style={[
            styles.mediumCircle,
            {
              width: MEDIUM_CIRCLE,
              height: MEDIUM_CIRCLE,
              borderRadius: MEDIUM_CIRCLE / 2,
            },
          ]}>
          {renderDemandContent()}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
