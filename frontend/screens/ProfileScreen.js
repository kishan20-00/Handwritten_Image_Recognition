// screens/ProfileScreen.js
import React, { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { Text, TextInput, Button, Appbar } from "react-native-paper";
import { auth } from "../firebaseConfig";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

export default function ProfileScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);

  const db = getFirestore();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user?.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFullName(userData.fullName);
          setPhone(userData.profession);
          setAge(userData.age);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load user data.");
      }
    };

    if (user) fetchUserData();
  }, []);

  const handleSave = async () => {
    if (!fullName || !phone || !age) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, "users", user?.uid), {
        fullName,
        phone,
        age,
      });
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f4f4f4", padding: 20 }}>

      {/* Profile Form */}
      <View style={{ marginTop: 20 }}>
        <Text variant="titleMedium">Email (Cannot be changed)</Text>
        <TextInput value={user?.email} disabled style={{ marginBottom: 10 }} />

        <Text variant="titleMedium">Full Name</Text>
        <TextInput value={fullName} onChangeText={setFullName} style={{ marginBottom: 10 }} />

        <Text variant="titleMedium">Profession</Text>
        <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={{ marginBottom: 10 }} />

        <Text variant="titleMedium">Age</Text>
        <TextInput value={age} onChangeText={setAge} keyboardType="numeric" style={{ marginBottom: 20 }} />

        {/* Save Button */}
        <Button mode="contained" onPress={handleSave} loading={loading}>
          Save Changes
        </Button>
      </View>
    </View>
  );
}
