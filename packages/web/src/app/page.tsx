/**
 * Landing page for the ICP Explorer web playground.
 *
 * Renders a centered hero section. This is a Server Component —
 * it contains no client-side interactivity and is statically
 * rendered at build time.
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">ICP Explorer</h1>
      <p className="mt-4 text-lg text-gray-600">
        AI-powered explorer for the Internet Computer
      </p>
    </main>
  );
}
