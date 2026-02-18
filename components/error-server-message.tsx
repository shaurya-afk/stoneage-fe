/**
 * Shown whenever an error is displayed—subtle note that server might be down.
 */
export function ErrorServerMessage() {
  return (
    <p className="mt-2 text-xs text-zinc-500">
      If the problem persists, our servers might be down—it&apos;s on us. Please try again later.
    </p>
  );
}
