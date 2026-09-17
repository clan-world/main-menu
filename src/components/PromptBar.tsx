/** Bottom console prompt bar: button glyph hints, changes with the input method. */
export default function PromptBar({ pad, touch, inPanel }: { pad: boolean; touch: boolean; inPanel: boolean }) {
  const hints = touch
    ? [["tap", inPanel ? "Close" : "Select"], ["swipe", "Browse"]]
    : pad
      ? [["A", inPanel ? "Close" : "Select"], ["B", "Back"], ["✚", "Navigate"]]
      : [["⏎", inPanel ? "Close" : "Select"], ["Esc", "Back"], ["▲▼", "Navigate"]];
  return (
    <footer className="prompts">
      <div className="prompts-left">
        {hints.map(([k, v]) => (
          <span className="prompt" key={k}><kbd className={`glyph ${k.length > 2 ? "glyph-wide" : ""}`}>{k}</kbd><span>{v}</span></span>
        ))}
      </div>
      <div className="prompts-right">
        <span className="ver">Clan World · prototype v0.2 · Fable 5.1</span>
      </div>
    </footer>
  );
}
