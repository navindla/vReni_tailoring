import React, {memo, useCallback} from 'react';
import {FlatList, Pressable, StyleSheet, Text} from 'react-native';

const ROW_HEIGHT = 56;
const CatalogRow = memo(({item, onPress}) => <Pressable onPress={() => onPress(item.id)} style={styles.row}><Text>{item.title}</Text></Pressable>);

// Purpose: production pattern for thousands of rows: pagination + stable rows + virtualization.
export default function CatalogList({items, loadNextPage, onSelect}) {
  const renderItem = useCallback(({item}) => <CatalogRow item={item} onPress={onSelect} />, [onSelect]);
  return <FlatList data={items} renderItem={renderItem} keyExtractor={item => item.id} getItemLayout={(_, index) => ({length:ROW_HEIGHT, offset:ROW_HEIGHT * index, index})} initialNumToRender={12} maxToRenderPerBatch={12} windowSize={7} onEndReached={loadNextPage} onEndReachedThreshold={0.6} removeClippedSubviews />;
}

const styles = StyleSheet.create({row: {height: ROW_HEIGHT, justifyContent: 'center', paddingHorizontal: 16}});
