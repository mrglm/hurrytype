import React from "react";

type LetterProps = {
  char: string;
  correctStatus: string;
};

const Letter = ({ char, correctStatus }: LetterProps): React.JSX.Element => {
  return <span className={`letter${correctStatus}`}>{char}</span>;
};

export default React.memo(Letter);
