import { createContext } from "react";

type WordsContextType = {
  challengeWords: string[];
  typedWords: string[];
};

const WordsContext = createContext<WordsContextType | null>(null);

export default WordsContext;
