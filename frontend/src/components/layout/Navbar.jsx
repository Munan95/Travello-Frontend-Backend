import { Link, NavLink } from 'react-router-dom';
import { Compass, LogOut, MapPin, Plane, Shield, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const navClass = ({ isActive }) =>
  `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`;

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const initials = user?.name
    ?.split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Compass className="size-5" />
          </span>
          Travello
        </Link>

        <nav className="flex min-w-0 flex-1 items-center justify-center gap-4 overflow-x-auto whitespace-nowrap px-1 text-sm md:justify-start md:gap-6">
          <NavLink to="/destinations" className={navClass}>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" /> Destinations
            </span>
          </NavLink>
          <NavLink to="/tours" className={navClass}>
            <span className="inline-flex items-center gap-1.5">
              <Plane className="size-4" /> Tours
            </span>
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/bookings" className={navClass}>
              My bookings
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navClass}>
              <span className="inline-flex items-center gap-1.5">
                <Shield className="size-4" /> Admin
              </span>
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 pl-2">
                  <Avatar className="size-7">
                    <AvatarFallback className="text-xs">{initials || 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-28 truncate sm:inline">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/bookings">
                    <User className="size-4" /> My bookings
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">
                      <Shield className="size-4" /> Admin panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} variant="destructive">
                  <LogOut className="size-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
