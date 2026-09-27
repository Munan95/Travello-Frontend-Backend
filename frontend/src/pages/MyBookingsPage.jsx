import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { api, formatDate, formatMoney } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const statusVariant = {
  pending: 'secondary',
  confirmed: 'default',
  cancelled: 'destructive',
};

export function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api
      .getMyBookings()
      .then((res) => setBookings(res.data.bookings))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    try {
      await api.cancelBooking(id);
      toast.success('Booking cancelled');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">My bookings</h1>
        <p className="text-muted-foreground">Track pending trips and cancel when plans change.</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}

        {!loading && bookings.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>No bookings yet</CardTitle>
              <CardDescription>Browse tours and reserve your first trip.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/tours">Find a tour</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {bookings.map((b) => {
          const tour = b.tour;
          return (
            <Card key={b._id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                <div>
                  <CardTitle className="text-lg">{tour?.title || 'Tour'}</CardTitle>
                  <CardDescription>
                    {formatDate(tour?.date)} · {b.numGuests} guest{b.numGuests > 1 ? 's' : ''}
                  </CardDescription>
                </div>
                <Badge variant={statusVariant[b.status] || 'secondary'}>{b.status}</Badge>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold text-primary">{formatMoney(b.totalPrice)}</p>
                <div className="flex gap-2">
                  {tour?._id && (
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/tours/${tour._id}`}>View tour</Link>
                    </Button>
                  )}
                  {b.status !== 'cancelled' && (
                    <Button variant="destructive" size="sm" onClick={() => cancel(b._id)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
