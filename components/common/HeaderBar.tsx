import { View, StyleSheet, TextInput } from "react-native";
import TapIcon from "./TapIcon";
import React from "react";
import { ThemeType } from "@/style/theme";
import { commonStyles } from "@/style/commonStyles";

type Props = {
  toggleTranslation?: () => void;
  showTranslation?: boolean;
  toggleSort?: () => void;
  toggleFilter?: () => void;
  isFilterModalVisible?: boolean;
  isSortModalVisible?: boolean;
  toggleSearch?: () => void;
  showSearch?: boolean;
  confirmDeleteAll?: () => void;
  setSearchWord?: (newSearchTerm: string) => void;
  showFavorite?: boolean;
  toggleShowFavorite?: () => void;
  add?: () => void;
  theme: ThemeType;
  toggleTheme: () => void;
};

export default function HeaderBar({
  toggleTranslation,
  showTranslation,
  confirmDeleteAll,
  isSortModalVisible,
  toggleSort,
  showSearch,
  setSearchWord,
  toggleSearch,
  showFavorite,
  toggleShowFavorite,
  add,
  toggleTheme,
  theme,
  toggleFilter,
  isFilterModalVisible,
}: Props) {
  const showSearchBar = toggleSearch && setSearchWord && showSearch;
  return (
    <View style={styles.container}>
      {showSearchBar ? (
        <TextInput
          placeholderTextColor={theme.text + "99"}
          autoFocus={true}
          style={[
            commonStyles.inputText,
            styles.searchInput,
            {
              backgroundClip: theme.background,
              color: theme.text,
              borderColor: theme.text,
              borderWidth: 1,
              ...commonStyles.borderRadiusCard,
            },
          ]}
          placeholder="Search..."
          onEndEditing={(event) => {
            setSearchWord(event.nativeEvent.text);
            if (event.nativeEvent.text === "") {
              toggleSearch();
            }
          }}
        />
      ) : (
        <>
          {toggleSearch && setSearchWord && (
            <TapIcon
              style={styles.iconStyles}
              iconName={"magnify"}
              onTap={toggleSearch}
            />
          )}
          {toggleTranslation && (
            <TapIcon
              style={styles.iconStyles}
              onTap={toggleTranslation}
              iconName={showTranslation ? "translate" : "translate-off"}
              color={showTranslation ? theme.accent : undefined}
            />
          )}
          {toggleSort && (
            <TapIcon
              style={styles.iconStyles}
              iconName="sort"
              onTap={toggleSort}
              color={isSortModalVisible ? theme.accent : undefined}
            />
          )}
          {toggleFilter && (
            <TapIcon
              style={styles.iconStyles}
              iconName="filter"
              onTap={toggleFilter}
              color={isFilterModalVisible ? theme.accent : undefined}
            />
          )}
          {add && (
            <TapIcon style={styles.iconStyles} iconName="plus" onTap={add} />
          )}
          {toggleShowFavorite && (
            <TapIcon
              style={styles.iconStyles}
              iconName={"star"}
              onTap={toggleShowFavorite}
              color={showFavorite ? theme.accent : undefined}
            />
          )}
          {confirmDeleteAll && (
            <TapIcon
              iconName="delete"
              onTap={confirmDeleteAll}
              color={theme.red}
              style={styles.iconStyles}
            />
          )}
          <TapIcon
            iconName={
              theme.mode === "dark"
                ? "moon-waxing-crescent"
                : "white-balance-sunny"
            }
            onTap={toggleTheme}
            style={styles.iconStyles}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    ...commonStyles.padS,
  },
  iconStyles: {
    ...commonStyles.padSH,
  },
  searchInput: {
    flex: 1,
  },
});
