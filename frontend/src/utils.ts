export const isCorrectLetter = (challengeWords: string[], typedWords: string[]): boolean => {
  const typedWordIndex = typedWords.length - 1;
  const typedWord = typedWords[typedWordIndex];
  const typedCharIndex = typedWord.length - 1;
  const challengeWord = challengeWords[typedWordIndex];
  return typedCharIndex < challengeWord.length && typedWord[typedCharIndex] == challengeWord[typedCharIndex];
};

export const isCorrectSpace = (challengeWords: string[], typedWords: string[]): boolean => {
  console.log(challengeWords, typedWords);
  const typedWordIndex = typedWords.length - 2;
  return typedWords[typedWordIndex].length >= challengeWords[typedWordIndex].length;
};
