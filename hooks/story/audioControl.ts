import { useEffect, useState, useRef } from "react";
import { Alert, AppState, BackHandler } from "react-native";
import { Audio } from "expo-av";
import { Sentence } from "@/db/models";
import { useFocusEffect, useNavigation } from "expo-router";
import React from "react";

type Props = {
  sentences: Sentence[] | undefined;
  scrollToItem: (index: number) => void;
};

export default function audioControl({ sentences, scrollToItem }: Props) {
  const navigation = useNavigation();

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentActive, setActive] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const playControls = useRef<(newSound: Audio.Sound) => void>(() => {});

  const stopSound = () => {
    if (sound) {
      setIsPlaying(false);
      sound.stopAsync();
      sound.unloadAsync();
      setSound(null);
    }
  };
  useEffect(() => {
    return () => {
      stopSound();
    };
  }, [sound]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      stopSound();
    });

    return unsubscribe;
  }, [sound, navigation]);

  // losing focus
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        stopSound();
      };
    }, [sound])
  );

  // app close or in bg
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        stopSound();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, [sound]);

  // back button
  useEffect(() => {
    const handleBackPress = () => {
      stopSound();
      return false;
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
  }, [sound]);

  useEffect(() => {
    playControls.current = (newSound: Audio.Sound) => {
      if (sentences && currentActive !== null) {
        if (isPlayingAll) {
          // play all
          newSound.unloadAsync();
          setSound(null);
          setIsPlaying(false);
          let next = currentActive + 1;
          if (isRepeat) {
            // loop to start if repeat
            next = next % sentences.length;
          }
          if (next < sentences.length) {
            playAudio(next);
          }
        } else {
          // single track
          if (isRepeat) {
            // repeat
            newSound.replayAsync();
          } else {
            // no repeat
            newSound.unloadAsync();
            setSound(null);
            setIsPlaying(false);
          }
        }
      }
    };
  }, [sentences, currentActive, isPlayingAll, isRepeat]);

  const playAudio = async (id: number) => {
    if (!sentences || id < 0 || id >= sentences.length) {
      return;
    }
    console.log("Playing audio:", {
      id,
      currentActive,
      isPlayingAll,
      isRepeat,
    });
    const fileUri: string = sentences[id].audioUri;
    try {
      scrollToItem(id);
      if (sound) {
        if (id !== currentActive) {
          await sound.unloadAsync();
          setSound(null);
          setActive(null);
        } else {
          if (isPlaying) {
            await sound.pauseAsync();
            setIsPlaying(false);
            return;
          } else {
            await sound.playAsync();
            setIsPlaying(true);
            return;
          }
        }
      }

      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: fileUri,
      });

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setIsPlaying(true);
          if (status.didJustFinish) {
            if (playControls.current) {
              playControls.current(newSound);
            }
          }
        }
      });

      setSound(newSound);
      setActive(id);
      await newSound.playAsync();
    } catch (error) {
      console.error("Error playing audio:", error);
      Alert.alert("Error", "Failed to play audio.");
    }
  };

  const toggleRepeat = () => setIsRepeat((prev) => !prev);

  const playSentence = (index: number) => {
    setIsPlayingAll(false);
    playAudio(index);
  };

  const playAll = () => {
    let idx = isPlayingAll ? 0 : currentActive !== null ? currentActive + 1 : 0;
    setIsPlayingAll(true);
    playAudio(idx);
  };

  return {
    sound,
    currentActive,
    isPlaying,
    isPlayingAll,
    isRepeat,
    playAudio,
    toggleRepeat,
    playSentence,
    playAll,
  };
}
