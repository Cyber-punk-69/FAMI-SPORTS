// Monochrome line icons (stroke uses currentColor) so artwork stays within the red/black palette.
const paths = {
  Cricket: (
    <>
      <rect x="19" y="3" width="9" height="27" rx="2" transform="rotate(38 24 24)" />
      <path d="M33 33l8 8" />
      <circle cx="12" cy="36" r="5" />
    </>
  ),
  Football: (
    <>
      <circle cx="24" cy="24" r="18" />
      <path d="M24 15l8 6-3 9H19l-3-9z" />
      <path d="M24 15V6M32 21l9-3M29 30l5 9M19 30l-5 9M16 21l-9-3" />
    </>
  ),
  Badminton: (
    <>
      <circle cx="12" cy="36" r="5" />
      <path d="M16 32L38 10M17 30l10-22M18 33l22-12M27 8q12-4 13 13" />
    </>
  ),
  Tennis: (
    <>
      <circle cx="24" cy="24" r="18" />
      <path d="M8 13c9 4 9 18 0 22M40 13c-9 4-9 18 0 22" />
    </>
  ),
  Fitness: <path d="M5 18v12M11 13v22M37 13v22M43 18v12M11 24h26" />,
  Default: <path d="M16 8h16v10a8 8 0 01-16 0zM16 12H8c0 8 4 10 8 10M32 12h8c0 8-4 10-8 10M24 26v8M16 40h16" />,
};

export function SportIcon({ sport, size = 40, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[sport] ?? paths.Default}
    </svg>
  );
}
