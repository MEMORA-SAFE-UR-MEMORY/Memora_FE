import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import React, { createContext, useContext, useEffect, useState } from "react";

type MusicContextType = {
  isPlaying: boolean;
  toggleMusic: () => void;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const player = useAudioPlayer(require("../../assets/music/music.mp3"));
  const status = useAudioPlayerStatus(player);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    (async () => {
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionModeAndroid: "duckOthers",
        interruptionMode: "mixWithOthers",
      });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("musicEnabled");
      if (saved !== null) {
        setIsPlaying(saved === "true");
      } else {
        await AsyncStorage.setItem("musicEnabled", "true");
        setIsPlaying(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!status.isLoaded) return;

    player.loop = true;
    player.volume = 1.0;

    if (isPlaying) {
      player.play();
    } else {
      player.pause();
    }

    AsyncStorage.setItem("musicEnabled", isPlaying ? "true" : "false");
  }, [isPlaying, status.isLoaded]);

  const toggleMusic = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used inside MusicProvider");
  return context;
};
