import React, {createContext, useContext, useRef, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';

const AccentContext = createContext('#8b9cff');

function RenderBadge({label, detail}) {
  const renders = useRef(0);
  renders.current += 1;
  return <View style={styles.badge}><Text style={styles.badgeTitle}>{label}</Text><Text style={styles.badgeDetail}>{detail}</Text><Text style={styles.badgeCount}>Rendered {renders.current}×</Text></View>;
}

function ContextConsumer() {
  const accent = useContext(AccentContext);
  return <View style={[styles.contextPreview, {borderColor: accent}]}><Text style={[styles.contextText, {color: accent}]}>Context accent: {accent}</Text><RenderBadge label="Context consumer" detail="It re-renders when the provider value changes." /></View>;
}

function PropReceiver({profile}) {
  return <View style={styles.nested}><Text style={styles.value}>name prop: {profile.name}</Text><RenderBadge label="Prop receiver" detail="A new object reference is a changed prop." /></View>;
}

export default function RenderingTriggersScreen({onBack}) {
  const [count, setCount] = useState(0);
  const [parentTick, setParentTick] = useState(0);
  const [accent, setAccent] = useState('#8b9cff');
  const [name, setName] = useState('Ada');
  const profile = {name};

  return <ScrollView contentContainerStyle={styles.screen}>
    <Pressable onPress={onBack}><Text style={styles.back}>← All practicals</Text></Pressable>
    <Text style={styles.title}>07 · Why components re-render</Text>
    <Text style={styles.intro}>Tap each trigger and watch the render counters change. Rendering calculates React output; it does not always mean native views change.</Text>

    <LessonCard title="1. Own state changes">
      <Text style={styles.value}>Local count: {count}</Text>
      <Action label="Update this component’s state" onPress={() => setCount(value => value + 1)} />
      <RenderBadge label="State owner" detail="setCount schedules this component to render." />
    </LessonCard>

    <LessonCard title="2. Parent renders">
      <Text style={styles.value}>Parent tick: {parentTick}</Text>
      <Action label="Render the parent" onPress={() => setParentTick(value => value + 1)} />
      <RenderBadge label="Regular child" detail="A normal child is evaluated again when its parent renders." />
    </LessonCard>

    <LessonCard title="3. Context value changes">
      <AccentContext.Provider value={accent}>
        <Action label="Toggle provider value" onPress={() => setAccent(value => value === '#8b9cff' ? '#65e0a3' : '#8b9cff')} />
        <ContextConsumer />
      </AccentContext.Provider>
    </LessonCard>

    <LessonCard title="4. Props change">
      <Text style={styles.note}>This parent creates a fresh profile object each time it renders. Change the name to change the prop’s value as well.</Text>
      <Action label={name === 'Ada' ? 'Change prop to Grace' : 'Change prop to Ada'} onPress={() => setName(value => value === 'Ada' ? 'Grace' : 'Ada')} />
      <PropReceiver profile={profile} />
    </LessonCard>
  </ScrollView>;
}

function LessonCard({children, title}) { return <View style={styles.card}><Text style={styles.cardTitle}>{title}</Text>{children}</View>; }
function Action({label, onPress}) { return <Pressable onPress={onPress} style={styles.action}><Text style={styles.actionText}>{label}</Text></Pressable>; }

const styles = StyleSheet.create({
  screen:{backgroundColor:'#0b1020',flexGrow:1,padding:20,paddingBottom:36}, back:{color:'#9cafff',fontSize:15,fontWeight:'800',marginTop:8}, title:{color:'#fff',fontSize:26,fontWeight:'800',marginTop:20}, intro:{color:'#b8c1d9',fontSize:14,lineHeight:20,marginTop:7}, card:{backgroundColor:'#12192d',borderRadius:16,marginTop:16,padding:15}, cardTitle:{color:'#fff',fontSize:16,fontWeight:'800'}, value:{color:'#dce3ff',fontSize:14,marginTop:10}, note:{color:'#aab5cf',fontSize:13,lineHeight:18,marginTop:8}, action:{backgroundColor:'#33467a',borderRadius:10,marginTop:12,padding:12}, actionText:{color:'#fff',fontSize:13,fontWeight:'800',textAlign:'center'}, badge:{backgroundColor:'#18223d',borderRadius:10,marginTop:12,padding:11}, badgeTitle:{color:'#dce3ff',fontSize:13,fontWeight:'800'}, badgeDetail:{color:'#aab5cf',fontSize:12,lineHeight:17,marginTop:3}, badgeCount:{color:'#8b9cff',fontSize:12,fontWeight:'800',marginTop:7}, contextPreview:{borderRadius:10,borderWidth:1,marginTop:12,padding:10}, contextText:{fontSize:13,fontWeight:'800'}, nested:{marginTop:2},
});
