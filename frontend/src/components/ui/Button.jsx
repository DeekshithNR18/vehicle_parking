export default function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-mint text-deep hover:brightness-110",
    secondary: "bg-elevated text-textp hover:bg-panel border border-white/10",
    danger: "bg-danger text-white hover:brightness-110",
  };
  return (
    <button
      className={`px-5 py-3 rounded-xl font-bold transition-all duration-200 active:scale-95 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
