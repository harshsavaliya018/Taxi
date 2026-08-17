export default function Logo() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <svg width="34" height="38" viewBox="0 0 34 38" fill="none" aria-hidden>
        <path
          d="M17 1L32 6.5V18C32 27.5 25.7 34.2 17 37C8.3 34.2 2 27.5 2 18V6.5L17 1Z"
          fill="#2563eb"
        />
        <path
          d="M17 1L32 6.5V18C32 27.5 25.7 34.2 17 37V1Z"
          fill="#1d3fb8"
        />
      </svg>
      <span
        style={{
          fontWeight: 800,
          fontSize: 26,
          letterSpacing: "0.5px",
          color: "#2563eb",
        }}
      >
        TRUST
      </span>
    </span>
  );
}
