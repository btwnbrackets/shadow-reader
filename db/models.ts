export interface Story {
  id: number;
  name: string;
  creationDate: string;
  readDate: string;
}

export interface Sentence {
  id: number;
  content: string;
  audioUri: string;
  storyId: number;
  translation: string;
  isFavorite: number;
}

export interface StoryDetails {
  story: Story;
  sentences: Sentence[];
}

export interface GroupedByHistory {
  [key: string]: Story[];
}

export interface Tag {
  name: string;
  id: number;
}

export interface MetaData {
  key: string;
  value: string;
}