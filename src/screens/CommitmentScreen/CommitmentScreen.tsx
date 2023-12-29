import { View, Text, StyleSheet } from "react-native";
import React from "react";

const CommitmentScreen = () => {
  return (
    <View style={styles.container}>
      <Text>CommitmentScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 4,
    // borderColor: 'red',
  },
});

export default CommitmentScreen;
