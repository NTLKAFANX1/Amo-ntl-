import { MapPin, Heart, User, Bot } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function Header() {
  const [location] = useLocation();
  const userId = "user123"; // In a real app, this would come from authentication

  const { data: favorites } = useQuery({
    queryKey: ["/api/favorites", userId],
    queryFn: async () => {
      const response = await fetch(`/api/favorites?userId=${userId}`);
      if (!response.ok) return [];
      return response.json();
    },
  });

  const favoriteCount = favorites?.length || 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">Localize</span>
            </Link>
            
            {/* Location Indicator */}
            <div className="hidden sm:flex items-center space-x-1 text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
              <MapPin className="w-4 h-4" />
              <span data-testid="text-location">San Francisco, CA</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`text-sm font-medium transition-colors ${location === "/" ? "text-foreground" : "text-muted-foreground hover:text-primary"}`} data-testid="link-events">
              Events
            </Link>
            <Link href="/favorites" className={`text-sm font-medium transition-colors ${location === "/favorites" ? "text-foreground" : "text-muted-foreground hover:text-primary"}`} data-testid="link-favorites">
              Favorites
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/favorites" data-testid="button-favorites">
              <Button variant="ghost" size="sm" className="relative">
                <Heart className="w-5 h-5" />
                {favoriteCount > 0 && (
                  <Badge variant="default" className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs" data-testid="text-favorite-count">
                    {favoriteCount}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {/* Profile Avatar */}
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0" data-testid="button-profile">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
