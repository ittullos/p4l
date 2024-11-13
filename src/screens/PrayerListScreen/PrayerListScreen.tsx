import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AppButton from "../../components/AppButton";
import Seperator from "../../components/Seperator";
import { openBrowserAsync } from "expo-web-browser";
import * as DocumentPicker from "expo-document-picker";
import { Auth } from "aws-amplify";

const PrayerListScreen = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [showUploadError, setShowUploadError] = useState(false);

  const [loading, setLoading] = useState(true);

  const pickFile = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      setSelectedFile(file);
    } catch (error) {
      console.warn("File picking error: ", error);
    }
  };

  const uploadFile = async () => {
    Auth.currentSession().then((session) => {
      let accessToken = session.getAccessToken();
      let email = session.getIdToken().payload.email;
      console.log("email2: ", email);
      axios
        .post(`http://localhost:9292/user/residents`, {
          headers: { "P4L-email": email },
          data: selectedFile,
        })
        .then((res) => {
          console.log("/prayer_list response: ", res);
        })
        .catch((err) => {
          console.log(err);
        });
    });
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
});

export default PrayerListScreen;
