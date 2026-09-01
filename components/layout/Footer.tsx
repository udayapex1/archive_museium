import Image from "next/image";
import Link from "next/link";

const footerImage =
  "https://res.cloudinary.com/dwemivxbp/image/upload/v1788029765/pexels-uwc12-574313_lvhce9.jpg";

export function Footer() {
  return (
    <footer className="relative mt-24 w-full bg-[#111010] px-5 pb-6 pt-28 text-white md:px-10">
      <div className="pointer-events-none absolute inset-x-0 -top-16 mx-auto h-44 max-w-6xl overflow-hidden rounded-2xl bg-[#171313] shadow-2xl md:grid md:grid-cols-[1.1fr_.9fr]">
        <div className="pointer-events-auto flex flex-col justify-center px-7 py-7 md:px-10">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-[#f4cf75]">
            Continue your visit
          </p>
          <h2 className="mt-3 max-w-md font-display text-3xl font-bold leading-tight text-white md:text-4xl">
            Carry the story with you.
          </h2>
          <Link
            href="/walkthrough"
            className="mt-5 inline-flex w-fit rounded-full bg-[#f4cf75] px-5 py-3 text-xs font-bold text-[#2f211b] transition hover:bg-white"
          >
            Walk through the museum →
          </Link>
        </div>
        <div className="relative hidden min-h-[176px] md:block">
          <Image
            src={footerImage}
            alt="Indian heritage architecture"
            fill
            className="object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#171313] via-transparent to-transparent" />
        </div>
      </div>
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
              <Link href="/walkthrough" className="hover:text-white">
                Walkthrough
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
