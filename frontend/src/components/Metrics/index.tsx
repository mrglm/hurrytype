import React from "react";
import { Setting } from "../../types";

type MetricsProps = { nbMistakes: number; wpm: number; selectedSetting: Setting };

const Metrics = ({ nbMistakes, wpm, selectedSetting }: MetricsProps): React.JSX.Element => {
  return (
    <h2>
      Mistakes: {nbMistakes}
      {selectedSetting.settingName === "Mistakes" ? ` / ${selectedSetting.settingValue}` : ""} | WPM: {wpm}
    </h2>
  );
};

export default Metrics;
