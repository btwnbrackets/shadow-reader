import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { deleteAllStory, deleteStory, getAllStories } from "@/db/queries";

import { Story } from "@/db/models";
import { useNavigation } from "expo-router";
import * as FileSystem from "expo-file-system";

export default function queryIndex() {
  const navigation = useNavigation();

  const [stories, setStories] = useState<Story[] | undefined>();
  const [searchWord, setSearchWord] = useState<string>("");

  const [sortedColumn, setSortedColumn] = useState<{
    column: string;
    isAsc: boolean;
  }>({ column: "creationDate", isAsc: false });

  const columns = [
    { key: "readDate", value: "Most Recently Read" },
    { key: "creationDate", value: "Most Recently Added" },
    { key: "name", value: "Alphabetically" },
  ];


  const search = (word: string) => {
    setSearchWord(word);
  };

  const sortBy = (column: string) => {
    setSortedColumn((prev) => {
      return {
        column: column,
        isAsc: prev.column == column ? !prev.isAsc : false,
      };
    });
  };

  const loadData = async () => {
    console.log("load history");
    try {
      const data = await getAllStories(sortedColumn.column, sortedColumn.isAsc, searchWord);
      setStories(data);
    } catch (error) {
      console.error("Error loading stories data:", error);
      Alert.alert("Error", "Failed to load story data.");
    }
  };

  const onDelete = async (storyId: number, creationDate: string) => {
    try {
      // delete audio folder and db entry
      const storyDir = `${FileSystem.documentDirectory}story/${creationDate}`;
      await FileSystem.deleteAsync(storyDir);
      await deleteStory(storyId);
      await loadData();
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  const confirmDeleteStory = (
    storyId: number,
    creationDate: string,
    closeCallback: () => void
  ) => {
    Alert.alert(
      "Delete Story",
      "Are you sure you want to delete this story? This will also delete its sentences and audio files.",
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
            onDelete(storyId, creationDate);
            closeCallback();
          },
        },
      ]
    );
  };

  const onDeleteAll = async () => {
    try {
      // delete audio folder and db entry
      const storyDir = `${FileSystem.documentDirectory}story/`;
      const info = await FileSystem.getInfoAsync(storyDir);
      if(info.exists) {
        await FileSystem.deleteAsync(storyDir);
        await deleteAllStory();
        await loadData();
      }
    } catch (error) {
      console.error("Error deleting all stories:", error);
    }
  };

  const confirmDeleteAll = () => {
    Alert.alert(
      "Delete All Stories",
      "Are you sure you want to delete all story data?",
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
  }, [navigation, searchWord, sortedColumn]);

  return {
    stories,
    confirmDeleteStory,
    confirmDeleteAll,
    search,
    sortBy,
    columns,
    sortedColumn,
  };
}
