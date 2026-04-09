import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/global.css";

function renderFatalError(message: string) {
  const root = document.getElementById("root");
  if (!root) return;
  root.innerHTML = `
    <div style="min-height:100vh;padding:32px;background:#0a0d12;color:#f4f7fb;font-family:system-ui,sans-serif;">
      <h1 style="margin:0 0 16px;">Admin panel error</h1>
      <pre style="white-space:pre-wrap;word-break:break-word;background:rgba(255,255,255,0.04);padding:16px;border-radius:12px;">${message}</pre>
    </div>
  `;
}

window.addEventListener("error", (event) => {
  renderFatalError(event.error?.stack || event.message || "Unknown error");
});

window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason;
  renderFatalError(reason?.stack || reason?.message || String(reason));
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/admin">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
