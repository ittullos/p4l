import { View, Text, Image, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useContext } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import CustomButtonClear from '../../components/CustomButtonClear'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import SocialSignInButtons from '../../components/SocialSignInButtons'
import { useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import { Auth } from 'aws-amplify'
import { useRoute } from '@react-navigation/native'
import { AuthContext } from '../../navigation/authContext'

const ConfirmEmailScreen = () => {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()
  const route = useRoute()
  const { setUser } = useContext(AuthContext)


  const onSignInPressed = () => {
    navigation.navigate('SignIn')
  }

  const onResendCodePressed = async () => {
    try {
      await Auth.resendSignUp(route?.params?.email)
      Alert.alert('Success', 'Code was resent to your email')
    } catch (e) {
      Alert.alert("Oops", e.message)
    }
  }

  const onConfirmPressed = async () => {
    if (loading) {
      return
    }

    setLoading(true)
    try {
      await Auth.confirmSignUp(route?.params?.email, code)
      const user = await Auth.signIn(route?.params?.email, route?.params?.password)
      setUser(user)
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
        <Text style={styles.title}>Confirm your email</Text>
        <CustomInput 
          placeholder='Enter confirmation code'
          value={code}
          setValue={setCode}
          secureTextEntry={false}
          icon='email-check'
        />
        {loading ? <ActivityIndicator color='white' style={{ marginVertical: 18 }} /> :
          <CustomButton 
            text={loading ? 'Loading...' : 'Confirm'}
            onPress={onConfirmPressed}
            type='NAVY'
          />
        }
        <CustomButton
          text="Resend Code" 
          onPress={onResendCodePressed} 
          type='NAVY_INVERT'
        />
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

export default ConfirmEmailScreen