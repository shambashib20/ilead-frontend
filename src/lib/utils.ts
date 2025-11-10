import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let handler: (() => void) | null = null;
let firing = false;

export function setLogoutHandler(fn: () => void) {
  handler = fn;
}

export function fireLogoutOnce() {
  if (firing) return;
  firing = true;
  try {
    handler?.();
  } finally {
    // page will usually navigate away; if not, allow future logouts after a tick
    setTimeout(() => {
      firing = false;
    }, 2000);
  }
}
