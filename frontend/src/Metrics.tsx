import React, { useContext } from "react";
import SettingsContext from "./SelectedSettingContext";

type MetricsProps = { nbMistakes: number; wpm: number };

const Metrics = ({ nbMistakes, wpm }: MetricsProps): React.JSX.Element => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("SelectedSettingContext is null");
  }
  const selectedSetting = context.selectedSetting;

  return (
    <h2>
      Mistakes: {nbMistakes}
      {selectedSetting.settingName === "Mistakes" ? ` / ${selectedSetting.settingValue}` : ""} | WPM: {wpm}
    </h2>
  );
};

export default Metrics;
