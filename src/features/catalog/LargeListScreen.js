import React, {memo, useCallback, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const ROW_HEIGHT = 72;
const PAGE_SIZE = 40;

// Purpose: use a predictable server-like dataset. In production, request cursor pages
// from an API/database instead of generating every record in the UI layer.
const createPage = start => Array.from({length: PAGE_SIZE}, (_, offset) => {
  const number = start + offset + 1;
  return {id: `track-${number}`, title: `Track ${number}`, artist: `Artist ${(number % 24) + 1}`};
});

const TrackRow = memo(function TrackRow({item, selected, onSelect}) {
  // Purpose: React.memo prevents untouched visible rows from re-rendering on selection.
  return <Pressable onPress={() => onSelect(item.id)} style={[styles.row, selected && styles.selectedRow]}>
    <View style={styles.artwork}><Text style={styles.artworkText}>{item.title.split(' ')[1]}</Text></View>
    <View style={styles.rowCopy}><Text numberOfLines={1} style={styles.rowTitle}>{item.title}</Text><Text style={styles.artist}>{item.artist}</Text></View>
    {selected && <Text style={styles.selectedLabel}>PLAYING</Text>}
  </Pressable>;
});

export default function LargeListScreen({onBack}) {
  const [items, setItems] = useState(() => createPage(0));
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const cursor = useRef(PAGE_SIZE);

  // Purpose: derive the filtered list once per query/data change, not per rendered row.
  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized ? items.filter(item => `${item.title} ${item.artist}`.toLowerCase().includes(normalized)) : items;
  }, [items, query]);

  const selectTrack = useCallback(id => setSelectedId(id), []);
  const renderItem = useCallback(({item}) => <TrackRow item={item} selected={item.id === selectedId} onSelect={selectTrack} />, [selectedId, selectTrack]);
  const getItemLayout = useCallback((_, index) => ({length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index}), []);

  const loadNextPage = useCallback(() => {
    // Purpose: ignore duplicate onEndReached calls while the current page is loading.
    if (loadingMore || query) { return; }
    setLoadingMore(true);
    // Simulates network latency. Replace with `GET /tracks?cursor=${cursor.current}`.
    setTimeout(() => {
      setItems(current => [...current, ...createPage(cursor.current)]);
      cursor.current += PAGE_SIZE;
      setLoadingMore(false);
    }, 350);
  }, [loadingMore, query]);

  const footer = useMemo(() => loadingMore ? <ActivityIndicator color="#9cafff" style={styles.footer} /> : null, [loadingMore]);

  return <SafeAreaView style={styles.screen}>
    <View style={styles.header}><Pressable onPress={onBack} hitSlop={10}><Text style={styles.back}>‹ Back</Text></Pressable><Text style={styles.counter}>{filteredItems.length} loaded</Text></View>
    <Text style={styles.title}>Large-list lab</Text>
    <Text style={styles.description}>Only nearby rows are mounted. Scroll to request the next cursor page.</Text>
    <TextInput autoCapitalize="none" autoCorrect={false} onChangeText={setQuery} placeholder="Filter loaded tracks" placeholderTextColor="#8792b0" style={styles.search} value={query} />
    <FlatList
      data={filteredItems}
      extraData={selectedId}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      getItemLayout={getItemLayout}
      initialNumToRender={12}
      maxToRenderPerBatch={12}
      updateCellsBatchingPeriod={50}
      windowSize={7}
      removeClippedSubviews
      onEndReached={loadNextPage}
      onEndReachedThreshold={0.5}
      ListFooterComponent={footer}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.list}
    />
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  screen:{backgroundColor:'#0b1020',flex:1,paddingHorizontal:20},header:{alignItems:'center',flexDirection:'row',justifyContent:'space-between',marginTop:8},back:{color:'#9cafff',fontSize:15,fontWeight:'800'},counter:{color:'#aab5cf',fontSize:12},title:{color:'#fff',fontSize:27,fontWeight:'800',marginTop:18},description:{color:'#b8c1d9',fontSize:13,lineHeight:19,marginTop:5},search:{backgroundColor:'#161e35',borderColor:'#2c385d',borderRadius:12,borderWidth:1,color:'#fff',marginVertical:16,paddingHorizontal:14,paddingVertical:11},list:{paddingBottom:28},row:{alignItems:'center',backgroundColor:'#12192d',borderRadius:12,flexDirection:'row',height:ROW_HEIGHT,marginBottom:8,paddingHorizontal:12},selectedRow:{borderColor:'#91a4ff',borderWidth:1},artwork:{alignItems:'center',backgroundColor:'#27335a',borderRadius:10,height:44,justifyContent:'center',width:44},artworkText:{color:'#cdd7ff',fontSize:12,fontWeight:'800'},rowCopy:{flex:1,marginLeft:12},rowTitle:{color:'#fff',fontSize:15,fontWeight:'700'},artist:{color:'#aab5cf',fontSize:12,marginTop:3},selectedLabel:{color:'#aebdff',fontSize:10,fontWeight:'900'},footer:{marginVertical:16},
});
