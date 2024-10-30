export const handleSpacePress = (typedWords: string[]): string[] => {
  const updatedWords = [...typedWords];
  const lastTypedWord = updatedWords[updatedWords.length - 1];

  if (lastTypedWord === "") {
    updatedWords[updatedWords.length - 1] = " ";
  } else {
    updatedWords.push("");
  }
  return updatedWords;
};

export const handleBackspacePress = (typedWords: string[]): string[] => {
  const updatedWords = [...typedWords];
  const lastTypedWord = updatedWords[updatedWords.length - 1];

  if (lastTypedWord === "" && updatedWords.length > 1) {
    return updatedWords.slice(0, -1);
  }
  updatedWords[updatedWords.length - 1] = lastTypedWord.slice(0, -1);
  return updatedWords;
};

export const handleLetterPress = (typedWords: string[], typedChar: string): string[] => {
  const updatedWords = [...typedWords];
  updatedWords[updatedWords.length - 1] += typedChar;
  return updatedWords;
};
