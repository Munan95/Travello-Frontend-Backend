import { Compass } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="inline-flex items-center gap-2 font-medium text-foreground">
          <Compass className="size-4 text-primary" />
          Travello
        </p>
        <p>Discover destinations, book tours, and travel smarter.</p>
      </div>
    </footer>
  );
}
