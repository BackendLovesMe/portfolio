import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container flex min-h-[70vh] flex-col items-start justify-center">
      <p className="eyebrow">404 / Not found</p>
      <h1 className="mt-4 text-4xl font-semibold">This route doesn&apos;t exist.</h1>
      <p className="mt-3 text-sm text-[#9ba79e]">Head back to the portfolio homepage.</p>
      <Link href="/" className="button-primary mt-6">Back home</Link>
    </main>
  );
}
