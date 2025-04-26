import { useEffect, useState } from "react";
import { Alert } from "react-native";
import {
  deleteAllHistory,
  deleteHistoy,
  getAllHistory,
} from "@/db/queries";

import { GroupedByHistory } from "@/db/models";
import { useNavigation } from "expo-router";

export default function queryHistory() {
  const [history, setHistory] = useState<GroupedByHistory | undefined>(
    undefined
  );
  const navigation = useNavigation();

  const [searchWord, setSearchWord] = useState<string>("");

  const search = (word: string) => {
    setSearchWord(word);
  };

  const loadData = async () => {
    console.log("load history");
    try {
      const data = await getAllHistory(searchWord);
      setHistory(data);
    } catch (error) {
      console.error("Error loading history data:", error);
      Alert.alert("Error", "Failed to load history data.");
    }
  };

  const onDelete = async (storyId: number) => {
    try {
      await deleteHistoy(storyId);
      await loadData();
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  const confirmDeleteHistory = (storyId: number, closeCallback: () => void) => {
    Alert.alert(
      "Delete History",
      "Are you sure you want to delete this history?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
            closeCallback();
          },
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDelete(storyId);
            closeCallback();
          },
        },
      ]
    );
  };

  const onDeleteAll = async () => {
    try {
      await deleteAllHistory();
      await loadData();
    } catch (error) {
      console.error("Error deleting history list:", error);
    }
  };

  const confirmDeleteAll = () => {
    Alert.alert(
      "Delete All History",
      "Are you sure you want to delete all history data?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDeleteAll();
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadData();

    const unsubscribe = navigation.addListener("focus", () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation, searchWord]);

  return {
    history,
    confirmDeleteHistory,
    confirmDeleteAll,
    search,
  };
}
