import Link from "next/link";
import { Diamond, ArrowLeft, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-50">
        <div className="mx-auto h-full max-w-7xl">
          <div className="relative h-full">
            <div className="absolute left-0 top-0 h-full w-px bg-zinc-700/30" />
            <div className="absolute right-0 top-0 h-full w-px bg-zinc-700/30" />
          </div>
        </div>
      </div>

      <div className="min-h-screen w-full bg-zinc-900">
        <nav className="relative z-50 border-b border-zinc-700/30 px-6 py-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-white">
              <Diamond className="h-5 w-5 text-amber-500" />
              <span className="font-medium">Stone Age</span>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-zinc-600 bg-transparent text-white hover:bg-zinc-800">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
        </nav>

        <main className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-12 lg:px-16">
          <div className="max-w-md">
            <div className="flex items-center gap-3 px-4 py-2 border border-zinc-700 w-fit mb-6">
              <div className="w-2.5 h-2.5 bg-amber-500" />
              <span className="text-sm font-medium text-zinc-400 tracking-wide">Error</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded border border-zinc-700 bg-zinc-800">
                <FileQuestion className="h-7 w-7 text-amber-500" />
              </div>
              <div>
                <h1 className="text-4xl font-normal tracking-tight text-white">Page not found</h1>
                <p className="mt-1 text-zinc-400">This page doesn’t exist or was moved.</p>
              </div>
            </div>

            <p className="mt-8 text-zinc-500">
              The link you followed may be broken, or the page might have been removed. Head back to the home page to continue.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90">
                  Go to home
                </Button>
              </Link>
              <Link href="/get-started">
                <Button size="lg" variant="outline" className="border-zinc-600 bg-transparent text-white hover:bg-zinc-800">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
