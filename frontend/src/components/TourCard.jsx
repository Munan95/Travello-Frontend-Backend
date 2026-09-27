import { Link } from 'react-router-dom';
import { CalendarDays, Users } from 'lucide-react';
import { coverImage, formatDate, formatMoney } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function TourCard({ tour }) {
  const dest = tour.destination;
  const destName = typeof dest === 'object' ? dest?.name : null;

  return (
    <Link to={`/tours/${tour._id}`} className="group block h-full">
      <Card className="h-full overflow-hidden pt-0 transition-shadow group-hover:shadow-lg">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={coverImage(tour.image, 'beach')}
            alt={tour.title}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            {destName && <Badge variant="outline">{destName}</Badge>}
            <Badge variant={tour.seatsAvailable > 0 ? 'secondary' : 'destructive'}>
              {tour.seatsAvailable > 0 ? `${tour.seatsAvailable} seats` : 'Sold out'}
            </Badge>
          </div>
          <CardTitle className="text-lg">{tour.title}</CardTitle>
          <CardDescription className="line-clamp-2">{tour.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-semibold text-primary">{formatMoney(tour.price)}</span>
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <CalendarDays className="size-4" />
            {formatDate(tour.date)} · {tour.duration}d
          </span>
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Users className="size-4" />
            per guest
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
