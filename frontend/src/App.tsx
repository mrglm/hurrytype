import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import Timer from "./components/Timer";
import WordsContainer from "./components/WordsContainer/index";
import Metrics from "./components/Metrics/index";
import SettingsSelector from "./components/SettingsSelectors/index";
import { getColorBasedOnWpm, getWPM, isFinishedMistakes, isFinishedWords } from "./utils";
import { Setting } from "./types";
import { apiFetchResults, apiFetchWords, apiSendResult, ResultData } from "./api";

const App = (): React.JSX.Element => {
  // app status states
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setisLoading] = useState<boolean>(false);

  // game status states
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [challengeWords, setChallengeWords] = useState<string[]>([]);
  const timerRef = useRef<number>(0);

  // user input states
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [typedWordsIndex, setTypedWordsIndex] = useState<number>(0);
  const [nbMistakes, setNbMistakes] = useState<number>(0);
  const [nbKeystrokes, setNbKeystrokes] = useState<number>(0);
  const incrementNbMistakes = useCallback(() => {
    setNbMistakes((prev) => prev + 1);
  }, []);

  // settings states
  const settingsList = [
    {
      settingName: "Words",
      settingValue: 10,
      settingOptions: [10, 25, 50, 100, 1000],
    },
    {
      settingName: "Mistakes",
      settingValue: 1,
      settingOptions: [1, 2, 5, 10],
    },
  ];
  const [selectedSetting, setSelectedSetting] = useState<Setting>(settingsList[0]);

  const [results, setResults] = useState<ResultData[]>([]);

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
      let keystrokeChange = 0;
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
        keystrokeChange = 1;
      } else if (event.key === "Backspace") {
        if (lastTypedWord === "" && typedWordsIndex != 0) {
          setTypedWordsIndex((prev) => prev - 1);
        } else {
          updatedTypedWords[typedWordsIndex] = lastTypedWord.slice(0, -1);
        }
        keystrokeChange = -1;
      } else if (event.key.length === 1) {
        setIsStarted(true);
        event.preventDefault(); // avoid launching search
        updatedTypedWords[typedWordsIndex] += event.key;
        keystrokeChange = 1;
      }
      setTypedWords(updatedTypedWords);
      setNbKeystrokes((prev) => prev + keystrokeChange);
    },
    [setIsStarted, typedWords, typedWordsIndex],
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
  }, [challengeWords, isStarted, nbMistakes, selectedSetting.settingName, selectedSetting.settingValue, typedWords]);

  useEffect(() => {
    const fetchResults = async () => {
      const results = await apiFetchResults();
      setResults(results);
    };

    if (isFinished && selectedSetting.settingName === "Words") {
      const resultData = {
        username: "Anonymous",
        nbWords: selectedSetting.settingValue,
        nbMistakes: nbMistakes,
        timer: timerRef.current,
      };

      apiSendResult(resultData);
      fetchResults();
    }
  }, [isFinished, nbMistakes, selectedSetting, timerRef]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main>
      <h1
        style={{
          color: isStarted ? getColorBasedOnWpm(getWPM(nbKeystrokes, timerRef.current)) : "rgb(255 255 255 / 0.87)",
        }}
      >
        HurryType
      </h1>
      <section>
        {!isFinished ? (
          <>
            <Timer isStarted={isStarted} isFinished={isFinished} timerRef={timerRef} />
            <WordsContainer
              challengeWords={challengeWords}
              typedWords={typedWords}
              typedWordsIndex={typedWordsIndex}
              incrementNbMistakes={incrementNbMistakes}
            />
            {isStarted ? (
              <Metrics
                nbMistakes={nbMistakes}
                wpm={getWPM(nbKeystrokes, timerRef.current)}
                selectedSetting={selectedSetting}
              />
            ) : (
              <SettingsSelector
                selectedSetting={selectedSetting}
                setSelectedSetting={setSelectedSetting}
                settingsList={settingsList}
              />
            )}
          </>
        ) : (
          <>
            <h2>Results</h2>
            <ul>
              {results.map((result, index) => (
                <li key={index}>
                  {result.username} - {result.nbWords} words - {result.nbMistakes} mistakes - {result.timer}s
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  );
};

export default App;
