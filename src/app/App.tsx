import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  useEffect(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="4" fill="#0a0a0b"/><rect x="1" y="1" width="30" height="30" rx="3" fill="none" stroke="#c4ff00" stroke-width="0.5" opacity="0.3"/><text x="16" y="22" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="14" fill="#c4ff00" letter-spacing="-0.5">PA</text></svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = "image/svg+xml";
    link.href = url;
    return () => URL.revokeObjectURL(url);
  }, []);

  return <RouterProvider router={router} />;
}