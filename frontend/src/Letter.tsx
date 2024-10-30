import React from "react";

interface LetterProps {
  char: string;
  correctStatus: string;
}

const Letter: React.FC<LetterProps> = ({ char, correctStatus }) => {
  return <span className={correctStatus}>{char}</span>;
};

export default React.memo(Letter);
