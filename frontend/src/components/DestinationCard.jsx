import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { coverImage } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function DestinationCard({ destination }) {
  return (
    <Link to={`/destinations/${destination._id}`} className="group block h-full">
      <Card className="h-full overflow-hidden pt-0 transition-shadow group-hover:shadow-lg">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={coverImage(destination.image, 'hills')}
            alt={destination.name}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg">{destination.name}</CardTitle>
            <Badge variant="secondary">{destination.region}</Badge>
          </div>
          <CardDescription className="line-clamp-2">{destination.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="inline-flex items-center gap-1 text-sm text-primary">
            <MapPin className="size-4" />
            Explore tours
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
