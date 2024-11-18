import React, { useEffect, useState } from "react";

type TimerProps = {
  isStarted: boolean;
  isFinished: boolean;
  timerRef: React.MutableRefObject<number>;
};

const Timer = ({ isStarted, isFinished, timerRef }: TimerProps): React.JSX.Element => {
  const [renderTimer, setRenderTimer] = useState(timerRef.current);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isStarted && !isFinished) {
        timerRef.current += 1;
        setRenderTimer(timerRef.current);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isFinished, isStarted, timerRef]);
  return <h2>{renderTimer}</h2>;
};

export default Timer;
