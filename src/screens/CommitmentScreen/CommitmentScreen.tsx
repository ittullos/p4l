import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import AppButton from "../../components/AppButton";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CONFIG from "../../config/config";
import { fetchStats } from "../../utils/fetchStats";

const RadioButton = ({ selected, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.radioButtonContainer}>
    <View
      style={[styles.radioButton, selected && styles.radioButtonSelected]}
    />
  </TouchableOpacity>
);

const CommitmentScreen = ({ stats, setStats }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [journeys, setJourneys] = useState([]);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollToTop(offsetY > 200);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleJourneySelect = (journeyId) => {
    setSelectedJourney(journeyId);
    setShowButton(true);
  };

  const handleButtonClick = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const idToken = await AsyncStorage.getItem("idToken");
      if (!idToken) {
        throw new Error("No ID token found");
      }
      console.log("selectedJourney: ", selectedJourney);

      axios.interceptors.request.use((request) => {
        console.log("Starting Request", JSON.stringify(request, null, 2));
        return request;
      });

      const response = await axios.post(
        `${CONFIG.SERVER_URL}/user/commitments`,
        { journey_id: selectedJourney },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-ID-TOKEN": `Bearer ${idToken}`,
            "Content-Type": "application/json", // Ensure Content-Type is set
          },
        }
      );

      console.log("Commit response: ", response.data.data);
      setSuccessModalVisible(true); // Show success modal

      // Fetch updated stats after commitment
      try {
        const updatedStats = await fetchStats();
        setStats(updatedStats); // Update the shared stats state
        console.log("Updated Stats:", updatedStats);
        // Optionally, pass updatedStats to a parent component or update local state
      } catch (error) {
        console.error("Error fetching updated stats:", error);
      }
    } catch (error) {
      console.error("Error committing to journey: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (!accessToken) {
        }

        const idToken = await AsyncStorage.getItem("idToken");
        if (!idToken) {
          throw new Error("No ID token found");
        }

        console.log("accessToken: ", accessToken);
        const response = await axios.get(`${CONFIG.SERVER_URL}/journeys`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-ID-TOKEN": `Bearer ${idToken}`,
          },
        });

        console.log("fetchData: ", response.data.data);
        setJourneys(response.data.data);
      } catch (error) {
        console.error("Error fetching Journeys: ", error);
      }
    };

    fetchData();
  }, []);

  const formatMiles = (value: number) => {
    const miles = value / 100;
    return parseFloat(miles.toString());
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
        {/* Map over journeys and display them as radio buttons */}
        {journeys.map((journey, index) => (
          <View key={index} style={styles.journeyContainer}>
            <RadioButton
              selected={selectedJourney === journey.id}
              onPress={() => handleJourneySelect(journey.id)}
            />
            <View style={styles.journeyTextContainer}>
              <Text style={styles.journeyTitle}>{journey.title}</Text>
              <Text style={styles.journeyAnnualMiles}>
                {`  - ${formatMiles(journey.annual_miles)} miles`}
              </Text>
              <Text style={styles.journeyText}>
                {`      - ${formatMiles(journey.monthly_miles)} mi/month`}
              </Text>
              <Text style={styles.journeyText}>
                {`      - ${formatMiles(journey.weekly_miles)} mi/week`}
              </Text>
            </View>
          </View>
        ))}
        <View style={{ marginTop: 20 }}></View>
        {showButton && (
          <AppButton
            text="Confirm"
            type="GREEN"
            onPress={handleButtonClick}
            style={styles.commitButton}
          />
        )}
        <View style={{ marginTop: 80 }}></View>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => {
          setSuccessModalVisible(!successModalVisible);
        }}
      >
        <View style={styles.successModalContainer}>
          <View style={styles.successModalContent}>
            <View style={{ marginTop: 15 }}></View>
            <Text style={styles.successModalText}>Commitment Created</Text>
            <View style={{ marginTop: 5 }}></View>
            <Text style={styles.successModalText}>Successfully!</Text>
            <View style={{ marginTop: 15 }}></View>
            <AppButton
              text="Close"
              type="GREEN"
              onPress={() => setSuccessModalVisible(false)}
            />
          </View>
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
    fontWeight: "500", // Make text bold
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
  journeyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    width: "90%",
  },
  journeyTextContainer: {
    flexDirection: "column",
    marginLeft: 10,
  },
  journeyText: {
    fontSize: 18,
    marginLeft: 10,
    marginBottom: 10, // Add space between lines of text
  },
  journeyTitle: {
    fontSize: 20,
    marginLeft: 10,
    marginBottom: 10, // Add space between lines of text
    fontWeight: "700", // Make title bold
  },
  journeyAnnualMiles: {
    fontSize: 18,
    marginLeft: 10,
    marginBottom: 10, // Add space between lines of text
    fontWeight: "600", // Make annual miles semi-bold
  },
  radioButtonContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#071448",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  radioButton: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "transparent",
  },
  radioButtonSelected: {
    backgroundColor: "#071448",
  },
  commitButton: {
    position: "absolute",
    bottom: 20,
    width: "90%",
  },
  successModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  successModalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  successModalTextContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  successModalText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
});

export default CommitmentScreen;
