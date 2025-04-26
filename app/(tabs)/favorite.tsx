import EmptyScreenMessage from "@/components/common/EmptyScreenMessage";
import SentencesWithAudioController from "@/components/Story/SentencesWithAudioController";
import header from "@/hooks/common/header";
import queryFavoriteSentences from "@/hooks/favorite/queryFavoriteSentences";

export default function FavoriteSentencesScreen() {
  const { sentences, confirmDeleteLookup, confirmDeleteAll, search, loadData } =
    queryFavoriteSentences();

  const { showTranslation } = header({
    confirmDeleteAll,
    search,
    isTranslation: true,
  });

  return sentences && sentences.length > 0 ? (
    <SentencesWithAudioController
      sentences={sentences}
      showTranslation={showTranslation}
      updateData={loadData}
    />
  ) : (
    <EmptyScreenMessage message="Nothing to show yet. Add a sentence to the favorite list see it here :D" />
  );
}
