import React from "react";
import Letter from "../Letter";

type WordProps = {
  challengeWord: string;
  typedWord: string;
  progressStatus: string;
  updateNbMistakes: () => void;
};

const Word = ({ challengeWord, typedWord, progressStatus, updateNbMistakes }: WordProps): React.JSX.Element => {
  const maxIndex = Math.max(challengeWord.length, typedWord.length);
  return (
    <span className={`word ${progressStatus}`}>
      {[...Array(maxIndex)].map((_, index) => (
        <Letter
          key={`${index}-${challengeWord.charAt(index)}-${typedWord.charAt(index)}`}
          challengeChar={challengeWord.charAt(index)}
          typedChar={typedWord.charAt(index)}
          wordProgessStatus={progressStatus}
          updateNbMistakes={updateNbMistakes}
        />
      ))}
    </span>
  );
};

export default React.memo(Word);
