import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { api, coverImage } from '@/lib/api';
import { DestinationCard } from '@/components/DestinationCard';
import { TourCard } from '@/components/TourCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function HomePage() {
  const [destinations, setDestinations] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [dRes, tRes] = await Promise.all([api.getDestinations(), api.getTours()]);
        if (!active) return;
        setDestinations(dRes.data.destinations.slice(0, 3));
        setTours(tRes.data.tours.slice(0, 3));
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden border-b">
        <img
          src={coverImage('', 'travel')}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-20 md:py-28">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="size-3.5 text-primary" />
            Your next adventure starts here
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
            Book curated tours across stunning destinations
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Travello connects you with hand-picked trips — browse regions, compare packages, and
            reserve seats in seconds.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/tours">
                Browse tours <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/destinations">Explore destinations</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Popular destinations</h2>
            <p className="text-muted-foreground">Places travelers love right now</p>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/destinations">View all</Link>
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Could not load data</AlertTitle>
            <AlertDescription>
              {error}. Make sure the backend is running on port 5000.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)
            : destinations.map((d) => <DestinationCard key={d._id} destination={d} />)}
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Upcoming tours</h2>
              <p className="text-muted-foreground">Limited seats — book early</p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/tours">View all</Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)
              : tours.map((t) => <TourCard key={t._id} tour={t} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
