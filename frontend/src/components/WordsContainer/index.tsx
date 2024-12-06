import Word from "../Word";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Lines, Setting } from "../../types";
import { apiFetchWords } from "../../api";
import { isFinishedWords, measureWordWidth } from "../../utils";
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
  const [isLoading, setisLoading] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [lines, setLines] = useState<Lines>({
    firstDisplayedWord: 0,
    previousLines: [],
    currentLine: [],
    nextLines: [],
  });

  useEffect(() => {
    const async_helper = async () => {
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
      ((settingName === "Words" && isFinishedWords(typedWords, typedWordsIndex, challengeWords)) ||
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
    typedWordsIndex,
  ]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (!containerWidth || challengeWords.length === 0) {
      return;
    }

    const previousLines: string[][] = [];
    let currentLine: string[] = [];
    const nextLines: string[][] = [];
    let tempLine: string[] = [];
    let currentWidth = 0;
    let firstDisplayedWord = 0;

    challengeWords.forEach((word, wordIndex) => {
      const wordWidth = measureWordWidth(word, containerRef);

      if (currentWidth + wordWidth > containerWidth) {
        if (wordIndex <= typedWordsIndex) {
          previousLines.push(tempLine);
          firstDisplayedWord = wordIndex - tempLine.length;
        } else if (currentLine.length === 0) {
          currentLine = tempLine;
        } else {
          nextLines.push(tempLine);
        }
        tempLine = [];
        currentWidth = 0;
      }

      tempLine.push(word);
      currentWidth += wordWidth;
    });

    if (tempLine.length > 0) {
      if (currentLine.length === 0) {
        currentLine = tempLine;
      } else {
        nextLines.push(tempLine);
      }
    }

    if (nextLines.length === 0 && previousLines.length > 1) {
      firstDisplayedWord -= previousLines[previousLines.length - 2].length;
    }

    setLines({
      previousLines,
      currentLine,
      nextLines,
      firstDisplayedWord,
    });
  }, [challengeWords, containerWidth, typedWordsIndex]);

  if (isLoading) {
    return (
      <div className="words-container" ref={containerRef}>
        Loading...
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const currentLine = lines.currentLine;
  const previousFillerLine =
    lines.nextLines.length === 0 && lines.previousLines.length > 1
      ? lines.previousLines[lines.previousLines.length - 2]
      : [];
  const previousLine = lines.previousLines.length > 0 ? lines.previousLines[lines.previousLines.length - 1] : [];
  const nextLine = lines.nextLines.length > 0 ? lines.nextLines[0] : [];
  const nextFillerLine = lines.previousLines.length === 0 && lines.nextLines.length > 1 ? lines.nextLines[1] : [];

  const previousFillerLineIndex = lines.firstDisplayedWord;
  const previousLineIndex = previousFillerLineIndex + previousFillerLine.length;
  const currentLineIndex = previousLineIndex + previousLine.length;
  const nextLineIndex = currentLineIndex + currentLine.length;
  const nextFillerLineIndex = nextLineIndex + nextLine.length;

  return (
    <div className="words-container" ref={containerRef}>
      {previousFillerLine.length > 0 && (
        <div className="line previous-line filler-line">
          {previousFillerLine.map((word, wordIndex) => (
            <Word
              key={`${previousFillerLineIndex + wordIndex}`}
              challengeWord={word}
              typedWord={typedWords[previousFillerLineIndex + wordIndex] ?? ""}
              progressStatus="done"
              updateNbMistakes={updateNbMistakes}
            />
          ))}
        </div>
      )}

      {previousLine.length > 0 && (
        <div className="line previous-line">
          {previousLine.map((word, wordIndex) => (
            <Word
              key={`${previousLineIndex + wordIndex}`}
              challengeWord={word}
              typedWord={typedWords[previousLineIndex + wordIndex] ?? ""}
              progressStatus="done"
              updateNbMistakes={updateNbMistakes}
            />
          ))}
        </div>
      )}

      <div className="line current-line">
        {currentLine.map((word, wordIndex) => (
          <Word
            key={`${currentLineIndex + wordIndex}`}
            challengeWord={word}
            typedWord={typedWords[currentLineIndex + wordIndex] ?? ""}
            progressStatus={
              currentLineIndex + wordIndex === typedWordsIndex
                ? "current"
                : currentLineIndex + wordIndex < typedWordsIndex
                  ? "done"
                  : "future"
            }
            updateNbMistakes={updateNbMistakes}
          />
        ))}
      </div>

      {nextLine.length > 0 && (
        <div className="line next-line">
          {nextLine.map((word, wordIndex) => (
            <Word
              key={`${nextLineIndex + wordIndex}`}
              challengeWord={word}
              typedWord=""
              progressStatus="future"
              updateNbMistakes={updateNbMistakes}
            />
          ))}
        </div>
      )}

      {nextFillerLine.length > 0 && (
        <div className="line next-line">
          {nextFillerLine.map((word, wordIndex) => (
            <Word
              key={`${nextFillerLineIndex + wordIndex}`}
              challengeWord={word}
              typedWord=""
              progressStatus="future"
              updateNbMistakes={updateNbMistakes}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WordsContainer;
