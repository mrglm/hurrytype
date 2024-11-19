import Word from "../Word";
import React, { useCallback, useEffect, useState } from "react";
import { Setting } from "../../types";
import { apiFetchWords } from "../../api";
import { isFinishedWords } from "../../utils";
import { isFinishedMistakes } from "../../utils";

type WordsContainerProps = {
  selectedSetting: Setting;
  isStarted: boolean;
  nbMistakes: number;
  setIsStarted: React.Dispatch<React.SetStateAction<boolean>>;
  isFinished: boolean;
  setIsFinished: React.Dispatch<React.SetStateAction<boolean>>;
  updateNbKeystrokes: (nbKeystrokeChange: number) => void;
  updateNbMistakes: () => void;
};

const WordsContainer = ({
  selectedSetting,
  nbMistakes,
  isStarted,
  setIsStarted,
  isFinished,
  setIsFinished,
  updateNbKeystrokes,
  updateNbMistakes,
}: WordsContainerProps): React.JSX.Element => {
  const [challengeWords, setChallengeWords] = useState<string[]>([]);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [typedWordsIndex, setTypedWordsIndex] = useState<number>(0);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setisLoading] = useState<boolean>(false);

  useEffect(() => {
    const async_helper = async () => {
      setisLoading(true);
      try {
        const fetchedWords = await apiFetchWords(
          selectedSetting.settingName === "Words" ? selectedSetting.settingValue : 1000,
        );
        setChallengeWords(fetchedWords);
        setTypedWords(fetchedWords.map(() => ""));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setisLoading(false);
      }
    };
    async_helper();
  }, [selectedSetting]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      let nbKeystrokeChange = 0;
      let updatedTypedWords = [...typedWords];
      const lastTypedWord = typedWords[typedWordsIndex];
      if (event.key === " ") {
        setIsStarted(true);
        event.preventDefault(); // avoid scrolling down
        if (lastTypedWord === "") {
          updatedTypedWords[typedWordsIndex] = " ";
        } else {
          setTypedWordsIndex((prev) => prev + 1);
        }
        nbKeystrokeChange = 1;
      } else if (event.key === "Backspace") {
        if (lastTypedWord === "" && typedWordsIndex != 0) {
          setTypedWordsIndex((prev) => prev - 1);
        } else {
          updatedTypedWords[typedWordsIndex] = lastTypedWord.slice(0, -1);
        }
        nbKeystrokeChange = -1;
      } else if (event.key.length === 1) {
        setIsStarted(true);
        event.preventDefault(); // avoid launching search
        updatedTypedWords[typedWordsIndex] += event.key;
        nbKeystrokeChange = 1;
      }
      setTypedWords(updatedTypedWords);
      updateNbKeystrokes(nbKeystrokeChange);
    },
    [setIsStarted, typedWords, typedWordsIndex, updateNbKeystrokes],
  );

  useEffect(() => {
    if (isFinished) {
      return;
    }

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isFinished, handleKeyPress]);

  useEffect(() => {
    const settingName = selectedSetting.settingName;
    if (
      isStarted &&
      ((settingName === "Words" && isFinishedWords(typedWords, challengeWords)) ||
        (settingName === "Mistakes" && isFinishedMistakes(nbMistakes, selectedSetting.settingValue)))
    ) {
      setIsFinished(true);
    }
  }, [
    challengeWords,
    isStarted,
    nbMistakes,
    selectedSetting.settingName,
    selectedSetting.settingValue,
    setIsFinished,
    typedWords,
  ]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="words-container">
      {challengeWords.map((_, wordIndex) => (
        <Word
          key={wordIndex}
          challengeWord={challengeWords[wordIndex]}
          typedWord={typedWords[wordIndex] ?? ""}
          progressStatus={wordIndex === typedWordsIndex ? "current" : wordIndex < typedWordsIndex ? "done" : ""}
          updateNbMistakes={updateNbMistakes}
        />
      ))}
    </div>
  );
};

export default WordsContainer;
