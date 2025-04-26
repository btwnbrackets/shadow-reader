import { Alert, Linking } from "react-native";
import { useEffect, useState } from "react";
import Constants from "expo-constants";

export default function queryUpdateDictionary() {
  const currentVersion = Constants.expoConfig?.version ?? "1.0.0";

  const checkForUpdate = async () => {
    try {
      const res = await fetch(
        "https://api.github.com/repos/btwnbrackets/shadow-reader/releases/latest"
      );
      const data = await res.json();

      console.log(data)

      const latestVersion = data.tag_name?.replace(/^v/, "") ?? "0.0.0";
      const releaseUrl = data.html_url;

      if (isNewerVersion(latestVersion, currentVersion)) {
        Alert.alert(
          "Update Available",
          `A new version (${latestVersion}) is available!`,
          [
            { text: "Cancel", style: "cancel" },
            { text: "View", onPress: () => Linking.openURL(releaseUrl) },
          ]
        );
      } else {
        Alert.alert(
          "You're up to date!",
          `Version ${currentVersion} is the latest.`
        );
      }
    } catch (err) {
      Alert.alert("Error", "Failed to check for updates.");
      console.error(err);
    }
  };

  const isNewerVersion = (latest: string, current: string): boolean => {
    const latestParts = latest.split(".").map(Number);
    const currentParts = current.split(".").map(Number);

    for (
      let i = 0;
      i < Math.max(latestParts.length, currentParts.length);
      i++
    ) {
      const l = latestParts[i] ?? 0;
      const c = currentParts[i] ?? 0;
      if (l > c) return true;
      if (l < c) return false;
    }
    return false;
  };

  return {
    checkForUpdate,
  };
}
