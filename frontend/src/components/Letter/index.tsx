import React, { useEffect, useRef } from "react";

type LetterProps = {
  challengeChar: string;
  typedChar: string;
  wordProgessStatus: string;
  updateNbMistakes: () => void;
};

const Letter = ({ challengeChar, typedChar, wordProgessStatus, updateNbMistakes }: LetterProps): React.JSX.Element => {
  const status =
    wordProgessStatus === "future" || (wordProgessStatus === "current" && !typedChar)
      ? ""
      : wordProgessStatus === "done" && !typedChar
        ? "skipped"
        : !challengeChar
          ? "extra"
          : challengeChar === typedChar
            ? "correct"
            : "incorrect";

  const isMistakeRecorded = useRef(false);

  useEffect(() => {
    if ((status === "extra" || status === "incorrect" || status === "skipped") && !isMistakeRecorded.current) {
      updateNbMistakes();
      isMistakeRecorded.current = true;
    }
  }, [updateNbMistakes, status]);

  return <span className={`letter ${status}`}>{challengeChar || typedChar}</span>;
};

export default React.memo(Letter);
