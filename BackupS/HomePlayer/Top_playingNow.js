



import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function NowPlayingCard({ artistImage, title, artist, album }) {
  return (
    <View style={styles.container}>

      {/* Artist Image Circle */}
      <View style={styles.imageWrapper}>
        <Image
          source={artistImage ? { uri: artistImage } : require('../../Imgs/muzc.png')}
          style={styles.artistImage}
        />
      </View>
      {/* Song Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.songTitle} numberOfLines={1}>{title || 'Unknown Title'}</Text>
        <Text style={styles.songMeta} numberOfLines={1}>{artist || 'Unknown Artist'}</Text>
        <Text style={styles.songMeta} numberOfLines={1}>{album || 'Unknown Album'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#191c20',
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#44484f', // dark gray shining
    shadowColor: '#888',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 7,
    padding: 14,
    marginHorizontal: 18,
    marginTop: 10,
  },
  imageWrapper: {
    width: 104,
    height: 104,
    borderRadius: 52,
    overflow: 'hidden',
    marginRight: 14,
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  artistImage: {
    width: 60,
    height: 60,
    borderRadius:30,
    resizeMode: 'cover',
  },
  detailsCard: {
    flex: 1,
    justifyContent: 'center',
  },
  songTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  songMeta: {
    color: '#bbb',
    fontSize: 12,
    marginBottom: 1,
  },
});
