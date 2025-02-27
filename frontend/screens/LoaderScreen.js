import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Video from "react-native-video";

export default function LoaderScreen({ navigation }) {
  useEffect(() => {
    // Navigate to Home screen after the video finishes
    const timeout = setTimeout(() => {
      navigation.replace("Home");
    }, 5000); // Adjust based on your video duration

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Video
        source={require("../assets/ai.mp4")} // Ensure the file is in the correct path
        style={styles.video}
        resizeMode="cover"
        muted={true}
        repeat={false}
        onEnd={() => navigation.replace("Home")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black", // Change based on your design
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
