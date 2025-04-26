import React from "react";
import { Story } from "@/db/models";
import { formatDate } from "@/src/utils/dates";
import StoryCard from "../common/StoryCard";

type Props = {
  story: Story;
  onEdit: (storyId: number) => void;
  onDelete: (storyId: number, creationDate: string, callback: () => void) => void;
};


export default function StoryItem({
  story,
  onEdit = () => {},
  onDelete = () => {},
}: Props) {
  return (
    <StoryCard
      onDelete={(callback) => onDelete(story.id, story.creationDate, callback)}
      onEdit={() => onEdit(story.id)}
      href={{
        pathname: "/story/[id]",
        params: { id: story.id },
      }}
      title={story.name}
      date={`Created at: ${formatDate(story.creationDate)}`}
      enableEdit={true}
    />
  );
}