import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BarCodeScanner from "../screens/BarCodeScanner";
import ProfileScreen from "../screens/ProfileScreen";
import RecipesScreen from "../screens/RecipesScreen";
import SavedScreen from "../screens/SavedScreen";
import { Ionicons } from "@expo/vector-icons";
const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Recipes") {
            iconName = focused ? "restaurant" : "restaurant-outline";
          } else if (route.name === "Saved") {
            iconName = focused ? "bookmark" : "bookmark-outline";
          } else if (route.name === "Scanner") {
            iconName = focused ? "scan" : "scan-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#552900",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Recipes" component={RecipesScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Scanner" component={BarCodeScanner} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
