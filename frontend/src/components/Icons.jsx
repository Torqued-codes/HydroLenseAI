const svgProps = (size, className) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className,
  "aria-hidden": true,
  focusable: "false"
});

export function DropIcon({ size = 20, className }) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M12 3.2c-3.6 4.4-6 7.4-6 10.6a6 6 0 0 0 12 0c0-3.2-2.4-6.2-6-10.6z" />
    </svg>
  );
}

export function CheckIcon({ size = 18, className }) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function AlertIcon({ size = 18, className }) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M12 6.5v7" />
      <path d="M12 17.5h.01" />
    </svg>
  );
}

export function ChatIcon({ size = 18, className }) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
    </svg>
  );
}

export function WaveIcon({ size = 24, className }) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M3 12c2.2 0 2.2-4 4.5-4S9.8 16 12 16s2.3-8 4.5-8S19 12 21 12" />
    </svg>
  );
}

/* HydroLense mark: a lens ring around a drop. The drop takes its colour from CSS (.lens-drop). */
export function LensIcon({ size = 22, className }) {
  return (
    <svg {...svgProps(size, className)} strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9.2" />
      <path className="lens-drop" stroke="none" d="M12 6.6c-2.1 2.6-3.5 4.3-3.5 6.2a3.5 3.5 0 0 0 7 0c0-1.9-1.4-3.6-3.5-6.2z" />
    </svg>
  );
}
