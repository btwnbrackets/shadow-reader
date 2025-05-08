
export enum Status {
  Succeed,
  Error,
  Processing,
  Idle,
}

export type ParsedCSVType = string[] | { [key: string]: string };

export type ColExampleType = { columns: string[]; examples: ParsedCSVType };

export type ColMapType = {
  sentence: number;
  audio: number;
  meaning: number;
  tags: number;
};

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
  tags: Tag[];
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