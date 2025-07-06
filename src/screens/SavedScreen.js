import { useFocusEffect } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCallback, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { auth, db } from "../config/firebase";
export default function SavedScreen() {
  const [savedRecipes, setSavedRecipes] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchSavedRecipes = async () => {
        try {
          const user = auth.currentUser;
          if (!user) {
            console.log("⚠️ No user logged in");
            return;
          }

          console.log("👤 Current User ID:", user.uid);

          const savedRef = collection(db, "savedRecipes");
          const q = query(savedRef, where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);

          console.log("📦 Query Snapshot size:", querySnapshot.size);

          const recipes = querySnapshot.docs.map((doc) => {
            console.log("📄 Fetched doc:", doc.id, doc.data());
            return {
              id: doc.id,
              ...doc.data(),
            };
          });

          console.log("🧾 Fetched Recipes:", recipes);
          setSavedRecipes(recipes);
        } catch (error) {
          console.error("Error fetching saved recipes:", error);
        }
      };

      fetchSavedRecipes();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={{ width: "100%", height: 150, marginTop: 8, borderRadius: 8 }}
          resizeMode="cover"
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Saved Recipes</Text>
      <FlatList
        data={savedRecipes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff6eb" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  card: {
    padding: 12,
    backgroundColor: "#fff6eb",
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#552900",
  },
  title: { fontSize: 18 },
});
