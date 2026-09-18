export default function Logo({ size = 32, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sekaleGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5B5CE2" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
        <linearGradient id="sparkGlow" x1="20" y1="20" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#C7D2FE" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="#13161D" stroke="#272B35" strokeWidth="1.5" />
      <path
        d="M42 20C42 16.6863 38.4183 14 34 14H24C19.5817 14 16 17.5817 16 22C16 26.4183 19.5817 30 24 30H40C44.4183 30 48 33.5817 48 38C48 42.4183 44.4183 46 40 46H28C23.5817 46 20 43.3137 20 40"
        stroke="url(#sekaleGrad)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="30" r="3.5" fill="#FFFFFF" />
      <circle cx="16" cy="22" r="3" fill="#5B5CE2" />
      <circle cx="48" cy="38" r="3" fill="#38BDF8" />
      <path d="M46 16L48 12L50 16L54 18L50 20L48 24L46 20L42 18L46 16Z" fill="url(#sekaleGrad)" opacity="0.9" />
    </svg>
  );
}
