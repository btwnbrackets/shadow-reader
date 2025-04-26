import React, { useEffect, useState } from "react";
import { ActivityIndicator, StatusBar } from "react-native";
import { Stack } from "expo-router";
import { setupDatabase } from "@/db/database";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import EmptyScreenMessage from "@/components/common/EmptyScreenMessage";
import { ThemeProvider, useTheme } from "@/style/ThemeProvider";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function Layout() {
  console.log("starting...");

  const [dbInitialized, setDbInitialized] = useState(false);
  const [fontsLoaded] = useFonts({
    NotoSerifJP: require("../assets/fonts/NotoSerifJP-VariableFont_wght.ttf"),
  });
  console.log("font...");

  useEffect(() => {
    const initDb = async () => {
      try {
        console.log("db...");
        await setupDatabase();
        console.log("db done");
        setDbInitialized(true);
      } catch (error) {
        console.error("Database initialization error:", error);
      }
    };

    initDb();
  }, []);

  if (!dbInitialized || !fontsLoaded) {
    return (
      <ThemeProvider>
        <EmptyScreenMessage message="Initializing database...">
          <ActivityIndicator size="large" />
        </EmptyScreenMessage>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

function App() {
  const { theme } = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle={theme.mode === "dark" ? "light-content" : "dark-content"} backgroundColor={theme.background}  />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.surface },
          headerTintColor: theme.text,
          headerTitleAlign: "left"
        }}
      >
        <Stack.Screen name="(tabs)" options={{ title: "Main", headerShown: false }} />
        <Stack.Screen name="processing" options={{ title: "Processing" }} />
        <Stack.Screen name="upload" options={{ title: "Uploading" }} />
        <Stack.Screen name="story/[id]" options={{ title: "Story Details" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
