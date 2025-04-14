import { StyleSheet, Text, View } from 'react-native'

import React from 'react'
import { Link } from 'expo-router'
import { Image } from 'expo-image'
import ImageViewer from '../../components/ImageViewer'
import GradientButton from '../../components/Button'

const logoImage = require("../../assets/YogaSync_Logo 1.png")

const Home = () => {
  return (
    <View
    style={styles.container}>
      <View style={styles.imageContainer}>
      <ImageViewer imgSource={logoImage}/>
      </View>
      
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    container:{
        justifyContent:"center",
        alignItems:"center"
    },
    imageContainer:{
      flex:1
    }
})