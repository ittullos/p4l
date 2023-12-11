import { View, Text } from 'react-native'
import React from 'react'
import CustomButton from '../CustomButton'

const SocialSignInButtons = () => {

  const onSignInFacebook = () => {
    console.warn("Sign In Facebook")
  }

  const onSignInGoogle = () => {
    console.warn("Sign In Google")
  }

  const onSignInApple = () => {
    console.warn("Sign In Apple")
  }

  return (
    <>
      <CustomButton 
        text='Sign In with Facebook' 
        onPress={onSignInFacebook}
        type='NAVY' 
        bgColor='#E7EAF4'
        fgColor='#4765A9'
        icon='facebook'
      />
      <CustomButton 
        text='Sign In with Google' 
        onPress={onSignInGoogle}
        type='NAVY' 
        bgColor='#FAE9EA'
        fgColor='#DD4D44'
        icon='google'
      />
      <CustomButton 
        text='Sign In with Apple' 
        onPress={onSignInApple}
        type='NAVY' 
        bgColor='#E3E3E3'
        fgColor='#363636'
        icon='apple'
      />
    </>
  )
}

export default SocialSignInButtons