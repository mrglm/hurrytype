import React from "react";
import Word from "./Word";

const WordsContainer: React.FC<{
  challengeWords: string[];
  typedWords: string[];
}> = ({ challengeWords, typedWords }) => {
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
