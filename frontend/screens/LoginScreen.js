import React, { useState } from "react";
import { View, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Login Successful!");
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={{ padding: 20, justifyContent: "center", flex: 1 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 10, textAlign: "center" }}>
        Login
      </Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        mode="outlined"
        style={{ marginBottom: 10 }}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={{ marginBottom: 10 }}
      />

      <Button mode="contained" onPress={handleLogin} style={{ marginTop: 10 }}>
        Login
      </Button>

      <Text
        onPress={() => navigation.navigate("Register")}
        style={{ marginTop: 10, color: "blue", textAlign: "center" }}
      >
        Don't have an account? Register
      </Text>
    </View>
  );
}
