import React, {memo, useCallback, useMemo, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {topics} from './topics';
import LargeListScreen from '../catalog/LargeListScreen';
import ThreadHermesScreen from '../performance/ThreadHermesScreen';
import RenderingTriggersScreen from './RenderingTriggersScreen';
import MemoizationLabScreen from './MemoizationLabScreen';

const TopicRow = memo(function TopicRow({item, onSelect}) {
  // Purpose: React.memo skips a row render when item and onSelect references are unchanged.
  return (
    <Pressable onPress={() => onSelect(item)} style={styles.row}>
      <Text style={styles.number}>{item[0]}</Text>
      <View style={styles.copy}><Text style={styles.name}>{item[1]}</Text><Text style={styles.summary}>{item[2]}</Text></View>
    </Pressable>
  );
});

export default function LearningHub() {
  const [selected, setSelected] = useState(topics[0]);
  const [renderCount, setRenderCount] = useState(0);
  const [showLargeList, setShowLargeList] = useState(false);
  const [showThreadLab, setShowThreadLab] = useState(false);
  const [showRenderingLab, setShowRenderingLab] = useState(false);
  const [showMemoLab, setShowMemoLab] = useState(false);

  // Purpose: cache a derived value; useMemo is not for side effects or every calculation.
  const completedLabel = useMemo(() => `Selected: ${selected[0]} of ${topics.length}`, [selected]);
  // Purpose: stable callback lets memoized rows retain their optimization.
  const selectTopic = useCallback(item => {
    setSelected(item);
    if (item[0] === '23') { setShowLargeList(true); }
    if (item[0] === '04' || item[0] === '05') { setShowThreadLab(true); }
    if (item[0] === '07') { setShowRenderingLab(true); }
    if (item[0] === '08') { setShowMemoLab(true); }
  }, []);
  const renderItem = useCallback(({item}) => <TopicRow item={item} onSelect={selectTopic} />, [selectTopic]);

  if (showLargeList) { return <LargeListScreen onBack={() => setShowLargeList(false)} />; }
  if (showThreadLab) { return <ThreadHermesScreen onBack={() => setShowThreadLab(false)} />; }
  if (showRenderingLab) { return <RenderingTriggersScreen onBack={() => setShowRenderingLab(false)} />; }
  if (showMemoLab) { return <MemoizationLabScreen onBack={() => setShowMemoLab(false)} />; }

  return <View style={styles.screen}>
    <Text style={styles.eyebrow}>REACT NATIVE PRACTICALS</Text>
    <Text style={styles.title}>{selected[1]}</Text>
    <Text style={styles.detail}>{selected[2]}</Text>
    <View style={styles.callout}><Text style={styles.calloutText}>{completedLabel}</Text><Pressable onPress={() => setRenderCount(n => n + 1)}><Text style={styles.button}>Render test ({renderCount})</Text></Pressable></View>
    <FlatList
      data={topics}
      renderItem={renderItem}
      keyExtractor={item => item[0]}
      // Purpose: fixed height avoids measuring rows during scroll.
      getItemLayout={(_, index) => ({length: 76, offset: 76 * index, index})}
      initialNumToRender={8}
      windowSize={7}
      removeClippedSubviews
      contentContainerStyle={styles.list}
    />
  </View>;
}

const styles = StyleSheet.create({screen:{flex:1,padding:20},eyebrow:{color:'#8b9cff',fontSize:12,fontWeight:'800',letterSpacing:1.2,marginTop:10},title:{color:'#fff',fontSize:25,fontWeight:'800',marginTop:8},detail:{color:'#b8c1d9',fontSize:14,lineHeight:20,marginTop:6},callout:{alignItems:'center',backgroundColor:'#161e35',borderRadius:12,flexDirection:'row',justifyContent:'space-between',marginVertical:18,padding:12},calloutText:{color:'#dbe2ff'},button:{color:'#93a4ff',fontWeight:'800'},list:{paddingBottom:28},row:{alignItems:'center',backgroundColor:'#12192d',borderRadius:12,flexDirection:'row',height:68,marginBottom:8,padding:12},number:{color:'#8b9cff',fontWeight:'900',width:34},copy:{flex:1},name:{color:'#fff',fontSize:15,fontWeight:'700'},summary:{color:'#aab5cf',fontSize:12,marginTop:3}});
