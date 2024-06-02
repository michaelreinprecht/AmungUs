import { useState, useEffect } from "react";

export default function SabotageTextUI({ sabotageInitiated }: { sabotageInitiated: boolean }) {
  const sabotageTime = 45;
  const [timer, setTimer] = useState(sabotageTime);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sabotageInitiated) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
      setTimer(sabotageTime);
    };
  }, [sabotageInitiated]);

  useEffect(() => {
    if (sabotageInitiated) {
      setTimer(sabotageTime);
    }
  }, []);

  return (
    sabotageInitiated && (
      <div className="sabotage absolute top-0 left-1/2 -translate-x-1/2 text-red-600 text-center mt-4 p-4 bg-gray-700 rounded" style={{fontSize: '2rem', boxShadow: '2px 2px 6px rgba(0,0,0,0.5)'}}>
        Sabotage initiated! A crewmate has to solve the sabotage task before the time runs out.
        <br />
        <span className="text-red-600">Time remaining: {timer} seconds</span>
      </div>
    )
  );
}


