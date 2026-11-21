import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Purpose: make JS-thread contention observable. Never use a busy loop in production.
function blockJavaScriptFor(milliseconds) {
  const deadline = Date.now() + milliseconds;
  let value = 0;
  while (Date.now() < deadline) { value = Math.sqrt(value + 1); }
  return value;
}

export default function ThreadHermesScreen({onBack}) {
  const spin = useRef(new Animated.Value(0)).current;
  const pendingWork = useRef(null);
  const [tapCount, setTapCount] = useState(0);
  const [status, setStatus] = useState('Ready');

  // Purpose: Hermes is the JS engine. This safely reports which engine the release uses.
  const engine = useMemo(() => global.HermesInternal ? 'Hermes is active' : 'Hermes is not detected', []);

  useEffect(() => {
    // Purpose: useNativeDriver runs this supported transform on the native/UI side,
    // so it is not scheduled by the JavaScript thread every frame.
    const animation = Animated.loop(Animated.timing(spin, {
      toValue: 1,
      duration: 1600,
      easing: Easing.linear,
      useNativeDriver: true,
    }));
    animation.start();
    return () => { animation.stop(); clearTimeout(pendingWork.current); };
  }, [spin]);

  const rotation = spin.interpolate({inputRange: [0, 1], outputRange: ['0deg', '360deg']});
  const blockThread = () => {
    setStatus('JS is busy for ~800 ms…');
    // Let React paint the status before intentionally occupying its thread.
    pendingWork.current = setTimeout(() => {
      blockJavaScriptFor(800);
      setStatus('JS is responsive again. Compare the animation with the delayed tap.');
    }, 40);
  };

  return <SafeAreaView style={styles.screen}>
    <View style={styles.header}><Pressable onPress={onBack} hitSlop={10}><Text style={styles.back}>‹ Back</Text></Pressable><Text style={styles.badge}>{engine}</Text></View>
    <Text style={styles.title}>Threads + Hermes lab</Text>
    <Text style={styles.intro}>Tap the stress button, then tap the counter. The counter waits for JavaScript; the spinner is native-driven.</Text>
    <View style={styles.visualArea}><Animated.View style={[styles.spinner, {transform: [{rotate: rotation}]}]}><View style={styles.dot} /><View style={styles.center} /></Animated.View></View>
    <Text style={styles.status}>{status}</Text>
    <Pressable onPress={blockThread} style={styles.stressButton}><Text style={styles.stressText}>Busy the JS thread for 800 ms</Text></Pressable>
    <Pressable onPress={() => setTapCount(value => value + 1)} style={styles.counterButton}><Text style={styles.counterText}>JS press handler: {tapCount}</Text></Pressable>
    <View style={styles.notes}>
      <Text style={styles.notesTitle}>What this demonstrates</Text>
      <Text style={styles.note}>• JS thread: React state, this press handler, timers, and business logic.</Text>
      <Text style={styles.note}>• UI thread: platform drawing and native-driven animation work.</Text>
      <Text style={styles.note}>• Hermes: the JavaScript engine; it improves runtime/startup characteristics but cannot make blocking JS work free.</Text>
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  screen:{backgroundColor:'#0b1020',flex:1,paddingHorizontal:20},header:{alignItems:'center',flexDirection:'row',justifyContent:'space-between',marginTop:8},back:{color:'#9cafff',fontSize:15,fontWeight:'800'},badge:{color:'#aab5cf',fontSize:11},title:{color:'#fff',fontSize:27,fontWeight:'800',marginTop:18},intro:{color:'#b8c1d9',fontSize:14,lineHeight:20,marginTop:6},visualArea:{alignItems:'center',height:180,justifyContent:'center'},spinner:{alignItems:'flex-start',backgroundColor:'#27335a',borderRadius:56,height:112,justifyContent:'center',paddingLeft:12,width:112},dot:{backgroundColor:'#bfcaff',borderRadius:8,height:16,width:16},center:{backgroundColor:'#0b1020',borderRadius:18,height:36,left:38,position:'absolute',top:38,width:36},status:{color:'#cdd7ff',fontSize:13,lineHeight:19,minHeight:42,textAlign:'center'},stressButton:{backgroundColor:'#7d5cff',borderRadius:12,marginTop:12,padding:15},stressText:{color:'#fff',fontWeight:'800',textAlign:'center'},counterButton:{borderColor:'#405080',borderRadius:12,borderWidth:1,marginTop:10,padding:15},counterText:{color:'#dce3ff',fontWeight:'700',textAlign:'center'},notes:{backgroundColor:'#12192d',borderRadius:14,marginTop:20,padding:15},notesTitle:{color:'#fff',fontSize:15,fontWeight:'800',marginBottom:7},note:{color:'#b8c1d9',fontSize:12,lineHeight:19},
});
