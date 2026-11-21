import React, {memo, useCallback, useMemo, useRef, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';

const MemoChild = memo(function MemoChild({onAdd, total}) {
  const renders = useRef(0);
  renders.current += 1;
  return <View style={styles.child}><Text style={styles.childTitle}>React.memo child</Text><Text style={styles.copy}>It has rendered {renders.current}×. It can skip an unrelated parent render because both props are stable.</Text><Pressable onPress={onAdd} style={styles.secondary}><Text style={styles.secondaryText}>Add to total ({total})</Text></Pressable></View>;
});

export default function MemoizationLabScreen({onBack}) {
  const [amount, setAmount] = useState(8);
  const [parentTick, setParentTick] = useState(0);
  const [total, setTotal] = useState(0);
  const calculations = useRef(0);

  const derived = useMemo(() => {
    calculations.current += 1;
    return Array.from({length: amount}, (_, index) => index + 1).reduce((sum, value) => sum + value, 0);
  }, [amount]);

  const addToTotal = useCallback(() => setTotal(value => value + 1), []);

  return <ScrollView contentContainerStyle={styles.screen}>
    <Pressable onPress={onBack}><Text style={styles.back}>← All practicals</Text></Pressable>
    <Text style={styles.title}>08 · Memoization tools</Text>
    <Text style={styles.intro}>Memoization preserves a value or function identity between renders. It is useful only when it avoids meaningful work.</Text>

    <View style={styles.card}>
      <Text style={styles.cardTitle}>useMemo · cache a calculated value</Text>
      <Text style={styles.copy}>Sum of 1…{amount}: <Text style={styles.highlight}>{derived}</Text></Text>
      <Text style={styles.muted}>Calculation ran {calculations.current}×. The parent tick below does not change `amount`, so this calculation is reused.</Text>
      <View style={styles.row}><Action label="−" onPress={() => setAmount(value => Math.max(1, value - 1))} /><Action label="+" onPress={() => setAmount(value => value + 1)} /></View>
    </View>

    <View style={styles.card}>
      <Text style={styles.cardTitle}>useCallback + React.memo</Text>
      <Text style={styles.copy}>`addToTotal` is created with `useCallback([])`, so its function reference stays stable. `MemoChild` uses `React.memo`.</Text>
      <Action label={`Render parent only (${parentTick})`} onPress={() => setParentTick(value => value + 1)} />
      <MemoChild onAdd={addToTotal} total={total} />
    </View>

    <View style={styles.tip}><Text style={styles.tipTitle}>What to notice</Text><Text style={styles.copy}>Press “Render parent only”: the screen updates, but the memoized child counter and useMemo calculation count do not. Press + to change `amount`, or “Add to total” to change a child prop.</Text></View>
  </ScrollView>;
}

function Action({label, onPress}) { return <Pressable onPress={onPress} style={styles.action}><Text style={styles.actionText}>{label}</Text></Pressable>; }

const styles = StyleSheet.create({
  screen:{backgroundColor:'#0b1020',flexGrow:1,padding:20,paddingBottom:36}, back:{color:'#9cafff',fontSize:15,fontWeight:'800',marginTop:8}, title:{color:'#fff',fontSize:26,fontWeight:'800',marginTop:20}, intro:{color:'#b8c1d9',fontSize:14,lineHeight:20,marginTop:7}, card:{backgroundColor:'#12192d',borderRadius:16,marginTop:16,padding:15}, cardTitle:{color:'#fff',fontSize:16,fontWeight:'800'}, copy:{color:'#c7d0e8',fontSize:13,lineHeight:19,marginTop:9}, muted:{color:'#aab5cf',fontSize:12,lineHeight:17,marginTop:8}, highlight:{color:'#65e0a3',fontWeight:'900'}, row:{flexDirection:'row',gap:10}, action:{backgroundColor:'#33467a',borderRadius:10,flex:1,marginTop:12,padding:12}, actionText:{color:'#fff',fontSize:13,fontWeight:'800',textAlign:'center'}, child:{backgroundColor:'#18223d',borderRadius:11,marginTop:13,padding:12}, childTitle:{color:'#8b9cff',fontSize:14,fontWeight:'900'}, secondary:{borderColor:'#6176ad',borderRadius:9,borderWidth:1,marginTop:11,padding:10}, secondaryText:{color:'#dce3ff',fontSize:13,fontWeight:'800',textAlign:'center'}, tip:{borderColor:'#33467a',borderRadius:14,borderWidth:1,marginTop:16,padding:14}, tipTitle:{color:'#fff',fontWeight:'900'},
});
