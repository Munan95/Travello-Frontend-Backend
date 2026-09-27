import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { toast } from 'sonner';
import { api, coverImage, formatDate, formatMoney } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function TourDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [tour, setTour] = useState(null);
  const [numGuests, setNumGuests] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getTour(id)
      .then((res) => setTour(res.data.tour))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/tours/${id}` } });
      return;
    }
    setBooking(true);
    try {
      await api.createBooking({ tourId: id, numGuests: Number(numGuests) });
      toast.success('Booking created! Check My bookings for details.');
      navigate('/bookings');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-10">
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-8 w-96" />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Alert variant="destructive">
          <AlertTitle>Tour not found</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const dest = tour.destination;
  const total = tour.price * Number(numGuests || 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="overflow-hidden rounded-2xl border">
            <img
              src={coverImage(tour.image, 'beach')}
              alt={tour.title}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">{tour.title}</h1>
          {dest && (
            <Link
              to={`/destinations/${dest._id}`}
              className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <MapPin className="size-4" />
              {dest.name} · {dest.region}
            </Link>
          )}
          <p className="mt-4 text-muted-foreground">{tour.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="secondary">
              <CalendarDays className="size-3.5" /> {formatDate(tour.date)}
            </Badge>
            <Badge variant="outline">{tour.duration} days</Badge>
            <Badge variant={tour.seatsAvailable > 0 ? 'secondary' : 'destructive'}>
              <Users className="size-3.5" /> {tour.seatsAvailable} seats left
            </Badge>
          </div>
        </div>

        <Card className="h-fit lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle>Book this tour</CardTitle>
            <CardDescription>
              {formatMoney(tour.price)} per guest · total updates as you change guests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleBook}>
              <div className="space-y-2">
                <Label htmlFor="guests">Number of guests</Label>
                <Input
                  id="guests"
                  type="number"
                  min={1}
                  max={Math.max(1, tour.seatsAvailable)}
                  value={numGuests}
                  onChange={(e) => setNumGuests(e.target.value)}
                  required
                />
              </div>
              <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated total</span>
                  <span className="font-semibold">{formatMoney(total || 0)}</span>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={booking || tour.seatsAvailable < 1}
              >
                {tour.seatsAvailable < 1 ? 'Sold out' : booking ? 'Booking…' : 'Confirm booking'}
              </Button>
              {!isAuthenticated && (
                <p className="text-center text-xs text-muted-foreground">
                  You&apos;ll be asked to log in before confirming.
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
