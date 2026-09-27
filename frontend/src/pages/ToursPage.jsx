import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { TourCard } from '@/components/TourCard';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ToursPage() {
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getDestinations()
      .then((res) => setDestinations(res.data.destinations))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .getTours(filter || undefined)
      .then((res) => setTours(res.data.tours))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filter]);

  const heading = useMemo(() => {
    if (!filter) return 'All tours';
    const dest = destinations.find((d) => d._id === filter);
    return dest ? `Tours in ${dest.name}` : 'Filtered tours';
  }, [filter, destinations]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{heading}</h1>
          <p className="text-muted-foreground">Compare dates, prices, and remaining seats.</p>
        </div>
        <div className="w-full sm:w-64">
          <Label htmlFor="destination-filter">Filter by destination</Label>
          <select
            id="destination-filter"
            className="mt-1.5 flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All destinations</option>
            {destinations.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
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
          : tours.map((t) => <TourCard key={t._id} tour={t} />)}
      </div>

      {!loading && !error && tours.length === 0 && (
        <p className="text-muted-foreground">No tours match this filter.</p>
      )}
    </div>
  );
}
