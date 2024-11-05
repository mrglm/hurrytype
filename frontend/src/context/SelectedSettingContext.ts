import { createContext } from "react";
import { Setting } from "../types";

type SelectedSettingContextType = {
  selectedSetting: Setting;
  setSelectedSetting: React.Dispatch<React.SetStateAction<Setting>>;
};

const SettingsContext = createContext<SelectedSettingContextType | null>(null);

export default SettingsContext;
