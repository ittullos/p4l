import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import AppButton from '../../components/AppButton'
import axios from 'axios'

const PrayerScreen = (props) => {
  const [prayerListLoaded, setPrayerListLoaded] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    sendPrayer()
  }, [])
  

  const sendPrayer = () => {
      const checkpointData = {
        type:     "prayer",
        lat:      0,
        long:     0,
        user_id:   "isaac.tullos@gmail.com"
      }
      axios.post(`https://pastor4life.click/p4l/checkpoint`, { checkpointData
      }).then(res => {
        let name = res.data["prayerName"]
        if (name !== "") {
          props.setPrayerName(name)
          setPrayerListLoaded(true)
          setIsLoading(false)
          if (props.routeStarted) {
            props.setPrayerCount(props.prayerCount + 1)
          }
        } else {
          setPrayerListLoaded(false)
          setIsLoading(false)
        }
        // console.warn("prayer checkpoint response: ", res)
      }).catch(err => {
        console.log(err)
      })
    
  }

  return (
    <View style={styles.container}>
      { isLoading ? (
        <ActivityIndicator 
          size="large" 
          style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }], paddingTop: 50 }} 
          color='#071448' 
        /> 
      ) : (
        <>
          <View style={styles.prayerNameBox}>
            <Text style={styles.prayerName}>{ props.prayerName }</Text>
          </View>
          <View style={styles.buttonGap}></View>
          <AppButton 
            text="Next"
            type='GREEN'
            onPress={sendPrayer}
          />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 4,
    // borderColor: 'red',
  },
  prayerNameBox: { 
    flex: .6, 
    height: '50%', 
    justifyContent: 'flex-end' 
  },
  prayerName: {
    fontSize: 27,
    textAlign: 'center',
    maxWidth: '80%',
  },
  buttonGap: {
    marginTop: 45,
  },
})

export default PrayerScreen