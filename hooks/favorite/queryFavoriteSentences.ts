import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "expo-router";
import { Sentence, Tag } from "@/db/models";
import { deleteAllFavoriteSentences, deleteIsFavoriteSentence, getAllFavoriteSentences } from "@/db/queries";

export default function queryFavoriteSentences() {
  const navigation = useNavigation();

  const [setenceTags, setSentenceTags] = useState<{sentences: Sentence[], tags: Tag[]} | undefined>(undefined);
  const [searchWord, setSearchWord] = useState<string>("");
  const [filterOn, setFilterOn] = useState<Set<number> | undefined>(undefined);

  const filterBy = (tagId: number) => {
    setFilterOn((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tagId)) {
        newSet.delete(tagId);
      } else {
        newSet.add(tagId);
      }
      return newSet;
    });
  };

  const loadData = async () => {
    console.log("load favorite sentences");
    try {
      const data = await getAllFavoriteSentences(searchWord, filterOn);
      setSentenceTags(data);
      if(filterOn === undefined) {
        setFilterOn(new Set(data.tags.map(x => x.id)));
      }
    } catch (error) {
      console.error("Error loading favorite sentences data:", error);
      Alert.alert("Error", "Failed to load favorite sentences data.");
    }
  };


  const search = (word: string) => {
    setSearchWord(word);
  };

  const onDelete = async (id: number) => {
    try {
      await deleteIsFavoriteSentence(id);
      await loadData();
    } catch (error) {
      console.error("Error deleting favorite sentence:", error);
    }
  };


  const confirmDeleteLookup = (
    id: number,
    closeCallback: () => void
  ) => {
    Alert.alert(
      "Remove Sentence from Favorites",
      "Are you sure you want to remove this sentence from Favorites?",
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
            onDelete(id);
            closeCallback();
          },
        },
      ]
    );
  };

  const onDeleteAll = async () => {
    try {
      await deleteAllFavoriteSentences();
      await loadData();
    } catch (error) {
      console.error("Error deleting lookups:", error);
    }
  };

  const confirmDeleteAll = () => {
    Alert.alert(
      "Remove All Sentence from Favorites",
      "Are you sure you want to remove all sentences from favorites?",
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
  }, [navigation, searchWord, filterOn]);

  return {
    setenceTags,
    filterBy,
    filterOn,
    confirmDeleteLookup,
    confirmDeleteAll,
    search,
    loadData
  };
}
