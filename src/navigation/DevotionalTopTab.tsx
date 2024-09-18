import React, { useState, useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DevotionalScreen from "../screens/DevotionalScreen";
import PlaylistScreen from "../screens/PlaylistScreen";
import axios from "axios";
import { ActivityIndicator } from "react-native";
import { View } from "react-native";
import Auth from "@aws-amplify/auth";

const Tab = createMaterialTopTabNavigator();

const DevotionalTopTab = () => {
  const [url, setUrl] = useState();
  const [imgUrl, setImgUrl] = useState();
  const [title, setTitle] = useState();
  const [loading, setLoading] = useState(true);
  const [devotionalData, setDevotionalData] = useState(null);
  const [currentDevotionalIndex, setCurrentDevotionalIndex] = useState(0);
  const [devotionalCount, setDevotionalCount] = useState(0);
  const [trackPick, setTrackPick] = useState<boolean>(false);

  useEffect(() => {
    fetchDevotionals();
  }, []);

  const fetchDevotionals = () => {
    Auth.currentSession().then((session) => {
      let accessToken = session.getAccessToken();
      let email = session.getIdToken().payload.email;

      axios
        .get(`http://localhost:9292/devotionals`, {
          headers: { "P4L-email": email },
        })
        .then((res) => {
          console.log("response: ", res.data);
          let devotionals = res.data;

          setUrl(devotionals[0]["url"]);
          setImgUrl(devotionals[0]["img_url"]);
          setTitle(devotionals[0]["title"]);

          setDevotionalData(res.data);
          // console.log("devotionals: ", res.data.devotionals);
          // setCurrentDevotionalIndex(0)
          // setLoading(false)
        })
        .catch((err) => {
          // console.log(err)
        });
    });
  };

  useEffect(() => {
    if (devotionalData) {
      setDevotionalCount(devotionalData.length);
    }
  }, [devotionalData]);

  useEffect(() => {
    if (devotionalCount !== 0) {
      // console.warn("devotionals counted", devotionalCount)
    }
  }, [devotionalCount]);

  useEffect(() => {
    if (!devotionalData) {
      return;
    }

    setImgUrl(devotionalData[currentDevotionalIndex].img_url);
    setTitle(devotionalData[currentDevotionalIndex].title);
    setUrl(devotionalData[currentDevotionalIndex].url);
  }, [currentDevotionalIndex]);

  return (
    <Tab.Navigator
      style={{ paddingTop: 35, backgroundColor: "white" }}
      initialRouteName={"Listen"}
      screenOptions={{
        tabBarIndicatorStyle: {
          backgroundColor: "#071448",
          height: 4,
        },
        tabBarLabelStyle: {
          fontSize: 18,
        },
      }}
    >
      <Tab.Screen
        name="Listen"
        children={() => (
          <DevotionalScreen
            url={url}
            setUrl={setUrl}
            loading={loading}
            setLoading={setLoading}
            devotionalData={devotionalData}
            title={title}
            imgUrl={imgUrl}
            currentDevotionalIndex={currentDevotionalIndex}
            setCurrentDevotionalIndex={setCurrentDevotionalIndex}
            devotionalCount={devotionalCount}
            setTrackPick={setTrackPick}
            trackPick={trackPick}
          />
        )}
      />
      <Tab.Screen
        name="Playlist"
        children={() => (
          <PlaylistScreen
            // url={url}
            // setUrl={setUrl}
            // loading={loading}
            // setLoading={setLoading}
            devotionalData={devotionalData}
            setCurrentIndex={setCurrentDevotionalIndex}
            currentIndex={currentDevotionalIndex}
            setTrackPick={setTrackPick}
            // title={title}
            // imgUrl={imgUrl}
          />
        )}
      />
    </Tab.Navigator>
  );
};

export default DevotionalTopTab;
