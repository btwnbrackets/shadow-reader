import { toggleIsFavoriteSentence } from "@/db/queries";

type Props = {
  updateData: () => void;
};

export default function querySentence({ updateData }: Props) {
  const toggleIsFavorite = async (id: number) => {
    try {
      await toggleIsFavoriteSentence(id);
      updateData();
    } catch (error) {
      console.error("Error toggle favorite:", error);
    }
  };
  return {
    toggleIsFavorite,
  };
}
