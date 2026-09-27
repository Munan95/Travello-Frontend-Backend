import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api, formatDate, formatMoney } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const emptyDestination = { name: '', description: '', region: '', image: '' };
const emptyTour = {
  title: '',
  destination: '',
  description: '',
  price: '',
  duration: '',
  date: '',
  seatsAvailable: '',
  image: '',
};

export function AdminPage() {
  const [destinations, setDestinations] = useState([]);
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [destForm, setDestForm] = useState(emptyDestination);
  const [tourForm, setTourForm] = useState(emptyTour);

  const refresh = async () => {
    setLoading(true);
    try {
      const [d, t, b] = await Promise.all([
        api.getDestinations(),
        api.getTours(),
        api.getAllBookings(),
      ]);
      setDestinations(d.data.destinations);
      setTours(t.data.tours);
      setBookings(b.data.bookings);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const createDestination = async (e) => {
    e.preventDefault();
    try {
      await api.createDestination(destForm);
      toast.success('Destination created');
      setDestForm(emptyDestination);
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const createTour = async (e) => {
    e.preventDefault();
    try {
      await api.createTour({
        ...tourForm,
        price: Number(tourForm.price),
        duration: Number(tourForm.duration),
        seatsAvailable: Number(tourForm.seatsAvailable),
      });
      toast.success('Tour created');
      setTourForm(emptyTour);
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const removeDestination = async (id) => {
    try {
      await api.deleteDestination(id);
      toast.success('Destination deleted');
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const removeTour = async (id) => {
    try {
      await api.deleteTour(id);
      toast.success('Tour deleted');
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const setBookingStatus = async (id, status) => {
    try {
      await api.updateBookingStatus(id, status);
      toast.success(`Booking ${status}`);
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-10">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Admin panel</h1>
      <p className="mb-8 text-muted-foreground">Manage destinations, tours, and booking statuses.</p>

      <Tabs defaultValue="destinations">
        <TabsList>
          <TabsTrigger value="destinations">Destinations</TabsTrigger>
          <TabsTrigger value="tours">Tours</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="destinations" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add destination</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4 md:grid-cols-2" onSubmit={createDestination}>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={destForm.name}
                    onChange={(e) => setDestForm({ ...destForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Input
                    value={destForm.region}
                    onChange={(e) => setDestForm({ ...destForm, region: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    value={destForm.description}
                    onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Image URL (optional)</Label>
                  <Input
                    value={destForm.image}
                    onChange={(e) => setDestForm({ ...destForm, image: e.target.value })}
                  />
                </div>
                <Button type="submit" className="md:col-span-2">
                  Create destination
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {destinations.map((d) => (
              <Card key={d._id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
                  <div>
                    <p className="font-medium">{d.name}</p>
                    <p className="text-sm text-muted-foreground">{d.region}</p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => removeDestination(d._id)}>
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tours" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add tour</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4 md:grid-cols-2" onSubmit={createTour}>
                <div className="space-y-2 md:col-span-2">
                  <Label>Title</Label>
                  <Input
                    value={tourForm.title}
                    onChange={(e) => setTourForm({ ...tourForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Destination</Label>
                  <select
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    value={tourForm.destination}
                    onChange={(e) => setTourForm({ ...tourForm, destination: e.target.value })}
                    required
                  >
                    <option value="">Select destination</option>
                    {destinations.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    value={tourForm.description}
                    onChange={(e) => setTourForm({ ...tourForm, description: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price (USD)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={tourForm.price}
                    onChange={(e) => setTourForm({ ...tourForm, price: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration (days)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={tourForm.duration}
                    onChange={(e) => setTourForm({ ...tourForm, duration: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={tourForm.date}
                    onChange={(e) => setTourForm({ ...tourForm, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Seats available</Label>
                  <Input
                    type="number"
                    min="0"
                    value={tourForm.seatsAvailable}
                    onChange={(e) => setTourForm({ ...tourForm, seatsAvailable: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Image URL (optional)</Label>
                  <Input
                    value={tourForm.image}
                    onChange={(e) => setTourForm({ ...tourForm, image: e.target.value })}
                  />
                </div>
                <Button type="submit" className="md:col-span-2">
                  Create tour
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {tours.map((t) => (
              <Card key={t._id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
                  <div>
                    <p className="font-medium">{t.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatMoney(t.price)} · {formatDate(t.date)} · {t.seatsAvailable} seats
                    </p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => removeTour(t._id)}>
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="mt-6 space-y-3">
          {bookings.map((b) => (
            <Card key={b._id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
                <div>
                  <p className="font-medium">{b.tour?.title || 'Tour'}</p>
                  <p className="text-sm text-muted-foreground">
                    {b.user?.name} ({b.user?.email}) · {b.numGuests} guests · {formatMoney(b.totalPrice)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{b.status}</Badge>
                  {b.status !== 'cancelled' && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setBookingStatus(b._id, 'confirmed')}>
                        Confirm
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => setBookingStatus(b._id, 'cancelled')}>
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {bookings.length === 0 && <p className="text-muted-foreground">No bookings yet.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
