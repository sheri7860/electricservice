import type { IconName } from "@/content/types";

const paths: Record<IconName, string> = {
  bolt: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z",
  panel: "M5 3h14v18H5zM9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2",
  outlet: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM9 8v3M15 8v3M10 16h4",
  light: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z",
  fan: "M12 12m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M12 10.5C12 6 14 3 17 4s0 6.5-3.5 7.5M13.3 12.8c3.9 2.2 5.6 5.4 3.4 7.4s-5.5-3.6-4.5-7M10.6 12.6c-3.9 2.3-7.4 2.1-7.8-.9s6.1-3 7.6-.4",
  ev: "M5 17h1M18 17h1M4 13l2-5h12l2 5M4 13h16v5H4zM12 3 10 6h4l-2 3",
  generator: "M3 7h18v11H3zM7 18v2M17 18v2M7 11h4M15 10v4M13 12h4",
  surge: "M3 12h4l2-5 4 10 2-5h6",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4-4",
  wire: "M3 6c4 0 4 12 9 12s5-12 9-12",
  alert: "M12 3 2 20h20L12 3ZM12 10v4M12 17h.01",
  home: "M3 11 12 4l9 7M5 10v10h14V10",
  shield: "M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3ZM9 12l2 2 4-4",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  check: "M5 12l5 5L20 7",
  pin: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11ZM12 10m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 7v5l3 2",
  smoke: "M12 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM12 11m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M5 21h14",
  plug: "M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v4",
  sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
};

export function Icon({ name, className = "h-6 w-6" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}
