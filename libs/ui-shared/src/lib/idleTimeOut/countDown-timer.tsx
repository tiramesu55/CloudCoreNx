import { Typography } from "@mui/material";
import Countdown from "react-countdown";

interface Timer {
  minutes?: number | undefined;
  seconds: number;
  timer: { minutes: number; seconds: number };
}

export const CountDownTimer = ({ minutes, seconds, timer }: Timer) => {
  let countDownTime = minutes ? minutes * 60000 : 0;
  countDownTime += seconds ? seconds * 1000 : 0;
  const OnCountDownFinish = () => (
    <Typography variant="h4">Logging out...</Typography>
  );

  // Renderer callback with condition
  const renderer = ({ minutes, seconds, completed }: any) => {
    if (completed) {
      // Render a completed state
      return <OnCountDownFinish />;
    } else {
      // Render a countdown
      return (
        <Typography variant="h1" sx={{ color: "#000000" }} fontSize={"72px"}>
          {minutes === undefined || minutes === 0
            ? `${seconds} secs`
            : `${minutes} min ${seconds} secs`}
        </Typography>
      );
    }
  };

  return (
    <>{<Countdown date={Date.now() + countDownTime} renderer={renderer} />}</>
  );
};


