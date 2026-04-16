"use client";

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-2 px-4 py-6 text-center text-sm sm:px-6 md:flex-row md:items-center md:justify-between md:text-left lg:px-8">
        <p className="subtle-text md:max-w-2xl">
          © {new Date().getFullYear()} AI Recipe Studio. Intelligent recipe
          generation and visual assistance. All rights reserved.
        </p>
        <p className="subtle-text">
          Powered by{" "}
          <a
            href="https://www.camilooviedo.com/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[var(--text)] decoration-[var(--border-strong)] no-underline hover:opacity-80"
          >
            Camilo Oviedo
          </a>
        </p>
      </div>
    </footer>
  );
}
