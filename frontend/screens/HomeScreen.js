// screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { Button, Text } from "react-native-paper";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default function HomeScreen({ navigation }) {
  const [fullName, setFullName] = useState("");

  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser?.uid));
        if (userDoc.exists()) {
          setFullName(userDoc.data().fullName);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load user data.");
      }
    };

    if (auth.currentUser) {
      fetchUserData();
    }
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace("Login");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f4f4f4", padding: 20 }}>
      {/* User Welcome Text (Now at the Top) */}
      <View style={{ alignItems: "center", marginTop: 20, marginBottom: 20 }}>
        <Text variant="headlineMedium" style={{ textAlign: "center", flexWrap: "wrap" }}>
          Welcome, {fullName || "User"}! 👋
        </Text>
      </View>

      {/* Buttons Section (Centered Below) */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button
          mode="contained"
          icon="account"
          onPress={() => navigation.navigate("Profile")}
          style={{ width: "80%", marginBottom: 10 }}
        >
          Profile
        </Button>

        <Button
          mode="contained"
          icon="chart-bar"
          onPress={() => navigation.navigate("Recognition")}
          style={{ width: "80%", marginBottom: 10 }}
        >
          Page Analyze
        </Button>

        <Button
          mode="contained"
          icon="logout"
          onPress={handleLogout}
          style={{ width: "80%" }}
        >
          Logout
        </Button>
      </View>
    </View>
  );
}
