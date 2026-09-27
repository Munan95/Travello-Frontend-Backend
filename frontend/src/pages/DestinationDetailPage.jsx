import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { api, coverImage } from '@/lib/api';
import { TourCard } from '@/components/TourCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function DestinationDetailPage() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [dRes, tRes] = await Promise.all([api.getDestination(id), api.getTours(id)]);
        if (!active) return;
        setDestination(dRes.data.destination);
        setTours(tRes.data.tours);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-10">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Alert variant="destructive">
          <AlertTitle>Destination not found</AlertTitle>
          <AlertDescription>{error || 'This destination may have been removed.'}</AlertDescription>
        </Alert>
        <Button className="mt-4" variant="outline" asChild>
          <Link to="/destinations">Back to destinations</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-72 overflow-hidden border-b md:h-96">
        <img
          src={coverImage(destination.image, 'hills')}
          alt={destination.name}
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute bottom-0 mx-auto w-full max-w-6xl px-4 pb-8">
          <Badge className="mb-3">{destination.region}</Badge>
          <h1 className="text-3xl font-semibold md:text-4xl">{destination.name}</h1>
          <p className="mt-2 inline-flex items-center gap-1 text-muted-foreground">
            <MapPin className="size-4" />
            {destination.slug}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="max-w-3xl text-lg text-muted-foreground">{destination.description}</p>

        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-semibold">Tours in {destination.name}</h2>
          {tours.length === 0 ? (
            <p className="text-muted-foreground">No tours listed for this destination yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((t) => (
                <TourCard key={t._id} tour={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
