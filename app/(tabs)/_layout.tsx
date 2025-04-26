import { useTheme } from "@/style/ThemeProvider";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.surface },
        headerTitleAlign: "left",
        headerTintColor: theme.text,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderColor: "transparent",
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.gray,
      }}
    >
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="information" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="history" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: "Favorite",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="star" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
