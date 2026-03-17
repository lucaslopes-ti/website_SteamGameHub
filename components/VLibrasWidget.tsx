"use client";

import Script from "next/script";

declare global {
  interface Window {
    VLibras?: {
      Widget: new (url: string) => unknown;
    };
    __vlibrasInitialized?: boolean;
    __vlibrasWidget?: unknown;
  }
}

function initVLibras() {
  if (!globalThis.window?.VLibras || globalThis.window.__vlibrasInitialized) return;

  globalThis.window.__vlibrasWidget = new globalThis.window.VLibras.Widget("https://vlibras.gov.br/app");
  globalThis.window.__vlibrasInitialized = true;
}

export default function VLibrasWidget() {
  return (
    <Script
      id="vlibras-plugin"
      src="https://vlibras.gov.br/app/vlibras-plugin.js"
      strategy="afterInteractive"
      onLoad={initVLibras}
    />
  );
}
