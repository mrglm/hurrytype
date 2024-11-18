import { Setting } from "../../types";

type SettingSelectorProps = {
  settingsList: Setting[];
  selectedSetting: Setting;
  setSelectedSetting: React.Dispatch<React.SetStateAction<Setting>>;
};

const SettingsSelector = ({
  settingsList,
  selectedSetting,
  setSelectedSetting,
}: SettingSelectorProps): React.JSX.Element => {
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
