import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'expo-image';

type Props={
    imgSource: string,
};

const ImageViewer = ({imgSource}:Props) => {
  return (
    <Image source={imgSource} style={styles.image}/>
  )
}

export default ImageViewer

const styles = StyleSheet.create({
    image:{
        width:320,
        height:180,
        borderRadius:18
      }
})