import EmptyScreenMessage from "@/components/common/EmptyScreenMessage";
import SentencesWithAudioController from "@/components/Story/SentencesWithAudioController";
import header from "@/hooks/common/header";
import queryFavoriteSentences from "@/hooks/favorite/queryFavoriteSentences";

export default function FavoriteSentencesScreen() {
  const {
    setenceTags,
    confirmDeleteLookup,
    confirmDeleteAll,
    search,
    loadData,
    filterBy,
    filterOn,
  } = queryFavoriteSentences();

  const { showTranslation, isFilterModalVisible, onFilterClose } = header({
    confirmDeleteAll,
    search,
    isTranslation: true,
    isFilter: true,
  });

  return setenceTags ? (
    <SentencesWithAudioController
      sentences={setenceTags?.sentences}
      showTranslation={showTranslation}
      updateData={loadData}
      tags={setenceTags.tags}
      isFilterModalVisible={isFilterModalVisible}
      onFilterClose={onFilterClose}
      filterBy={filterBy}
      filterOn={filterOn}
    />
  ) : (
    <EmptyScreenMessage message="Nothing to show yet. Add a sentence to the favorite list see it here :D" />
  );
}
