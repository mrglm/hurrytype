import { useContext } from "react";
import { Setting } from "./types";
import SettingsContext from "./context/SelectedSettingContext";

type SettingSelectorProps = {
  settingsList: Setting[];
};

const SettingsSelector = ({ settingsList }: SettingSelectorProps): React.JSX.Element => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("SelectedSettingContext is null");
  }
  const { selectedSetting, setSelectedSetting } = context;

  const handleSettingChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedSetting(settingsList[parseInt(event.target.value)]);
  };

  const handleOptionChange = (option: number): void => {
    setSelectedSetting({
      ...selectedSetting,
      settingValue: option,
    });
  };

  return (
    <h2 className="settings-selector">
      <select onChange={handleSettingChange}>
        {settingsList.map((setting, index) => (
          <option
            key={index}
            value={index}
            className={selectedSetting.settingName === setting.settingName ? "selected" : ""}
          >
            {setting.settingName}
          </option>
        ))}
      </select>
      {selectedSetting.settingOptions.map((option, index) => (
        <button
          className={`setting-selector-btn ${option === selectedSetting.settingValue ? "selected" : ""}`}
          onClick={() => handleOptionChange(option)}
          key={index}
          value={index}
        >
          {option}
        </button>
      ))}
    </h2>
  );
};

export default SettingsSelector;
