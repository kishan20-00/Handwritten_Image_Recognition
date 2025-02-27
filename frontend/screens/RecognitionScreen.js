import React, { useState } from "react";
import { View, Image, Alert, ActivityIndicator } from "react-native";
import { Button, Text, Card } from "react-native-paper";
import * as ImagePicker from "react-native-image-picker";
import axios from "axios";

export default function RecognitionScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [recognizedText, setRecognizedText] = useState("");
  const [loading, setLoading] = useState(false);

  const pickImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        Alert.alert("Error", response.errorMessage);
      } else {
        setImageUri(response.assets[0].uri);
        setRecognizedText(""); // Clear previous result
      }
    });
  };

  const captureImage = () => {
    ImagePicker.launchCamera({ mediaType: "photo" }, (response) => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        Alert.alert("Error", response.errorMessage);
      } else {
        setImageUri(response.assets[0].uri);
        setRecognizedText(""); // Clear previous result
      }
    });
  };

  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert("No Image", "Please select or capture an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "uploaded_image.jpg",
    });

    try {
      setLoading(true);
      const response = await axios.post("http://YOUR_FLASK_SERVER_IP:5000/segment_and_recognize", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setRecognizedText(response.data.recognized_text || "No text recognized.");
    } catch (error) {
      Alert.alert("Error", "Failed to process the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20, backgroundColor: "#f8f9fa" }}>
      <Text variant="headlineMedium" style={{ marginBottom: 20, fontWeight: "bold", color: "#333" }}>
        Handwritten Text Recognition ✍️
      </Text>

      {imageUri && (
        <Card style={{ marginBottom: 20, elevation: 3 }}>
          <Image source={{ uri: imageUri }} style={{ width: 250, height: 250, borderRadius: 10 }} />
        </Card>
      )}

      <Button mode="contained" onPress={pickImage} style={styles.button} icon="image">
        Choose from Gallery
      </Button>
      <Button mode="contained" onPress={captureImage} style={styles.button} icon="camera">
        Capture Image
      </Button>
      <Button mode="contained" onPress={uploadImage} loading={loading} disabled={loading} style={styles.button} icon="upload">
        {loading ? "Processing..." : "Recognize Text"}
      </Button>

      {recognizedText ? (
        <Card style={{ marginTop: 20, padding: 15, width: "90%", backgroundColor: "#fff", elevation: 3 }}>
          <Text variant="bodyLarge" style={{ textAlign: "center", fontSize: 16 }}>
            <Text style={{ fontWeight: "bold", color: "#6200ee" }}>Recognized Text:</Text> {recognizedText}
          </Text>
        </Card>
      ) : null}
    </View>
  );
}

const styles = {
  button: {
    marginVertical: 8,
    width: "90%",
    borderRadius: 8,
  },
};
