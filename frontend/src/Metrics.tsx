import React from "react";

type MetricsProps = { nbMistakes: number; wpm: number };

const Metrics = ({ nbMistakes, wpm }: MetricsProps): React.JSX.Element => {
  return (
    <h2>
      Mistakes: {nbMistakes} | WPM: {wpm}
    </h2>
  );
};

export default Metrics;
