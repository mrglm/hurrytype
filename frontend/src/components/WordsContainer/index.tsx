import Word from "../Word";
import React from "react";

type WordsContainerProps = {
  challengeWords: string[];
  typedWords: string[];
  typedWordsIndex: number;
  incrementNbMistakes: () => void;
};

const WordsContainer = ({
  challengeWords,
  typedWords,
  typedWordsIndex,
  incrementNbMistakes,
}: WordsContainerProps): React.JSX.Element => {
  return (
    <div className="words-container">
      {challengeWords.map((_, wordIndex) => (
        <Word
          key={wordIndex}
          challengeWord={challengeWords[wordIndex]}
          typedWord={typedWords[wordIndex] ?? ""}
          progressStatus={wordIndex === typedWordsIndex ? "current" : wordIndex < typedWordsIndex ? "done" : ""}
          incrementNbMistakes={incrementNbMistakes}
        />
      ))}
    </div>
  );
};

export default WordsContainer;
