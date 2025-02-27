// screens/RegisterScreen.js
import React, { useState } from "react";
import { View, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { getFirestore, doc, setDoc } from "firebase/firestore";

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [profession, setProfession] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const db = getFirestore();

  const handleRegister = async () => {
    if (!fullName || !age || !profession || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        age,
        profession,
        email
      });

      Alert.alert("Account Created!", "Your profile has been set up.");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 10 }}>Register</Text>

      <TextInput
        label="Full Name"
        value={fullName}
        onChangeText={setFullName}
        mode="outlined"
        style={{ marginBottom: 10 }}
      />

      <TextInput
        label="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        mode="outlined"
        style={{ marginBottom: 10 }}
      />

      <TextInput
        label="Profession"
        value={profession}
        onChangeText={setProfession}
        mode="outlined"
        style={{ marginBottom: 10 }}
      />

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

      <Button mode="contained" onPress={handleRegister} style={{ marginTop: 10 }}>
        Register
      </Button>

      <Text onPress={() => navigation.navigate("Login")} style={{ marginTop: 10, color: "blue", textAlign: "center" }}>
        Already have an account? Login
      </Text>
    </View>
  );
}
