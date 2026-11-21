import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import LearningHub from './features/learning/LearningHub';

// Purpose: the composition root keeps global setup small and makes features portable.
export default function App() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <LearningHub />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({screen: {flex: 1, backgroundColor: '#0b1020'}});
