import { useEffect, useState } from "react";
import "./App.css";
import axios, { AxiosResponse } from "axios";
import { handleSpacePress, handleBackspacePress, handleLetterPress } from "./handleKeyPressHelpers";
import WordsContainer from "./WordsContainer";
import Metrics from "./Metrics";
import SettingsSelector from "./SettingsSelector";
import {
  getColorBasedOnWpm,
  getWPM,
  isCorrectLetter,
  isCorrectSpace,
  isFinishedMistakes,
  isFinishedWords,
} from "./utils";
import { Setting } from "./types";
import SettingsContext from "./context/SelectedSettingContext";
import WordsContext from "./context/WordsContext";

const App = (): React.JSX.Element => {
  const [challengeWords, setChallengeWords] = useState<string[]>([]);
  const [typedWords, setTypedWords] = useState<string[]>([""]);

  const [timer, setTimer] = useState<number>(0);
  const [nbMistakes, setNbMistakes] = useState<number>(0);
  const [nbKeystrokes, setNbKeystrokes] = useState<number>(0);

  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setisLoading] = useState<boolean>(true);

  const [nbWordsSetting, setNbWordsSetting] = useState<number>(10);
  const [nbMistakesSetting, setNbMistakesSetting] = useState<number>(1);

  const settingsList = [
    {
      settingName: "Words",
      settingValue: 10,
      setSetting: setNbWordsSetting,
      settingOptions: [10, 25, 50, 100],
    },
    {
      settingName: "Mistakes",
      settingValue: 1,
      setSetting: setNbMistakesSetting,
      settingOptions: [1, 2, 5, 10],
    },
  ];

  const [selectedSetting, setSelectedSetting] = useState<Setting>(settingsList[0]);

  const fetchWords = async (nbWords: number): Promise<string[]> => {
    try {
      const response: AxiosResponse<{ randomWords: string[] }> = await axios.get("http://localhost:8080/api/words");
      const res = response.data.randomWords.slice(0, nbWords);
      return res;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  useEffect(() => {
    selectedSetting.setSetting(selectedSetting.settingValue);
    if (selectedSetting.settingName !== "Words") {
      setNbWordsSetting(100);
    }
  }, [selectedSetting]);

  useEffect(() => {
    const async_helper = async () => {
      setisLoading(true);
      try {
        const fetchedWords = await fetchWords(nbWordsSetting);
        setChallengeWords(fetchedWords);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setisLoading(false);
      }
    };
    async_helper();
  }, [nbWordsSetting, selectedSetting]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent): void => {
      if (isFinished) {
        return;
      }
      if (event.key === " ") {
        if (!isStarted) {
          setIsStarted(true);
        }
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
        if (!isStarted) {
          setIsStarted(true);
        }
        event.preventDefault(); // avoid launching search
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
    const settingName = selectedSetting.settingName;
    if (
      isStarted &&
      ((settingName === "Words" && isFinishedWords(typedWords, challengeWords)) ||
        (settingName === "Mistakes" && isFinishedMistakes(nbMistakes, nbMistakesSetting)))
    ) {
      setIsFinished(true);
    }
  }, [isStarted, typedWords, challengeWords, nbMistakes, nbMistakesSetting, selectedSetting]);

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
        <WordsContext.Provider value={{ challengeWords: challengeWords, typedWords: typedWords }}>
          <WordsContainer />
          <SettingsContext.Provider
            value={{ selectedSetting: selectedSetting, setSelectedSetting: setSelectedSetting }}
          >
            {isStarted && <Metrics nbMistakes={nbMistakes} wpm={getWPM(nbKeystrokes, timer)} />}
            {!isStarted && <SettingsSelector settingsList={settingsList} />}
          </SettingsContext.Provider>
        </WordsContext.Provider>
      </section>
    </main>
  );
};

export default App;
