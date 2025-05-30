import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Progress from "react-native-progress";
import CONFIG from "../../config/config";
import { fetchStats } from "../../utils/fetchStats";

const StatsScreen = ({ stats, setStats, navigation }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true); // Set loading before calling fetchStats
      try {
        const data = await fetchStats();
        setStats(data);
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#071448" />
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load stats.</Text>
      </View>
    );
  }

  // Destructure stats object
  const {
    current_journey,
    commitment_distance,
    commitment_duration,
    commitment_prayers,
    total_distance,
    total_duration,
    total_prayers,
    commitment_end_date,
  } = stats;

  const adjustedCommitmentDistance = commitment_distance / 100;
  const adjustedTotalDistance = total_distance / 100;

  // Utility function to format time as hh:mm:ss
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(
        2,
        "0"
      )}`;
    } else {
      return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
        2,
        "0"
      )}`;
    }
  };

  // Format durations
  const formattedCommitmentDuration = formatTime(commitment_duration);
  const formattedTotalDuration = formatTime(total_duration);

  return (
    <View style={styles.container}>
      {/* Commitment Stats Section */}
      {current_journey ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Commitment Stats</Text>
          <Text style={styles.journeyTitle}>{current_journey.title}</Text>
          <Progress.Bar
            progress={
              adjustedCommitmentDistance / (current_journey.annual_miles / 100)
            }
            width={null}
            height={10}
            color="#4caf50"
            unfilledColor="#e0e0e0"
            borderWidth={0}
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>
            {adjustedCommitmentDistance.toFixed(2)} miles of{" "}
            {(current_journey.annual_miles / 100).toFixed(2)} miles
          </Text>
          <Text style={styles.statText}>
            Duration: {formattedCommitmentDuration}
          </Text>
          <Text style={styles.statText}>Prayers: {commitment_prayers}</Text>
          {commitment_end_date && (
            <Text style={styles.commitmentEndDate}>
              Commitment Ends:{" "}
              {new Date(commitment_end_date).toLocaleDateString()}
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Commitment Stats</Text>
          <Text style={styles.errorText}>
            You must go to the My Commitment screen to create a commitment.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("My Commitment")}
          >
            <Text style={styles.buttonText}>Go to My Commitment</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* All Time Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Time Stats</Text>
        <Text style={styles.statText}>
          Total Distance: {adjustedTotalDistance.toFixed(2)} miles
        </Text>
        <Text style={styles.statText}>
          Total Duration: {formattedTotalDuration}
        </Text>
        <Text style={styles.statText}>Total Prayers: {total_prayers}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80, // Add padding to move content below the hamburger menu
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#071448",
    lineHeight: 36,
  },
  journeyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#4caf50",
    lineHeight: 30,
  },
  progressBar: {
    marginVertical: 10,
  },
  progressText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
    lineHeight: 30,
  },
  statText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 5,
    color: "#555",
    lineHeight: 28,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 28,
  },
  button: {
    backgroundColor: "#071448",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 28,
  },
  commitmentEndDate: {
    fontWeight: "600",
    color: "red",
    fontSize: 18,
    marginBottom: 5,
    lineHeight: 28,
  },
});

export default StatsScreen;
