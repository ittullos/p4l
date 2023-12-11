import { View, Text, Image, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import CustomButtonClear from '../../components/CustomButtonClear'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import SocialSignInButtons from '../../components/SocialSignInButtons'
import { useNavigation } from '@react-navigation/native'
import { Auth } from 'aws-amplify'
import { useRoute } from '@react-navigation/native'

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()

  const onSignInPressed = () => {
    navigation.navigate('SignIn')
  }

  const onSendPressed = async () => {
    if (loading) {
      return
    }
    setLoading(true)
    try {
      await Auth.forgotPassword(email)
      navigation.navigate('NewPassword', {email})
    } catch (e) {
      Alert.alert("Oops", e.message)
    }
    setLoading(false)
  }

  return (
    <View style={styles.root}>
      
      <LinearGradient
        colors={['#cce70b', '#071448']}
        style={styles.linearGradient}
      >
        <Text style={styles.title}>Reset your password</Text>
        <CustomInput 
          placeholder='Email'
          value={email}
          setValue={setEmail}
          secureTextEntry={false}
          icon='email'
        />
          {loading ? <ActivityIndicator color='white' style={{ marginVertical: 18 }} /> : 
              <CustomButton 
              text={loading ? 'Loading...' : 'Send'} 
              onPress={onSendPressed}
              type='NAVY'
            />
          }
        <View style={{ marginVertical: 15 }}>
          <Pressable onPress={onSignInPressed}>
            <Text style={{fontWeight: 'bold', color: 'white'}} >
              Back to Sign In
            </Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 0,
    maxHeight: '120%',
    justifyContent: 'center',
  },
  linearGradient: {
    alignItems: 'center',
    height: '100%',

    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  rememberMeIcon: {
    paddingRight: 5,
  },
  rememberMeContainer: {
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    width: '70%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    paddingTop: 140,
  },
  termsContainer: {
    width: '80%',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    marginVertical: 10,
    fontSize: 12,
    textAlign: 'center',
  },
  link: {
    color: '#FDB075',
  },
})

export default ForgotPasswordScreen