import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { DestinationCard } from '@/components/DestinationCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function DestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getDestinations()
      .then((res) => setDestinations(res.data.destinations))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Destinations</h1>
        <p className="text-muted-foreground">Pick a region and find tours that match your vibe.</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)
          : destinations.map((d) => <DestinationCard key={d._id} destination={d} />)}
      </div>

      {!loading && !error && destinations.length === 0 && (
        <p className="text-muted-foreground">No destinations yet. Ask an admin to add some.</p>
      )}
    </div>
  );
}
