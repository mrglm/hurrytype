export type Setting = {
  settingName: string;
  settingValue: number;
  setSetting: (option: number) => void;
  settingOptions: number[];
};
