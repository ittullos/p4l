import { View, Text, StyleSheet, Button, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import Constants from 'expo-constants'
import { Audio } from 'expo-av'
import { Sound } from "expo-av/build/Audio/Sound"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'
import { Image } from 'expo-image';

interface DevotionalProps {
  id: number
  url: string
  setUrl: (open: string) => void
  title: string
  loading: boolean
  setLoading: (open: boolean) => void
  imgUrl: string
  currentDevotionalIndex: number
  setCurrentDevotionalIndex: (open: number) => void
  devotionalCount: number
  trackPick: boolean

}

const DevotionalScreen = (props: DevotionalProps) => {
  const [sound, setSound] = useState<Sound|null>(null)
  // const [track, setTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [trackSwitch, setTrackSwitch] = useState<boolean>(false)
  // const [retriggerInterval, setRetriggerInterval] = useState<boolean>(false)
  const [duration, setDuration] = useState<number>(0)
  const [position, setPosition] = useState<number>(0)
  
  useEffect(() => {
    if (props.url) {
      if (isPlaying && !trackSwitch && !props.trackPick) {
        return
      } else {
        playCurrentSong()
        setTrackSwitch(false)
        props.setTrackPick(false)
        // setIsPlaying(true)
      }
    }
    return () => {
      // Clean up the sound object when component unmounts
      if (sound) {
        sound.unloadAsync()
      }
    }
  }, [props.url])

  useEffect(() => {
    if (sound) {
      // Set up the playback status update callback
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.isPlaying) {
          setDuration(Math.floor(status.durationMillis / 1000))
          setPosition(Math.floor(status.positionMillis / 1000))
        }
      })
    }
  }, [sound])
  

  useEffect(() => {
    // console.warn("isPlaying: ", isPlaying)
  }, [isPlaying])
  

  const playCurrentSong = async () => {
    if (sound) {
      await sound.unloadAsync()
    }
    const newSound = new Sound()
    const track = await newSound.loadAsync(
      { uri: props.url },
      { shouldPlay: isPlaying },
    )
    setDuration(Math.floor(track.durationMillis / 1000))
    setSound(newSound)
  }
  
  const onPlayPausePress = async () => {
    if(!sound) {
      return
    }
    
    if (isPlaying) {
      await sound.pauseAsync()
    } else {
      if (position === 0) {
        await sound.playAsync()
      } else {
        await sound.playFromPositionAsync(position * 1000)
      }
    }

    setIsPlaying(!isPlaying)
  }

  const nextTrack = async () => {
    if(!sound) {
      return
    }
    await sound.stopAsync()
    setPosition(0)
    setTrackSwitch(true)
    if (props.currentDevotionalIndex < (props.devotionalCount - 1)) {
      props.setCurrentDevotionalIndex(props.currentDevotionalIndex + 1)
    } else {
      props.setCurrentDevotionalIndex(0)
    }
    
  }

  const prevTrack = async () => {
    if(!sound) {
      return
    }
    await sound.stopAsync()
    setPosition(0)
    setTrackSwitch(true)
    if(props.currentDevotionalIndex > 0) {
      props.setCurrentDevotionalIndex(props.currentDevotionalIndex - 1)
    } else {
      props.setCurrentDevotionalIndex(props.devotionalCount - 1)
    }
  }

  const pickTrack = async () => {
    if(!sound) {
      return
    }
    await sound.stopAsync()
  }

  const handleImageLoad = () => {
    props.setLoading(false)
  }

  useEffect(() => {
    if (props.trackPick) {
      pickTrack()
    }
  }, [props.trackPick])

  const handleSlidingStart = async () => {
    if (!isPlaying) return
    try {
      await sound?.pauseAsync()
    } catch (error) {
      // console.warn(error)
    }
  }

  const handleSlidingComplete = async (value) => {
    if (sound === null) return
    if (isPlaying) {
      try {
        await sound.setPositionAsync(value)
        setPosition(Math.floor(value * duration))
        await sound.playFromPositionAsync(position * 1000)
      } catch (error) {
        // console.warn(error)
      }
    } else {
      await sound.setPositionAsync(value)
      setPosition(Math.floor(value * duration))
    }
  }
  
  const handleValueChange = async (value) => {
    if (value === 1) {
      nextTrack()
    }
    setPosition(Math.floor(value * duration))
  }

  return(
    <View style={styles.container}>
      <View style={styles.artworkWrapper} >
        <Image 
          style={styles.artwork} 
          // source={{ uri: `${props.imgUrl}?${new Date().getTime()}` }}
          source={{ uri: props.imgUrl }}
          onLoadEnd={handleImageLoad}
          transition={1000}
        />
      </View>
    {props.loading ? (
      <ActivityIndicator size="large" style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }], paddingTop: 50 }} color='#071448' />
    ):(
      <View style={styles.trackData} >
        <View style={styles.trackTitle}>
          <Text style={styles.title}>{props.title}</Text>
        </View>
        <View>
          <Slider 
            style={styles.progressContainer}
            value={(position) ? (position/duration) : 0}
            minimumValue={0}
            maximumValue={1}
            thumbTintColor='#071448'
            minimumTrackTintColor='#415294'
            maximumTrackTintColor='#cce70b'
            onSlidingStart={handleSlidingStart}
            onSlidingComplete={handleSlidingComplete}
            onValueChange={handleValueChange}
          />
          <View style={styles.progressLabelContainer} >
            <Text style={styles.progressLabelTime} >
              {(sound?._loaded) ? `${Math.floor(position / 60)}:${(position % 60).toString().padStart(2, '0')}`: "--:--"}
            </Text>
            <Text style={styles.progressLabelTime} >
              {(sound?._loaded) ? `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`: "--:--"}
            </Text>
          </View>
        </View>
        
        <View style={styles.musicControls} >
          <TouchableOpacity onPress={prevTrack}>
            <MaterialCommunityIcons 
              name='skip-previous-circle'
              size={55}
              style={{ color: '#071448', marginTop: 12 }}
            /> 
          </TouchableOpacity>
          <TouchableOpacity onPress={onPlayPausePress}>
            <MaterialCommunityIcons 
              name={isPlaying ? 'pause-circle' : 'play-circle'}
              size={80}
              style={{ color: '#071448' }}
            /> 
          </TouchableOpacity>
          <TouchableOpacity onPress={nextTrack}>
            <MaterialCommunityIcons 
              name='skip-next-circle'
              size={55}
              style={{ color: '#071448', marginTop: 12 }}
            /> 
          </TouchableOpacity>
        </View>

      </View>
    )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 4,
    // borderColor: 'red',
  },
  trackData: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 4,
    // borderColor: 'red',
  },
  trackTitle: {
    width: '80%',
    // borderWidth: 4,
    // borderColor: 'red',
  },
  title: {
    textAlign: 'center',
    fontSize: 17,
  },
  artworkWrapper: {
    width: 300,
    height: 300,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: .5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  artwork: {
    height: '100%',
    width: '100%',
    borderRadius: 15,
  },
  progressContainer: {
    width: 300,
    height: 40,
    marginTop: 25,
    flexDirection: 'row',
  },
  progressLabelContainer: {
    width: 300,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelTime: {
    
  },
  musicControls: {
    flexDirection: 'row',
    width: '54%',
    justifyContent: 'space-between',
    marginTop: 15,
  },
})

export default DevotionalScreen