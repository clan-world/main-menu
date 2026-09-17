import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import favicon from "./art/favicon.png";

// Favicon goes through the bundler too, so it resolves under any `base`.
const link = document.createElement("link");
link.rel = "icon"; link.type = "image/png"; link.href = favicon;
document.head.appendChild(link);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
