import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const AppButton = ({ onPress, text, type, bgColor, fgColor, icon }) => {
  return (

    <Pressable 
      onPress={onPress} 
      style={[
        styles.container(icon), 
        styles[`container_${type}`],
        bgColor ? {backgroundColor: bgColor} : {}
      ]}>
      { icon ? 
        <View style={{ paddingLeft: 10 }}>
          <MaterialCommunityIcons 
            name={icon} 
            size={22} 
            color={fgColor}
            style={styles.buttonIcon}
          /> 
        </View> : null }
      <View>
        <Text 
          style={[
            styles.text, 
            styles[`text_${type}`],
            fgColor ? {color: fgColor} : {},
          ]}>
            {text}
        </Text>
      </View>
      { icon ? 
        <View style={{ paddingright: 10, width: 22 }}>
        </View> : null }
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container:(icon) => ({
    flexDirection: 'row',
    width: '38%',
    padding: 15,
    marginVertical: 4,
    alignItems: 'center',
    borderRadius: 50,
    borderColor: 'grey',
    borderWidth: 1,
    justifyContent: (icon) ? 'space-between' : 'center'
  }),
  container_NAVY: {
    backgroundColor: '#071448',
  },
  container_GREEN: {
    backgroundColor: '#02B875',
    color: 'white',
  },
  container_OPAQUE: {
    height: 20,
    textAlign: 'center',
    alignContent: 'center',
    // borderColor: 'black',
    // borderWidth: 2,
  },
  container_NAVY_INVERT: {
    borderColor: '#071448',
    borderWidth: 2,
    backgroundColor: 'white',
    width: '80%',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
  },
  text_NAVY: {
    color: 'white',
  },
  text_GREEN: {
    color: 'white'
  },
  text_OPAQUE: {
    color: 'white',
    paddingBottom: 20,
    textAlign: 'center'
  },
  text_NAVY_INVERTED: {
    color: '#071448',
  },
})

export default AppButton