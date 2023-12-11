import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const CustomButtonClear = ({ onPress, text }) => {
  return (

    <Pressable 
      onPress={onPress} 
      style={styles.container}
    >
      <View>
        <Text style={styles.text}>
          {text}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
    // paddingVertical: 15,
    marginVertical: 6,
    alignItems: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    color: 'white',
    height: 20,
    paddingBottom: 20,
    textAlign: 'center',
    // borderColor: 'black',
    // borderWidth: 2,
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
    paddingBottom: 20,
  },
})

export default CustomButtonClear