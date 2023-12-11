import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useTogglePasswordVisibility } from '../../hooks/useTogglePasswordVisibility'

const CustomInput = ({ value, setValue, placeholder, secureTextEntry, icon }) => {
  const { passwordVisibility, rightIcon, handlePasswordVisibility } = useTogglePasswordVisibility()
  
  return (
    <View style={styles.inputContainer}>
      { icon ? 
          <MaterialCommunityIcons 
            name={icon} 
            size={22} 
            color='#232323'
            style={styles.inputIcon}
          /> 
        : null }
      <TextInput 
        placeholder={placeholder}
        style={styles.input} 
        value={value}
        onChangeText={setValue}
        autoCapitalize='none'
        secureTextEntry={passwordVisibility && secureTextEntry}
      />
      { secureTextEntry ? 
          <Pressable onPress={handlePasswordVisibility} styles={styles.eyecon}>
            <MaterialCommunityIcons 
              name={rightIcon} 
              size={22} 
              color='#232323' 
            />
          </Pressable> : 
            <View style={{ width: 22 }}/>}
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    width: '80%',
    height: 45,
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginVertical: 6,
    opacity: 0.9,
  },
  input: {
    width: '75%',
    // borderColor: 'black',
    // borderWidth: 2,
  },
  inputIcon: {
    // borderColor: 'black',
    // borderWidth: 2,
  },
})

export default CustomInput