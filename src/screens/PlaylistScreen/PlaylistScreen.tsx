import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { FlashList } from "@shopify/flash-list"
import Seperator from '../../components/Seperator'


const PlaylistScreen = (props) => {
  // const lastItemId = useRef<number>(props.id)
  // const [active, setActive] = useState<boolean>(isActive)

  // if (lastItemId.current !== props.id) {
  //   lastItemId.current = props.id
  //   setActive(isActive);
  // }

  useEffect(() => {
  
  }, [props.currentIndex])
  

  
  return (
    <FlashList
      data={props.devotionalData}
      estimatedItemSize={6}
      ItemSeparatorComponent={Seperator}
      refreshing={true}
      key={props.currentIndex}
      renderItem={({item, index}) => (
      <Pressable
        style={{ 
          padding: 20, 
          backgroundColor: (index === props.currentIndex) ? '#071448' : 'white',
           
        }}
        onPress={() => {
          props.setTrackPick(true)
          props.setCurrentIndex(index)
        }}
      >
        <View>
          <Text style={{ color: (index === props.currentIndex) ? 'white' : 'black', }}>{item.title}</Text>
        </View>
      </Pressable>
      )}  
    />
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
})

export default PlaylistScreen