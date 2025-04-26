import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { getStoryDetails } from "@/db/queries";
import { AppState, BackHandler } from "react-native";
import { useFocusEffect } from "expo-router";
import { addHistory } from "@/db/queries";
import { StoryDetails } from "@/db/models";
import React from "react";

export default function queryStory() {
  const { id } = useLocalSearchParams();
  const storyId = Number(id);
  const [storyDetails, setStoryDetails] = useState<StoryDetails | undefined>(
    undefined
  );
  const navigation = useNavigation();

  const [searchWord, setSearchWord] = useState<string>("");

  const search = (word: string) => {
    setSearchWord(word);
  };

  const loadData = async () => {
    console.log("load stories");
    try {
      const data = await getStoryDetails(storyId, searchWord);
      setStoryDetails(data);
      const title = data.story.name;
      navigation.setOptions({ title: title });
    } catch (error) {
      console.error("Error loading story data:", error);
      Alert.alert("Error", "Failed to load story list data.");
    }
  };

  const saveData = async () => {
    console.log("Saving data before exit...");
    const modifiedDate = new Date().toISOString();
    try {
      await addHistory(storyId, modifiedDate);
    } catch (error) {
      console.error(`error addHistory story id (${storyId}):`, error);
    }
  };

  useEffect(() => {
    loadData();

    const unsubscribe = navigation.addListener("focus", () => {
      loadData();
    });

    return unsubscribe;
  }, [storyId, navigation, searchWord]);

  // losing focus
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        saveData();
      };
    }, [storyId])
  );

  // app close or in bg
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        saveData();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, [storyId]);

  // back button
  useEffect(() => {
    const handleBackPress = () => {
      saveData();
      return false;
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
  }, [storyId]);

  return {
    storyId,
    storyDetails,
    loadData,
    search,
  };
}
