import React, { useRef } from "react";
import { FlatList, SafeAreaView, View, Text } from "react-native";

import AudioControlBar from "@/components/Story/AudioControlBar";
import SentenceList from "@/components/Story/SentenceList";

import audioControl from "@/hooks/story/audioControl";
import querySentence from "@/hooks/story/querySentence";
import { Sentence, Tag } from "@/db/models";
import { commonStyles } from "@/style/commonStyles";
import { useTheme } from "@/style/ThemeProvider";
import { ScrollView } from "react-native-gesture-handler";
import TagBar from "./TagBar";
import FilterModal from "../common/FilterBottomSlider";

type Props = {
  sentences: Sentence[];
  tags: Tag[];
  showTranslation: boolean;
  updateData: () => void;
  isFilterModalVisible: boolean;
  onFilterClose: () => void;
  filterOn?: Set<number>;
  filterBy: (tagId: number) => void;
};

export default function SentencesWithAudioController({
  sentences,
  tags,
  showTranslation,
  updateData,
  filterOn,
  filterBy,
  isFilterModalVisible,
  onFilterClose
}: Props) {
  const { theme } = useTheme();

  const flatListRef = useRef<FlatList>(null);
  const scrollToItem = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };
  const { toggleIsFavorite } = querySentence({ updateData });
  const {
    currentActive,
    isPlaying,
    isRepeat,
    playAudio,
    toggleRepeat,
    playSentence,
    playAll,
  } = audioControl({ sentences: sentences, scrollToItem });

  return (
    <SafeAreaView
      style={[
        commonStyles.scrollContainer,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <SentenceList
        flatListRef={flatListRef}
        sentences={sentences}
        isPlaying={isPlaying}
        currentActive={currentActive}
        play={playSentence}
        showTranslation={showTranslation}
        toggleFavorite={toggleIsFavorite}
      />
      <AudioControlBar
        playBackward={() =>
          currentActive !== null && playAudio(currentActive - 1)
        }
        playForward={() =>
          currentActive !== null && playAudio(currentActive + 1)
        }
        playAll={playAll}
        play={() =>
          currentActive !== null ? playAudio(currentActive) : playAudio(0)
        }
        toggleRepeat={toggleRepeat}
        playBackwardDisabled={currentActive === null || currentActive === 0}
        playForwardDisabled={
          currentActive === null ||
          (sentences && currentActive + 1 === sentences.length)
        }
        isPlaying={isPlaying}
        isRepeat={isRepeat}
      />
      <FilterModal
        isVisible={isFilterModalVisible}
        onClose={onFilterClose}
        tags={tags}
        filterBy={filterBy}
        filterOn={filterOn}
      />
    </SafeAreaView>
  );
}
