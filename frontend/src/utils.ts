export const isCorrectLetter = (challengeWords: string[], typedWords: string[]): boolean => {
  const typedWordIndex = typedWords.length - 1;
  const typedWord = typedWords[typedWordIndex];
  const typedCharIndex = typedWord.length - 1;
  const challengeWord = challengeWords[typedWordIndex];
  return typedCharIndex < challengeWord.length && typedWord[typedCharIndex] == challengeWord[typedCharIndex];
};

export const isCorrectSpace = (challengeWords: string[], typedWords: string[]): boolean => {
  const typedWordIndex = typedWords.length - 2;
  return typedWords[typedWordIndex].length >= challengeWords[typedWordIndex].length;
};

export const getColorBasedOnWPM = (wpm: number) => {
  const minWpm = 30;
  const maxWpm = 90;

  const factor = Math.max(0, Math.min(Math.min((wpm - minWpm) / (maxWpm - minWpm), 1)));

  const green = Math.round(factor * 255);
  const blue = Math.round(255 - factor * 255);

  return `rgb(0 ${green} ${blue} / 0.87)`;
};

export const getWPM = (nbKeystrokes: number, timer: number): number => {
  const wpm = Math.round((nbKeystrokes / 5 / timer) * 60);
  if (wpm === Infinity || isNaN(wpm)) {
    return 0;
  }
  return wpm;
};

export const isFinishedWords = (typedWords: string[], challengeWords: string[]): boolean => {
  const typedWordsLength = typedWords.length;
  const challengeWordsLength = challengeWords.length;
  return (
    typedWordsLength > challengeWordsLength ||
    (typedWordsLength === challengeWordsLength &&
      typedWords[typedWordsLength - 1].length === challengeWords[challengeWordsLength - 1].length)
  );
};

export const isFinishedMistakes = (nbMistakes: number, nbMistakesSetting: number): boolean => {
  return nbMistakes === nbMistakesSetting;
};
