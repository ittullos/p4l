import { View, Text, StyleSheet } from "react-native";
import React from "react";

const StatsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>StatsScreen</Text>
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

export default StatsScreen;
