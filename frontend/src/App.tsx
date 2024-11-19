import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import Timer from "./components/Timer";
import WordsContainer from "./components/WordsContainer/index";
import Metrics from "./components/Metrics/index";
import SettingsSelector from "./components/SettingsSelectors/index";
import { getColorBasedOnWPM, getWPM } from "./utils";
import { Setting } from "./types";
import { apiFetchResults, apiSendResult, ResultData } from "./api";

const App = (): React.JSX.Element => {
  // game status states
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const timerRef = useRef<number>(0);

  // user input states
  const updateNbKeystrokes = useCallback((nbKeystrokeChange: number) => {
    setNbKeystrokes((prev) => prev + nbKeystrokeChange);
  }, []);
  const [nbKeystrokes, setNbKeystrokes] = useState<number>(0);
  const [nbMistakes, setNbMistakes] = useState<number>(0);
  const updateNbMistakes = useCallback(() => {
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

  return (
    <main>
      <h1
        style={{
          color: isStarted ? getColorBasedOnWPM(getWPM(nbKeystrokes, timerRef.current)) : "rgb(255 255 255 / 0.87)",
        }}
      >
        HurryType
      </h1>
      <section>
        {!isFinished ? (
          <>
            <Timer isStarted={isStarted} isFinished={isFinished} timerRef={timerRef} />
            <WordsContainer
              selectedSetting={selectedSetting}
              nbMistakes={nbMistakes}
              isStarted={isStarted}
              setIsStarted={setIsStarted}
              isFinished={isFinished}
              setIsFinished={setIsFinished}
              updateNbKeystrokes={updateNbKeystrokes}
              updateNbMistakes={updateNbMistakes}
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
