import { useEffect, useState } from "react";
import { WHISPERS } from "../data/menu";

type Props = {
  reduced: boolean;
};

export default function WhisperInk({ reduced }: Props) {
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState("");
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    const full = WHISPERS[index % WHISPERS.length];
    if (reduced) {
      setShown(full);
      setPhase("hold");
      const t = window.setTimeout(() => {
        setPhase("out");
        window.setTimeout(() => {
          setIndex((i) => i + 1);
          setPhase("in");
        }, 900);
      }, 4200);
      return () => window.clearTimeout(t);
    }

    setShown("");
    setPhase("in");
    let i = 0;
    const type = window.setInterval(() => {
      i += 1;
      setShown(full.slice(0, i));
      if (i >= full.length) {
        window.clearInterval(type);
        setPhase("hold");
      }
    }, 38);
    const hold = window.setTimeout(() => {
      setPhase("out");
      window.setTimeout(() => setIndex((n) => n + 1), 1100);
    }, 3800 + full.length * 38);
    return () => {
      window.clearInterval(type);
      window.clearTimeout(hold);
    };
  }, [index, reduced]);

  return (
    <p className={`whisper ${phase}`} aria-live="polite">
      {shown}
      {phase === "in" && !reduced ? <span className="whisper-caret">▍</span> : null}
    </p>
  );
}
