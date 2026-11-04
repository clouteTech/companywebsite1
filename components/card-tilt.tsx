"use client";

import { useEffect } from "react";

/*
 * Makes every .ti-card (the AI topic cards) lean towards the mouse in 3D and lights a soft spot under the
 * pointer (globals.css, .ti-card::after reads --mx and --my). Leaving the card lets it settle back. Mouse
 * only; touch screens are left alone. Renders nothing.
 */
const MAX_TILT = 14;

export function CardTilt() {
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".ti-card"));
    const cleanups: (() => void)[] = [];

    for (const card of cards) {
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        const box = card.getBoundingClientRect();
        const x = ((event.clientX - box.left) / box.width) * 2 - 1;
        const y = ((event.clientY - box.top) / box.height) * 2 - 1;
        // Axis-angle form of "tilt towards the pointer": the axis is the pointer offset turned a quarter turn.
        const angle = Math.min(1, Math.hypot(x, y)) * MAX_TILT;
        card.style.rotate = `${(-y).toFixed(3)} ${x.toFixed(3)} 0 ${angle.toFixed(2)}deg`;
        card.style.setProperty("--mx", `${((x + 1) / 2) * 100}%`);
        card.style.setProperty("--my", `${((y + 1) / 2) * 100}%`);
        card.setAttribute("data-tilting", "");
      };
      const leave = () => {
        card.style.rotate = "";
        card.removeAttribute("data-tilting");
      };
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        card.removeEventListener("pointermove", move);
        card.removeEventListener("pointerleave", leave);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
