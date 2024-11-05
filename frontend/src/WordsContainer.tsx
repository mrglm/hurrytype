import { useContext } from "react";
import Word from "./Word";
import WordsContext from "./context/WordsContext";

const WordsContainer = (): React.JSX.Element => {
  const context = useContext(WordsContext);
  if (!context) {
    throw new Error("SelectedSettingContext is null");
  }
  const { challengeWords, typedWords } = context;

  return (
    <div className="words-container">
      {challengeWords.map((challengeWord, challengeWordIndex) => (
        <Word
          key={challengeWordIndex}
          challengeWord={challengeWord}
          typedWord={typedWords[challengeWordIndex] ?? ""}
          progressStatus={
            challengeWordIndex === typedWords.length - 1
              ? "current"
              : challengeWordIndex < typedWords.length - 1
                ? "done"
                : ""
          }
        />
      ))}
    </div>
  );
};

export default WordsContainer;
