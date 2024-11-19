import React, { useEffect, useRef } from "react";

type LetterProps = {
  challengeChar: string;
  typedChar: string;
  updateNbMistakes: () => void;
};

const Letter = ({ challengeChar, typedChar, updateNbMistakes }: LetterProps): React.JSX.Element => {
  const status = !typedChar ? "" : !challengeChar ? "extra" : challengeChar === typedChar ? "correct" : "incorrect";

  const isMistakeRecorded = useRef(false);

  useEffect(() => {
    if ((status === "extra" || status === "incorrect") && !isMistakeRecorded.current) {
      updateNbMistakes();
      isMistakeRecorded.current = true;
    }
  }, [updateNbMistakes, status]);

  return (
    <span
      className={`letter ${!typedChar ? "" : !challengeChar ? "extra" : challengeChar === typedChar ? "correct" : "incorrect"}`}
    >
      {challengeChar || typedChar}
    </span>
  );
};

export default React.memo(Letter);
