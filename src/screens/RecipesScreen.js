import { useNavigation } from "@react-navigation/native";
import { doc, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth, db } from "../config/firebase";

export default function RecipesScreen() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();
  const firstRun = useRef(true);
  const navigation = useNavigation();

  const fetchRecipes = useCallback(
    async (search = "") => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`
        );
        const data = await res.json();
        setMeals(data.meals || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(t("failedToLoadRecipes"));
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      fetchRecipes();
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchRecipes(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, fetchRecipes]);

  const saveRecipe = async (recipe) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Not logged in", "Please log in to save recipes.");
      return;
    }
    const recipeRef = doc(db, "savedRecipes", recipe.idMeal);

    try {
      await setDoc(recipeRef, {
        id: recipe.idMeal,
        title: recipe.strMeal,
        image: recipe.strMealThumb,
        savedAt: new Date(),
        userId: user.uid,
      });
      setSavedIds((prev) => [...prev, recipe.idMeal]);
      Alert.alert("Recipe Saved!", `${recipe.strMeal} saved successfully.`);
    } catch (error) {
      Alert.alert("Error saving recipe", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={t("searchRecipes")}
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBox}
      />

      <Text style={styles.title}>Popular Recipes</Text>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text>{t("loadingRecipes")}</Text>
        </View>
      )}

      {error && (
        <View style={styles.center}>
          <Text style={{ color: "red" }}>{error}</Text>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => {
            const isSaved = savedIds.includes(item.idMeal);
            return (
              <Pressable
                onPress={() =>
                  navigation.navigate("RecipeDetails", { recipe: item })
                }
              >
                <View style={styles.item}>
                  <Image
                    source={{ uri: item.strMealThumb }}
                    style={styles.thumbnail}
                  />
                  <View style={styles.info}>
                    <Text style={styles.title}>{item.strMeal}</Text>
                    <Text style={styles.subtitle}>
                      {item.strArea}, {item.strCategory}
                    </Text>
                    <Pressable
                      onPress={() => saveRecipe(item)}
                      disabled={isSaved}
                      style={({ pressed }) => [
                        styles.saveButton,
                        isSaved && { backgroundColor: "gray", text: "Saved" },
                        pressed && !isSaved && { opacity: 0.75 },
                      ]}
                    >
                      <Text style={styles.saveText}>Save</Text>
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  container: { flex: 1, padding: 16, backgroundColor: "#fff6eb" },
  searchBox: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: "#c5a587",
    borderWidth: 1,
    height: 48,
    fontSize: 16,
  },
  item: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    overflow: "hidden",
    borderColor: "#c5a587",
    borderWidth: 1,
  },
  thumbnail: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 8,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "bold",
    justifyContent: "center",
    color: "#2f2f2f",
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 8,
    fontWeight: "bold",
    justifyContent: "center",
    color: "#2f2f2f",
  },
  saveButton: {
    marginTop: 10,
    paddingVertical: 6,
    backgroundColor: "#552900",
    borderRadius: 5,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
