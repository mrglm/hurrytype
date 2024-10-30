import { useEffect, useState } from "react";
import "./App.css";
import axios, { AxiosResponse } from "axios";
import { handleSpacePress, handleBackspacePress, handleLetterPress } from "./handleKeyPressHelpers";
import WordsContainer from "./WordsContainer";
import { isCorrectLetter, isCorrectSpace } from "./utils";

const App: React.FC = () => {
  const [challengeWords, setChallengeWords] = useState<string[]>([]);
  const [typedWords, setTypedWords] = useState<string[]>([""]);

  const [timer, setTimer] = useState<number>(0);
  const [nbMistakes, setNbMistakes] = useState<number>(0);
  const [nbKeystrokes, setNbKeystrokes] = useState<number>(0);

  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setisLoading] = useState<boolean>(true);

  const fetchWords = async (): Promise<string[]> => {
    try {
      const response: AxiosResponse<{ randomWords: string[] }> = await axios.get("http://localhost:8080/api");
      return response.data.randomWords;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const getColorBasedOnWpm = (wpm: number) => {
    if (isNaN(wpm) || wpm === Infinity) {
      return "rgb(255 255 255 / 0.87)";
    }
    const minWpm = 30;
    const maxWpm = 90;

    const factor = Math.max(0, Math.min(Math.min((wpm - minWpm) / (maxWpm - minWpm), 1)));

    const green = Math.round(factor * 255);
    const blue = Math.round(255 - factor * 255);

    console.log(wpm, factor, green, blue);

    return `rgb(0 ${green} ${blue} / 0.87)`;
  };

  const getWPM = (nbKeystrokes: number, timer: number): number => {
    return Math.round((nbKeystrokes / 5 / timer) * 60);
  };

  useEffect(() => {
    const async_helper = async () => {
      setisLoading(true);
      try {
        const fetchedWords = await fetchWords();
        setChallengeWords(fetchedWords);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setisLoading(false);
      }
    };

    async_helper();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent): void => {
      if (!isStarted) {
        setIsStarted(true);
      }
      if (isFinished) {
        return;
      }
      if (event.key === " ") {
        event.preventDefault(); // avoid scrolling down
        const updatedTypedWords = handleSpacePress(typedWords);
        setTypedWords(updatedTypedWords);
        setNbKeystrokes((prev) => prev + 1);
        if (!isCorrectSpace(challengeWords, updatedTypedWords)) {
          setNbMistakes((prev) => prev + 1);
        }
      } else if (event.key === "Backspace") {
        setTypedWords(handleBackspacePress(typedWords));
        setNbKeystrokes((prev) => prev - 1);
      } else if (event.key.length === 1) {
        const updatedTypedWords = handleLetterPress(typedWords, event.key);
        setTypedWords(updatedTypedWords);
        setNbKeystrokes((prev) => prev + 1);
        if (!isCorrectLetter(challengeWords, updatedTypedWords)) {
          setNbMistakes((prev) => prev + 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isFinished, isStarted, challengeWords, typedWords]);

  useEffect(() => {
    if (isStarted && !isFinished) {
      const interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isFinished, isStarted]);

  useEffect(() => {
    const typedWordsLength = typedWords.length;
    const challengeWordsLength = challengeWords.length;
    if (
      !isLoading &&
      (typedWordsLength > challengeWordsLength ||
        (typedWordsLength === challengeWordsLength &&
          typedWords[typedWordsLength - 1].length === challengeWords[challengeWordsLength - 1].length))
    ) {
      setIsFinished(true);
    }
  }, [isLoading, typedWords, challengeWords]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main>
      <h1 style={{ color: isStarted ? getColorBasedOnWpm(getWPM(nbKeystrokes, timer)) : "rgb(255 255 255 / 0.87)" }}>
        HurryType
      </h1>
      <section>
        <h2>{timer}</h2>
        <WordsContainer challengeWords={challengeWords} typedWords={typedWords} />
        {isStarted && (
          <h2>
            Mistakes: {nbMistakes} | WPM: {getWPM(nbKeystrokes, timer)}
          </h2>
        )}
      </section>
    </main>
  );
};

export default App;
