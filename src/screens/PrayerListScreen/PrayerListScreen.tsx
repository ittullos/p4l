import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AppButton from "../../components/AppButton";
import Seperator from "../../components/Seperator";
import { openBrowserAsync } from "expo-web-browser";
import * as DocumentPicker from "expo-document-picker";
import { Auth } from "aws-amplify";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CONFIG from "../../config/config";
import { fetchNextResident } from "../../utils/fetchNextResident";

const PrayerListScreen = (props) => {
  const [selectedFile, setSelectedFile] = useState();
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [showUploadError, setShowUploadError] = useState(false);
  const [loading, setLoading] = useState(true);

  const pickFile = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      console.log("Selected File:", file); // Debugging the selected file

      if (!file.canceled && file.assets && file.assets.length > 0) {
        console.log("Selected File Details:", file.assets[0]); // Log the actual file details
        setSelectedFile(file);
      } else if (file.canceled) {
        console.warn("File picking was canceled.");
      } else {
        console.warn("No file selected or invalid file structure.");
      }
    } catch (error) {
      console.warn("File picking error: ", error);
    }
  };

  const uploadFile = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const idToken = await AsyncStorage.getItem("idToken");
      if (!idToken) {
        throw new Error("No ID token found");
      }

      if (!selectedFile) {
        throw new Error("No file selected");
      }

      // Extract file details from the assets array
      const fileDetails = selectedFile.assets[0];

      // Create FormData and append the file
      const formData = new FormData();
      formData.append("file", {
        uri: fileDetails.uri,
        name: fileDetails.name,
        type: fileDetails.mimeType || "application/pdf",
      });

      // Debugging FormData
      console.log("FormData contents:");
      formData._parts.forEach(([key, value]) => {
        console.log(`${key}:`, value);
      });

      // Make the POST request with FormData
      const response = await axios.post(
        `${CONFIG.SERVER_URL}/user/residents`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-ID-TOKEN": `Bearer ${idToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Prayer List upload response: ", response.data);
      setShowUploadSuccess(true);

      // Fetch the next resident after a successful upload
      await fetchNextResident(props.setPrayerName, props.setResidentId);
    } catch (error) {
      console.error("Error uploading Prayer List: ", error);
      setShowUploadError(true);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{ marginTop: 30 }}></View>
        <Text style={styles.title}>Step 1:</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            margin: 20,
            width: "100%",
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: "grey" }} />
        </View>
        <View style={{ marginTop: 10 }}></View>
        <View style={styles.textBox}>
          <Text style={styles.text}>Download your local</Text>
          <Text style={styles.text}>prayer list from</Text>
          <TouchableOpacity
            onPress={() => openBrowserAsync("https://blesseveryhome.com/")}
          >
            <Text style={styles.link}>Bless Every Home</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 25 }}></View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            margin: 20,
            width: "100%",
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: "grey" }} />
        </View>

        <Text style={styles.title}>Step 2:</Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            margin: 20,
            width: "100%",
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: "grey" }} />
        </View>
        <View style={styles.textBox}>
          <Text style={styles.text}>Upload your</Text>
          <Text style={styles.text}>prayer list here:</Text>
        </View>
        <View style={{ marginTop: 25 }}></View>
        <AppButton text="Choose File" type="NAVY" onPress={pickFile} />
        {selectedFile ? (
          <>
            <Text style={styles.fileTitle}>File:</Text>
            <Text style={styles.file}>{selectedFile["assets"][0]["name"]}</Text>
            <View style={{ marginTop: 20 }}></View>
            <AppButton text="Upload File" type="GREEN" onPress={uploadFile} />
          </>
        ) : null}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            margin: 20,
            width: "100%",
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: "grey" }} />
        </View>
        <Text style={styles.title}>Step 3:</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            margin: 20,
            width: "100%",
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: "grey" }} />
        </View>
        <View style={styles.textBox}>
          <Text style={styles.text}>Pray for people</Text>
          <Text style={styles.text}>in your community</Text>
        </View>
        <View style={{ marginTop: 40 }}></View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showUploadSuccess}
        onRequestClose={() => {
          setShowUploadSuccess(!showUploadSuccess);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Prayer List Uploaded Successfully!
            </Text>
            <AppButton
              text="Close"
              type="GREEN"
              onPress={() => setShowUploadSuccess(false)}
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showUploadError}
        onRequestClose={() => {
          setShowUploadError(!showUploadError);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Error Uploading Prayer List!</Text>
            <AppButton
              text="Close"
              type="RED"
              onPress={() => setShowUploadError(false)}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: "center",
    // borderWidth: 4,
    // borderColor: 'red',
  },
  textBox: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },
  title: {
    fontSize: 30,
  },
  fileTitle: {
    fontSize: 24,
    margin: 10,
  },
  file: {
    fontSize: 15,
    textAlign: "center",
  },
  text: {
    fontSize: 24,
    textAlign: "center",
    lineHeight: 40,
  },
  link: {
    fontSize: 24,
    marginTop: 11,
    color: "blue",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default PrayerListScreen;
