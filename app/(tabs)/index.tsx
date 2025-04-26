import React from "react";
import { useRouter } from "expo-router";

import VerticalStories from "@/components/StoryList/VerticalStories";
import queryIndex from "@/hooks/index/queryIndex";
import header from "@/hooks/common/header";
import SortModal from "@/components/common/SortBottomSlider";
import EmptyScreenMessage from "@/components/common/EmptyScreenMessage";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { commonStyles } from "@/style/commonStyles";
import { Alert } from "react-native";

export default function IndexScreen() {
  const router = useRouter();

  const {
    stories,
    confirmDeleteStory,
    confirmDeleteAll,
    search,
    sortBy,
    columns,
    sortedColumn,
  } = queryIndex();

  const { isModalVisible, onSortClose } = header({
    confirmDeleteAll,
    search,
    isSort: true,
    add: () => router.push("/upload")
  });

  return stories && stories.length > 0 ? (
    <ScreenWrapper style={commonStyles.scrollContainer}>
      <VerticalStories
        stories={stories}
        onEdit={() => {
          Alert.alert("Sorry!", "This feature is not implemented yet")
        }}
        onDelete={confirmDeleteStory}
      />
      <SortModal
        isVisible={isModalVisible}
        onClose={onSortClose}
        columns={columns}
        sortBy={sortBy}
        sortedColumn={sortedColumn}
      />
    </ScreenWrapper>
  ) : (
    <EmptyScreenMessage message="Nothing to show yet. Add a story to see it here :D" />
  );
}
