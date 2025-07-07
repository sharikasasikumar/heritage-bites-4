import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Alert,
  Pressable,
} from "react-native";
import { auth, db } from "../config/firebase";

export default function SavedScreen() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchSavedRecipes = async () => {
        try {
          const user = auth.currentUser;
          if (!user) {
            console.log("No user logged in");
            return;
          }

          const savedRef = collection(db, "savedRecipes");
          const q = query(savedRef, where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);

          const recipes = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setSavedRecipes(recipes);
        } catch (error) {
          console.error("Error fetching saved recipes:", error);
        }
      };

      fetchSavedRecipes();
    }, [])
  );

  const handleDeleteRecipe = async (recipeId) => {
    Alert.alert(
      "Remove Recipe",
      "Are you sure you want to remove this recipe?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "savedRecipes", recipeId));
              setSavedRecipes((prev) => prev.filter((r) => r.id !== recipeId));
            } catch (error) {
              console.error("Failed to delete recipe:", error);
              Alert.alert("Error", "Failed to remove the recipe. Try again.");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate("RecipeDetails", { id: item.id })}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        {item.image && (
          <Image
            source={{ uri: item.image }}
            style={{
              width: "100%",
              height: 150,
              marginTop: 8,
              borderRadius: 8,
            }}
            resizeMode="cover"
          />
        )}
        <Pressable
          onPress={() => handleDeleteRecipe(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>Remove</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Saved Recipes</Text>
      <FlatList
        data={savedRecipes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recipes saved yet.</Text>
          </View>
        }
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
  deleteButton: {
    marginTop: 10,
    paddingVertical: 6,
    backgroundColor: "#e53935",
    borderRadius: 5,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
    fontStyle: "italic",
  },
});
