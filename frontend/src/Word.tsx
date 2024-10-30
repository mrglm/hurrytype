import React from "react";
import Letter from "./Letter";

const Word: React.FC<{
  challengeWord: string;
  typedWord: string;
  progressStatus: string;
}> = ({ challengeWord, typedWord, progressStatus }) => {
  return (
    <span className={`word ${progressStatus}`}>
      {challengeWord.split("").map((challengeChar, challengeCharIndex) => {
        const typedChar = typedWord.charAt(challengeCharIndex);
        const isCorrect = challengeChar === typedChar;
        return (
          <Letter
            key={challengeCharIndex}
            char={challengeChar}
            correctStatus={progressStatus === "" || typedChar === "" ? "" : isCorrect ? " correct" : " incorrect"}
          />
        );
      })}
      {typedWord.length > challengeWord.length &&
        typedWord
          .slice(challengeWord.length)
          .split("")
          .map((extraChar, index) => (
            <Letter key={challengeWord.length - 1 + index} char={extraChar} correctStatus={" incorrect"} />
          ))}
    </span>
  );
};

export default React.memo(Word);
