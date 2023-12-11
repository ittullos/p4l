import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import Navigation from './src/navigation'
import { Amplify, Auth } from 'aws-amplify'
import config from './src/aws-exports'

Amplify.configure(config)

const App = () => {
  return (
    <View style={styles.root}>
      <Navigation />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

export default App