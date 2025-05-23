import HeaderBar from "@/components/common/HeaderBar";
import { useTheme } from "@/style/ThemeProvider";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

type Props = {
  confirmDeleteAll?: () => void;
  add?: () => void;
  searchFavorite?: (showFavorite: boolean) => void;
  search?: (word: string) => void;
  isTranslation?: boolean;
  isSort?: boolean;
  isFilter?:boolean;
};

export default function header({
  add,
  confirmDeleteAll,
  search,
  searchFavorite,
  isSort,
  isTranslation,
  isFilter
}: Props) {
  const navigation = useNavigation();
  const router = useRouter();

  const [showTranslation, setShowTranslation] = useState(true);
  const [isSortModalVisible, setIsSortModalVisible] = useState<boolean>(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showFavorite, setShowFavorite] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();

  const toggleTranslation = () => {
    setShowTranslation((prev) => !prev);
  };

  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
  };

  const toggleShowFavorite = () => {
    if (searchFavorite) {
      setShowFavorite((prev) => {
        searchFavorite(!prev);
        return !prev;
      });
    }
  };

  const toggleSort = () => {
    setIsSortModalVisible((prev) => !prev);
  };

  const onSortClose = () => {
    setIsSortModalVisible(false);
  };

  const toggleFilter = () => {
    console.log("toggle", isFilterModalVisible)
    setIsFilterModalVisible((prev) => !prev);
  };

  const onFilterClose = () => {
    setIsFilterModalVisible(false);
  };

  const setSearchWord = (newSearchTerm: string) => {
    if (search) {
      search(newSearchTerm);
    }
  };

  const headerRight = () =>
    HeaderBar({
      toggleTranslation: isTranslation? toggleTranslation: undefined,
      showTranslation,
      confirmDeleteAll,
      isSortModalVisible,
      isFilterModalVisible,
      toggleFilter: isFilter? toggleFilter: undefined,
      toggleSort: isSort? toggleSort: undefined,
      toggleSearch,
      showSearch,
      setSearchWord: search && setSearchWord,
      toggleShowFavorite: searchFavorite && toggleShowFavorite,
      showFavorite,
      add: add? add: undefined,
      theme: theme, 
      toggleTheme:toggleTheme,
    });

  useEffect(() => {
    const setNavBar = async () => {
      navigation.setOptions({ headerRight: headerRight });
    };
    setNavBar();
  }, [navigation, showTranslation, isSortModalVisible, isFilterModalVisible, showSearch, showFavorite, theme]);

  useEffect(() => {
    const keyboardListener = Keyboard.addListener("keyboardDidHide", () => {
      setShowSearch(false);
    });

    return () => keyboardListener.remove();
  }, [showSearch]);

  return {
    showTranslation,
    isSortModalVisible,
    isFilterModalVisible,
    onSortClose,
    onFilterClose,
    theme,
  };
}
