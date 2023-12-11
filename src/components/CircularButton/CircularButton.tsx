import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

const CircularButton = ({ title, onPress, color }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button(color)}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  )}

const styles = StyleSheet.create({
  button:(color) => ({
    width: 120,
    height: 120,
    borderRadius: 75,
    backgroundColor: (color === 'green') ? '#02B875' : '#D9534F',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'grey',
    borderWidth: 1,
  }),
  title: {
    color: 'white',
    fontSize: 20
  }
})


export default CircularButton