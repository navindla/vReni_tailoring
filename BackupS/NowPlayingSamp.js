


import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import NowPlayingCard from './BackupS/HomePlayer/Top_playingNow';

export default function MainScreenTop() {
  // Example data, replace with your state or props
  const currentTrack = {
    artistImage: 'https://images.pexels.com/photos/3656773/pexels-photo-3656773.jpeg?_gl=1*1ge4e62*_ga*MTk5NTQ1MDEyNC4xNzAyNzIyMDQ1*_ga_8JE65Q40S6*czE3NTE2NTQxOTYkbzEwJGcxJHQxNzUxNjU0MjEwJGo0NiRsMCRoMA..', // or null for fallback
    title: 'Song Title: sdfkkfnf',
    artist: 'Artist Name: rahman',
    album: 'Album Name: dilbara',
  };

  return (
    <View style={styles.topPart}>
      <View style={{flexDirection:'row',justifyContent:'center'}}>
         <Text style={{fontSize:20,fontWeight:'bold',color:'#44484f', }}> Playing now..!</Text>
      </View>
      <NowPlayingCard
        artistImage={currentTrack.artistImage}
        title={currentTrack.title}
        artist={currentTrack.artist}
        album={currentTrack.album}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topPart: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#121212', // main container dark color
  },
});
