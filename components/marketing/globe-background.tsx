"use client";

import { motion } from "motion/react";

const hubs = [
  { x: 22, y: 42, label: "Lagos", primary: true },
  { x: 30, y: 34, label: "Abuja", primary: true },
  { x: 52, y: 22, label: "London" },
  { x: 68, y: 30, label: "Dubai" },
  { x: 15, y: 60, label: "Accra" },
  { x: 44, y: 58, label: "Nairobi" },
];

const routes = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [1, 5],
];

export function GlobeBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <svg
        viewBox="0 0 100 80"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full opacity-[0.35]"
      >
        {/* latitude arcs */}
        {[12, 24, 36, 48, 60, 68].map((y) => (
          <path
            key={y}
            d={`M -5 ${y} Q 50 ${y - 10} 105 ${y}`}
            fill="none"
            stroke="url(#gridStroke)"
            strokeWidth="0.25"
          />
        ))}
        {/* longitude curves */}
        {[5, 22, 39, 56, 73, 90].map((x) => (
          <path
            key={x}
            d={`M ${x} -5 Q ${x + 12} 40 ${x} 85`}
            fill="none"
            stroke="url(#gridStroke)"
            strokeWidth="0.25"
          />
        ))}

        {/* routes */}
        {routes.map(([a, b], i) => {
          const from = hubs[a];
          const to = hubs[b];
          const mx = (from.x + to.x) / 2;
          const my = Math.min(from.y, to.y) - 10;
          return (
            <path
              key={i}
              d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
              fill="none"
              stroke="var(--gold-500)"
              strokeWidth="0.25"
              strokeDasharray="1.2 1.4"
              opacity="0.6"
            />
          );
        })}

        <defs>
          <linearGradient id="gridStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary-400)" />
            <stop offset="100%" stopColor="var(--primary-700)" />
          </linearGradient>
        </defs>
      </svg>

      {/* hub markers */}
      {hubs.map((hub) => (
        <div
          key={hub.label}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${hub.x}%`, top: `${hub.y}%` }}
        >
          <span
            className={`block size-1.5 rounded-full ${
              hub.primary ? "bg-gold-400" : "bg-primary-400/70"
            }`}
          />
          {hub.primary && (
            <motion.span
              className="absolute inset-0 rounded-full bg-gold-400"
              animate={{ scale: [1, 2.6], opacity: [0.5, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
        </div>
      ))}

      {/* flying planes */}
      {routes.slice(0, 3).map(([a, b], i) => {
        const from = hubs[a];
        const to = hubs[b];
        const angle = (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;
        return (
          <motion.svg
            key={i}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="absolute size-3 text-gold-400/90"
            style={{ rotate: angle + 45 }}
            initial={{
              left: `${from.x}%`,
              top: `${from.y}%`,
              opacity: 0,
            }}
            animate={{
              left: [`${from.x}%`, `${to.x}%`],
              top: [`${from.y}%`, `${to.y}%`],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 2.2,
              ease: "linear",
            }}
          >
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.3.5-.1 1.1.4 1.4L9 12l-2 3H3.5c-.3 0-.6.1-.8.3l-.7.7c-.4.4-.4 1 0 1.4l2 1.5-1 2.5c-.2.4-.1.9.2 1.2l.5.5c.3.3.8.4 1.2.2l2.5-1 1.5 2c.4.4 1 .4 1.4 0l.7-.7c.2-.2.3-.5.3-.8V21l3-2 3.5 3.5c1.5 1.5 3.5 2 4 1.5.5-1 0-3-1.5-4.5L21 19" />
          </motion.svg>
        );
      })}
    </div>
  );
}
