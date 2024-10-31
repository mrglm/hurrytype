import React from "react";

type SettingSelectorProps = {
  settingName: string;
  settingValue: number;
  setSetting: (option: number) => void;
  settingOptions: number[];
};

const SettingsSelector = ({
  settingName,
  settingValue,
  setSetting,
  settingOptions,
}: SettingSelectorProps): React.JSX.Element => {
  const handleButtonClick = (option: number) => {
    setSetting(option);
  };

  return (
    <h2 className="setting-selector">
      {`${settingName} options :`}
      {settingOptions.map((option) => (
        <button
          className={`setting-selector-btn ${option === settingValue ? "selected" : ""}`}
          onClick={() => handleButtonClick(option)}
          key={option}
        >
          {option}
        </button>
      ))}
    </h2>
  );
};

export default SettingsSelector;
