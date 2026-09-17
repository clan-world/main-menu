import { useEffect, useState } from "react";

export function useMedia(query: string) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const m = window.matchMedia(query);
    const h = () => setMatch(m.matches);
    m.addEventListener("change", h);
    return () => m.removeEventListener("change", h);
  }, [query]);
  return match;
}
