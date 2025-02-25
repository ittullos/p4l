import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef } from "react";
import AppButton from "../../components/AppButton";
import { FontAwesome } from "@expo/vector-icons";

const CommitmentScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollToTop(offsetY > 200);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{ marginTop: 120 }}></View>
        <Text
          style={{
            fontSize: 28,
            alignSelf: "center",
            fontWeight: "bold",
            paddingBottom: 10,
          }}
        >
          My Commitment
        </Text>
        <AppButton
          text="How this works"
          type="NAVY"
          onPress={() => setModalVisible(true)}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <ScrollView
            contentContainerStyle={styles.modalContent}
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            <View style={{ marginTop: 40 }}></View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <View style={styles.iconContainer}>
                <FontAwesome name="circle" size={40} color="#071448" />
                <FontAwesome
                  name="times"
                  size={24}
                  color="#cce70b"
                  style={styles.icon}
                />
              </View>
            </TouchableOpacity>
            <HowItWorks />
          </ScrollView>
          {showScrollToTop && (
            <TouchableOpacity
              style={styles.scrollToTopButton}
              onPress={scrollToTop}
            >
              <FontAwesome name="arrow-up" size={24} color="#cce70b" />
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

const HowItWorks = () => {
  return (
    <View style={styles.textBox}>
      <View style={{ marginTop: 25 }}></View>
      <Text style={styles.title}>How it works</Text>
      <View style={{ marginTop: 25 }}></View>
      <Text style={styles.text}>
        - Pastor4Life is a spiritual wellness app that keeps track of walking /
        running / cycling distances and uses TN landmarks to benchmark success.
      </Text>
      <View style={{ marginTop: 25 }}></View>
      <Text style={styles.text}>
        - Creating a new commitment is essentially setting a personal goal. All
        commitments run on an annual cycle, meaning the goal must be completed
        within a year of the commit date.
      </Text>
      <View style={{ marginTop: 25 }}></View>
      <Text style={styles.text}>
        - To make a new commitment select a distance from the list on the "My
        Commitment" screen and press the commit button.
      </Text>
      <View style={{ marginTop: 25 }}></View>
      <Text style={styles.text}>
        - To log mileage go back to the home screen and press the "Start Route"
        button. Distance is automatically recorded while in a route. Don't
        forget to use the Prayer Screen to pray for people in your area!
      </Text>
      <View style={{ marginTop: 25 }}></View>
      <Text style={styles.text}>
        - To see your commitment progress, go to the "My Stats" screen using the
        hamburger menu. Here you can see the mileage logged against your
        commitment as well as how much time you have to complete your
        commitment.
      </Text>
      <View style={{ marginTop: 25 }}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
  },
  modalContent: {
    width: "140%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  iconContainer: {
    position: "relative",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    position: "absolute",
  },
  textBox: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 25, // Increase font size
    fontWeight: "semi-bold", // Make text bold
    textAlign: "center", // Center text
    marginBottom: 20, // Add more space between sections
  },
  scrollToTopButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#071448",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CommitmentScreen;
