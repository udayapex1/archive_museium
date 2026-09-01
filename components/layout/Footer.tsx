import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative mt-24 w-full bg-[#111010] px-5 py-14 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3 font-display text-xl font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-maroon text-sm">
                ◉
              </span>{" "}
              THE ARCHIVE
            </div>
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/55">
              An interactive digital museum of Indian history, made for curious
              minds.
            </p>
            <p className="mt-7 text-xs text-white/40">
              Static collection · Open to all
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/40">
              Explore
            </p>
            <div className="mt-5 grid gap-3 text-sm text-white/70">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <Link href="/atlas" className="hover:text-white">
                Atlas
              </Link>
              <Link href="/timeline" className="hover:text-white">
                Timeline
              </Link>
              <Link href="/search" className="hover:text-white">
                Search
              </Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/40">
              Learn
            </p>
            <div className="mt-5 grid gap-3 text-sm text-white/70">
              <Link href="/quiz" className="hover:text-white">
                Quiz
              </Link>
              <Link
                href="/galleries/ancient-india"
                className="hover:text-white"
              >
                Ancient India
              </Link>
              <Link href="/galleries/mughal-era" className="hover:text-white">
                Mughal Era
              </Link>
              <Link href="/galleries/modern-india" className="hover:text-white">
                Modern India
              </Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/40">
              About
            </p>
            <p className="mt-5 text-sm leading-6 text-white/65">
              A frontend-only academic project with local content and
              interactive 3D exhibits.
            </p>
          </div>
        </div>
        <div className="mt-20 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-xs text-white/35 md:flex-row">
          <span>© 2026 The Archive. All rights reserved.</span>
          <span>Built with care for Indian history.</span>
        </div>
      </div>
    </footer>
  );
}
