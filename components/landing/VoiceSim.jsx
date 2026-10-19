"use client";
import { useEffect, useRef, useState } from "react";
import Icon from "../ui/Icon";

const SCENARIOS = [
  "Interested prospect",
  "Busy prospect",
  "Skeptical prospect",
  "Wrong person",
  "Where did you get my number?",
  "Missing personalisation",
  "Do-not-call request",
  "Successful booking",
  "Calendar tool fails",
  "Pushed to invent facts",
];

// Sample run of the pre-launch voice simulation. Purely illustrative: it steps
// through the ten scenarios on a timer and marks each one as passed.
export default function VoiceSim() {
  const [done, setDone] = useState(-1); // -1 = not run, else number of scenarios finished
  const [running, setRunning] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearInterval(timer.current), []);

  const run = () => {
    if (running) return;
    clearInterval(timer.current);
    setDone(0);
    setRunning(true);
    timer.current = setInterval(() => {
      setDone((n) => {
        if (n + 1 >= SCENARIOS.length) {
          clearInterval(timer.current);
          setRunning(false);
          return SCENARIOS.length;
        }
        return n + 1;
      });
    }, 420);
  };

  const finished = done >= SCENARIOS.length && !running;
  const label = running
    ? `Running ${done + 1} of ${SCENARIOS.length}…`
    : finished
      ? "Run the test again"
      : "Run the 10 test calls";

  return (
    <div className="gd-vtp">
      <div className="gd-vth">
        <div>
          <small>Pre-launch simulation</small>
          <b>10 scenarios · 100 credits per run</b>
        </div>
        <button type="button" className="gd-vtb" onClick={run}>
          <Icon name="play" size={15} color="#06231a" />
          {label}
        </button>
      </div>
      <div className="gd-vtg" aria-live="polite">
        {SCENARIOS.map((title, i) => {
          const state = done < 0 ? "idle" : i < done ? "pass" : i === done && running ? "run" : "idle";
          return (
            <div key={title} className={`gd-vtc is-${state}`}>
              <i>{i + 1}</i>
              <b>{title}</b>
              <em>{state === "pass" ? "Pass" : state === "run" ? "Calling…" : "Not run"}</em>
            </div>
          );
        })}
      </div>
      {finished ? (
        <div className="gd-vtf ok">
          <Icon name="check" size={16} color="#088256" />
          <span>
            <b>10 of 10 passed.</b> Ready to dial. Sample run for illustration.
          </span>
        </div>
      ) : (
        <div className="gd-vtf">
          {running ? "Scoring each transcript as it ends." : "Press the button to watch a sample run."}
        </div>
      )}
    </div>
  );
}
