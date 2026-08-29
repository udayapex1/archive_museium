"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Landmark, Compass } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/walkthrough", label: "Walkthrough" },
    { href: "/timeline", label: "Timeline" },
    { href: "/search", label: "Search" },
    { href: "/quiz", label: "Quiz" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 md:px-6 pointer-events-none">
      <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between rounded-full border border-[#f4cf75]/25 bg-[#1b120f]/90 px-4 py-2.5 text-[#f7f1e8] shadow-2xl backdrop-blur-md transition-all duration-300 md:px-6">

        {/* Brand Logo */}
        <Link
          href="/"
          className="focus-ring group flex items-center gap-3 shrink-0 rounded-full px-1 py-0.5 transition-opacity hover:opacity-90"
        >

          <div className="flex flex-col">
            <span className="font-display text-base font-extrabold tracking-wider text-[#f7f1e8] leading-tight">
              THE ARCHIVE
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#f4cf75]/80">
              Digital Museum
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex md:items-center md:gap-1">
          {links.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <div key={link.href} className="flex items-center">
                <Link
                  href={link.href}
                  className={`focus-ring rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${isActive
                    ? "bg-[#f4cf75]/20 text-[#f4cf75] font-semibold shadow-inner"
                    : "text-[#f7f1e8]/80 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  {link.label}
                </Link>
                {index < links.length - 1 && (
                  <span className="mx-1 h-3.5 w-px bg-white/15" />
                )}
              </div>
            );
          })}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/walkthrough"
            className="hidden items-center gap-2 rounded-full bg-[#f4cf75] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#1b120f] shadow-md transition-all hover:bg-white hover:shadow-lg hover:scale-105 active:scale-95 md:inline-flex"
          >
            <Compass className="h-4 w-4" />
            Enter museum
          </Link>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
            className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-[#f7f1e8] transition hover:bg-white/20 md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className="pointer-events-auto absolute left-3 right-3 top-[4.5rem] flex flex-col gap-2 rounded-2xl border border-[#f4cf75]/25 bg-[#1b120f]/95 p-4 text-[#f7f1e8] shadow-2xl backdrop-blur-xl md:hidden">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                onClick={() => setOpen(false)}
                href={link.href}
                className={`focus-ring rounded-xl px-4 py-3 text-base font-medium transition-all ${isActive
                  ? "bg-[#f4cf75]/20 text-[#f4cf75] font-semibold"
                  : "text-[#f7f1e8]/80 hover:bg-white/10 hover:text-white"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="mt-2 pt-2 border-t border-white/10">
            <Link
              onClick={() => setOpen(false)}
              href="/walkthrough"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f4cf75] py-3 text-xs font-bold uppercase tracking-wider text-[#1b120f]"
            >
              <Compass className="h-4 w-4" />
              Enter museum
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

