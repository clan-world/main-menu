import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const menu = [
  {
    id: "play",
    title: "Play now",
    sub: "Your story begins here",
    icon: "sword",
  },
  {
    id: "guide",
    title: "How to play",
    sub: "Every legend starts somewhere",
    icon: "book",
  },
  {
    id: "campaign",
    title: "Gold Believers Campaign",
    sub: "Stand with the first clans",
    icon: "sun",
  },
  {
    id: "packs",
    title: "Pack ripping",
    sub: "Discover what fate has sealed",
    icon: "cards",
  },
  {
    id: "settings",
    title: "Settings",
    sub: "Make this world your own",
    icon: "gear",
  },
  {
    id: "games",
    title: "Mini games",
    sub: "A little adventure between adventures",
    icon: "dice",
  },
];
function Icon({ name, ...props }) {
  const paths = {
    sword: (
      <>
        <path d="m7 18 12-13 2-2-1 6L9 20M5 15l7 7M4 23l4-5M16 4l4 4" />
      </>
    ),
    book: (
      <>
        <path d="M12 6C9 3 5 3 2 4v15c4-1 7 0 10 2 3-2 6-3 10-2V4c-3-1-7-1-10 2v15M5 8l4 1M15 9l4-1" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="5" />
        <path d="M12 0v4m0 16v4M0 12h4m16 0h4M3 3l3 3m12 12 3 3M3 21l3-3M18 6l3-3" />
      </>
    ),
    cards: (
      <>
        <path d="m8 2 13 3-4 17L4 19ZM4 5 1 7l2 14 10 2" />
        <path d="m13 7 2 5-4 4-2-5Z" />
      </>
    ),
    gear: (
      <>
        <path d="m9 2 6 0 1 4 4 1 2 5-3 3v4l-5 3-3-3-4 1-4-5 2-3-1-4 5-2Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    dice: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M7 7h.1M17 7h.1M12 12h.1M7 17h.1M17 17h.1" strokeWidth="3" />
      </>
    ),
    sound: (
      <>
        <path d="M3 9h4l5-5v16l-5-5H3ZM16 8q5 4 0 8m3-11q8 7 0 14" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name] || paths.sun}
    </svg>
  );
}
function App() {
  const [panel, setPanel] = useState(null),
    [sound, setSound] = useState(
      () => localStorage.getItem("cw-sound") === "true",
    ),
    [motion, setMotion] = useState(
      () =>
        localStorage.getItem("cw-motion") !== "false" &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    [whisper, setWhisper] = useState(0),
    [pack, setPack] = useState(false),
    [stage, setStage] = useState(0),
    [found, setFound] = useState([]),
    [sequence, setSequence] = useState([]),
    [notice, setNotice] = useState("");
  const dialog = useRef(null),
    lastFocus = useRef(null),
    audio = useRef(null);
  const whispers = [
    "The old world remembers your name.",
    "Beyond the veil, a thousand stories wait.",
    "Gather your clan. Leave your legend.",
  ];
  useEffect(() => {
    if (!motion) return;
    const t = setInterval(() => setWhisper((v) => (v + 1) % 3), 7000);
    return () => clearInterval(t);
  }, [motion]);
  useEffect(() => {
    localStorage.setItem("cw-sound", sound);
    localStorage.setItem("cw-motion", motion);
  }, [sound, motion]);
  useEffect(() => {
    if (panel) {
      dialog.current.showModal();
    } else if (dialog.current?.open) {
      dialog.current.close();
      lastFocus.current?.focus();
    }
  }, [panel]);
  function tone(high = false) {
    if (!sound) return;
    const ctx =
      audio.current ||
      (audio.current = new (
        window.AudioContext || window.webkitAudioContext
      )());
    ctx.resume();
    const o = ctx.createOscillator(),
      g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(high ? 660 : 330, ctx.currentTime);
    g.gain.setValueAtTime(0.035, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.2);
  }
  function open(id) {
    tone(true);
    lastFocus.current = document.activeElement;
    setPanel(id);
    setNotice("");
  }
  function navigate(e) {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const buttons = [...document.querySelectorAll(".menu-button")];
    const current = buttons.indexOf(document.activeElement);
    buttons[
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? buttons.length - 1
          : (current + (e.key === "ArrowDown" ? 1 : -1) + buttons.length) %
            buttons.length
    ].focus();
    tone();
  }
  function rune(n) {
    const next = [...sequence, n];
    setSequence(next);
    if (next.some((v, i) => v !== [2, 0, 3, 1][i])) {
      setSequence([]);
      setNotice("The stones fall silent. Try the inscription again.");
    } else if (next.length === 4) {
      setNotice("The seal is restored. The sanctuary remembers you.");
      tone(true);
    }
  }
  return (
    <div className={`console ${motion ? "" : "still"}`}>
      <div className="world-art" />
      <div className="vignette" />
      <div className="screen-frame" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <header>
        <div className="edition">
          <span className="tiny-sigil">✧</span> THE FIRST AGE{" "}
          <span className="header-line" />
        </div>
        <button className="profile" onClick={() => open("guide")}>
          <span className="avatar">W</span>
          <span>
            Wanderer<small>YOUR LEGEND AWAITS</small>
          </span>
          <span className="profile-arrow">⌄</span>
        </button>
      </header>
      <main>
        <section className="menu-zone" aria-label="Main menu">
          <div className="brand">
            <div className="brand-ornament">
              <span />✦<span />
            </div>
            <h1>
              CLAN<span>WORLD</span>
            </h1>
            <div className="brand-tag">
              <span /> MANY CLANS. ONE WORLD. <span />
            </div>
          </div>
          <div className="menu-heading">
            <span>YOUR NEXT CHAPTER</span>
            <span>Ⅰ</span>
          </div>
          <nav onKeyDown={navigate}>
            {menu.map((m, i) => (
              <button
                key={m.id}
                className={`menu-button ${i === 0 ? "primary" : ""}`}
                onClick={() => open(m.id)}
                onMouseEnter={() => tone()}
              >
                <span className="button-icon">
                  <Icon name={m.icon} />
                </span>
                <span className="button-copy">
                  <strong>{m.title}</strong>
                  <small>{m.sub}</small>
                </span>
                <span className="button-end">{i === 0 ? "➜" : "›"}</span>
                <span className="corner c1" />
                <span className="corner c2" />
              </button>
            ))}
          </nav>
          <div className="menu-tail">
            ✦ <span>A WORLD WAITING TO BE WRITTEN</span> ✦
          </div>
        </section>
        <section className="living-world" aria-label="The animated sanctuary">
          <div className="realm-tag">
            <span className="live-dot" /> THE WORLD IS STIRRING
          </div>
          <div className="portal-glow" aria-hidden="true" />
          <div className="rune-orbit" aria-hidden="true">
            ᚠ · ᚢ · ᚦ · ᚨ · ᚱ · ᚲ · ᚷ · ᚹ
          </div>
          <div className="embers" aria-hidden="true">
            {Array.from({ length: 18 }, (_, i) => (
              <i
                key={i}
                style={{
                  "--x": `${15 + ((i * 17) % 75)}%`,
                  "--delay": `${-i * 1.3}s`,
                  "--duration": `${5 + (i % 5)}s`,
                }}
              />
            ))}
          </div>
          <button
            className="world-marker"
            onClick={() => open("play")}
            aria-label="Explore the sanctuary"
          >
            <span>✧</span>
            <small>ENTER THE SANCTUARY</small>
          </button>
          <div className="world-caption">
            <div className="chapter">— &nbsp; CHAPTER I &nbsp; —</div>
            <h2>The waking of a world</h2>
            <p key={whisper} className="whisper">
              {whispers[whisper]}
            </p>
            <div className="caption-ornament">──────── ◇ ────────</div>
          </div>
        </section>
      </main>
      <footer>
        <div className="controls">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> Navigate
          </span>
          <span>
            <kbd>↵</kbd> Select
          </span>
          <span>
            <kbd>esc</kbd> Back
          </span>
        </div>
        <span className="build">
          CLAN WORLD <b>·</b> EARLY CHRONICLES <b>·</b> v0.1
        </span>
        <button
          className={`sound ${sound ? "on" : ""}`}
          aria-label={sound ? "Mute sound" : "Enable sound"}
          aria-pressed={sound}
          onClick={() => setSound(!sound)}
        >
          <Icon name="sound" />
          <span>SOUND {sound ? "ON" : "OFF"}</span>
        </button>
      </footer>
      <dialog
        aria-labelledby="panel-title"
        ref={dialog}
        onCancel={(e) => {
          e.preventDefault();
          setPanel(null);
        }}
        onClick={(e) => {
          if (e.target === dialog.current) setPanel(null);
        }}
      >
        <div className="panel">
          <button
            className="close"
            aria-label="Close panel"
            onClick={() => setPanel(null)}
          >
            ×
          </button>
          <div className="panel-sigil">✦</div>
          <p className="eyebrow">THE CHRONICLES OF CLAN WORLD</p>
          <h2 id="panel-title">{menu.find((m) => m.id === panel)?.title}</h2>
          <div className="divider">◆</div>
          {panel === "guide" && (
            <>
              <p>Every great clan begins with a wanderer.</p>
              <ol className="guide">
                <li>
                  <b>Enter the sanctuary</b>
                  <span>
                    Choose Play now and seek the three ancestral runes.
                  </span>
                </li>
                <li>
                  <b>Discover your relics</b>
                  <span>
                    Rip a pack to reveal a companion for your journey.
                  </span>
                </li>
                <li>
                  <b>Follow the old ways</b>
                  <span>
                    Try the rune trial in Mini games. Use a mouse, touch, or
                    keyboard to explore.
                  </span>
                </li>
              </ol>
              <button className="action" onClick={() => setPanel("play")}>
                Begin your story →
              </button>
            </>
          )}
          {panel === "play" && (
            <>
              <p>
                {found.length === 3
                  ? "The gate opens. Your first chapter is complete."
                  : "The sanctuary is sleeping. Awaken its three ancestral runes."}
              </p>
              <div className="rune-hunt">
                {["ᚠ", "ᚱ", "ᚷ"].map((r, i) => (
                  <button
                    key={r}
                    className={found.includes(i) ? "awakened" : ""}
                    aria-label={`Awaken rune ${i + 1}`}
                    aria-pressed={found.includes(i)}
                    onClick={() => {
                      setFound((v) => (v.includes(i) ? v : [...v, i]));
                      tone(true);
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <p className="progress">{found.length} / 3 RUNES AWAKENED</p>
              {found.length === 3 && (
                <button
                  className="action"
                  onClick={() => {
                    setFound([]);
                    setPanel(null);
                  }}
                >
                  Return to the world →
                </button>
              )}
              <small className="panel-note">
                A playable glimpse of the world to come.
              </small>
            </>
          )}
          {panel === "campaign" && (
            <>
              <p className="chapter">THE FOUNDING CHRONICLE</p>
              <h3>For those who believed first.</h3>
              <p>
                Three chapters. One shared beginning. Follow the founding clans
                as they bring light back to the sanctuary.
              </p>
              <div className="campaign-steps">
                {[
                  "The first spark",
                  "Gather the clans",
                  "Raise the banner",
                ].map((v, i) => (
                  <button
                    className={stage === i ? "selected" : ""}
                    key={v}
                    onClick={() => setStage(i)}
                  >
                    <small>0{i + 1}</small>
                    {v}
                  </button>
                ))}
              </div>
              <p>
                {
                  [
                    "An ember sleeps beneath the old stones. Every legend begins with someone willing to seek it.",
                    "No wanderer builds a world alone. The clans are gathering at the edge of the ancient forest.",
                    "When the last tower is lit, the banners will rise. A new age belongs to those who build it.",
                  ][stage]
                }
              </p>
              <small className="panel-note">
                Campaign preview · more chapters are on their way.
              </small>
            </>
          )}
          {panel === "packs" && (
            <>
              <p>
                {pack
                  ? "The seal has broken. A new ally answers."
                  : "One sealed chronicle. An untold possibility."}
              </p>
              <button
                className={`sealed-pack ${pack ? "revealed" : ""}`}
                onClick={() => {
                  setPack(!pack);
                  tone(true);
                }}
                aria-label={pack ? "Seal another pack" : "Rip the pack"}
              >
                <Icon name={pack ? "sun" : "cards"} />
                <strong>{pack ? "Dawnkeeper" : "THE FIRST AGE"}</strong>
                <small>
                  {pack ? "RARE · SANCTUARY GUARDIAN" : "TAP TO BREAK THE SEAL"}
                </small>
              </button>
              <small className="panel-note">
                Free preview pack ·{" "}
                {pack ? "tap to reset" : "discover your first relic"}.
              </small>
            </>
          )}
          {panel === "settings" && (
            <>
              <p>Tune your time in the world.</p>
              <label className="setting">
                <span>
                  <b>Menu sound</b>
                  <small>Soft tones as you explore</small>
                </span>
                <input
                  type="checkbox"
                  checked={sound}
                  onChange={(e) => setSound(e.target.checked)}
                />
              </label>
              <label className="setting">
                <span>
                  <b>Living parchment</b>
                  <small>Embers, drifting light and ink whispers</small>
                </span>
                <input
                  type="checkbox"
                  checked={motion}
                  onChange={(e) => setMotion(e.target.checked)}
                />
              </label>
              <small className="panel-note">
                Your preferences are saved on this device.
              </small>
            </>
          )}
          {panel === "games" && (
            <>
              <p className="chapter">THE RUNE TRIAL</p>
              <p>Repeat the inscription to restore the ancient seal.</p>
              <div className="inscription">ᚷ → ᚠ → ᚹ → ᚱ</div>
              <div className="trial">
                {["ᚠ", "ᚱ", "ᚷ", "ᚹ"].map((r, i) => (
                  <button
                    disabled={sequence.length === 4}
                    key={r}
                    onClick={() => rune(i)}
                    aria-label={`Rune ${r}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <p className="progress">{sequence.length} / 4 STONES ALIGNED</p>
              <p role="status">{notice}</p>
              {sequence.length === 4 && (
                <button
                  className="action"
                  onClick={() => {
                    setSequence([]);
                    setNotice("");
                  }}
                >
                  Play again ↻
                </button>
              )}
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
