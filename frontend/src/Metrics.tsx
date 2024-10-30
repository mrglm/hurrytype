import React from "react";

const Metrics: React.FC<{ nbMistakes: number; wpm: number }> = ({ nbMistakes, wpm }) => {
  return (
    <h2>
      Mistakes: {nbMistakes} | WPM: {wpm}
    </h2>
  );
};

export default Metrics;
