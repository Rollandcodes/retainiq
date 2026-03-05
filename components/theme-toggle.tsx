"use client";
export function ThemeToggle() {
  return (
    <button
      onClick={() => {
        const isDark = document.documentElement.classList.toggle("dark");
        try {
          localStorage.setItem("theme", isDark ? "dark" : "light");
        } catch {}
      }}
      className="rounded-md border px-3 py-1 text-sm"
    >
      Theme
    </button>
  );
}
