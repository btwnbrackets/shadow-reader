import React from "react";
import queryStory from "@/hooks/story/queryStory";
import SentencesWithAudioController from "@/components/Story/SentencesWithAudioController";
import header from "@/hooks/common/header";
import EmptyScreenMessage from "@/components/common/EmptyScreenMessage";

export default function StoryScreen() {
  const { storyDetails, loadData, search, filterBy, filterOn } = queryStory();
  const { showTranslation, isFilterModalVisible, onFilterClose } = header({
    isTranslation: true,
    isFilter: true,
    search
  });

    return storyDetails ? (
      <SentencesWithAudioController
        sentences={storyDetails?.sentences}
        showTranslation={showTranslation}
        updateData={loadData}
        tags={storyDetails.tags}
        isFilterModalVisible={isFilterModalVisible}
        onFilterClose={onFilterClose}
        filterBy={filterBy}
        filterOn={filterOn}
      />
    ) : (
      <EmptyScreenMessage message="Nothing to show yet. Add a sentence to the favorite list see it here :D" />
    );
}
