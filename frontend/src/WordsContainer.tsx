import React from "react";
import Word from "./Word";

type WordsContainerProps = {
  challengeWords: string[];
  typedWords: string[];
};

const WordsContainer = ({ challengeWords, typedWords }: WordsContainerProps): React.JSX.Element => {
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
