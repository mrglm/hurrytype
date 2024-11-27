export type Setting = {
  settingName: string;
  settingValue: number;
  settingOptions: number[];
};

export type Lines = {
  firstDisplayedWord: number;
  previousLines: string[][];
  currentLine: string[];
  nextLines: string[][];
};
