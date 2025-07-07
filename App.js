import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./src/config/firebase";
import "./src/i18n/i18n";

import BottomTabs from "./src/navigation/BottomTabs";
import LoginScreen from "./src/screens/LoginScreen";
import RecipeDetailsScreen from "./src/screens/RecipeDetails";
import SignUpScreen from "./src/screens/SignUpScreen";
import UploadRecipe from "./src/screens/UploadRecipe";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#765341",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="Heritage Bites" component={BottomTabs} />
            <Stack.Screen
              name="RecipeDetails"
              component={RecipeDetailsScreen}
              options={{ title: "Recipe Details" }}
            />
            <Stack.Screen name="UploadRecipe" component={UploadRecipe} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
