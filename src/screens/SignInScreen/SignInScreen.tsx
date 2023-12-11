import { View, Text, Image, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useContext } from 'react'
import Logo from '../../../assets/images/p4l_logo.png'
import { LinearGradient } from 'expo-linear-gradient'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import CustomButtonClear from '../../components/CustomButtonClear'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import SocialSignInButtons from '../../components/SocialSignInButtons'
import { useNavigation } from '@react-navigation/native'
import { Auth } from 'aws-amplify'
import { useForm, Controller } from 'react-hook-form'
import { AuthContext } from '../../navigation/authContext'

const SignInScreen = () => {
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()
  const { setUser } = useContext(AuthContext)
 
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm()

  const onSignInPressed = async () => {
    if (loading) {
      return
    }
    setLoading(true)
    try {
      const user = await Auth.signIn(email, password)
      setUser(user)
      // navigation.navigate('Home')
    } catch (e) {
      Alert.alert('Oops', e.message)
    }
    setLoading(false)
  }

  const onSignUpPressed = () => {
    navigation.navigate('SignUp')
  }

  const onForgotPasswordPressed = () => {
    navigation.navigate('ForgotPassword')
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#cce70b', '#071448']}
        style={styles.linearGradient}
      >
        <Image 
          source={Logo} 
          style={styles.logo} 
          resizeMode='contain' 
        />
        <CustomInput 
          placeholder='Email'
          value={email}
          setValue={setEmail}
          secureTextEntry={false}
          icon='email'
        />
        <CustomInput 
          placeholder='Password'
          value={password}
          setValue={setPassword}
          secureTextEntry
          icon='lock'
        />
          {loading ? <ActivityIndicator color='white' style={{ marginVertical: 18 }} /> :
            <CustomButton 
              text={loading ? 'Loading...' : 'Sign In'} 
              onPress={handleSubmit(onSignInPressed)}
              type='NAVY' 
            />
          }
        <View style={{ marginVertical: 13 }}>
          <Pressable onPress={onForgotPasswordPressed}>
            <Text style={{fontWeight: 'bold', color: 'white'}} >
              Forgot Password?
            </Text>
          </Pressable>
        </View>
        <SocialSignInButtons />
        <View style={{ marginVertical: 13 }}>
          <Pressable onPress={onSignUpPressed}>
            <Text style={{fontWeight: 'bold', color: 'white'}} >
              Don't have an account? Create one
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
  logo: {
    width: '85%',
    maxWidth: 500,
    maxHeight: 270,
    // borderColor: 'black',
    // borderWidth: 3,
    marginTop: 30,
    padding: 0,
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
  text: {
    color: 'white',
    fontWeight: 'bold'
  },
})

export default SignInScreen