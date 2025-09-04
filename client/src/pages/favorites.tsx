import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import EventCard from "@/components/event-card";
import MobileNav from "@/components/mobile-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const userId = "user123"; // In a real app, this would come from authentication

  const { data: favoriteEvents, isLoading } = useQuery({
    queryKey: ["/api/favorites/events", userId],
    queryFn: async () => {
      const response = await fetch(`/api/favorites/events?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch favorite events");
      }
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Favorite Events</h1>
            </div>
            <p className="text-muted-foreground">
              {favoriteEvents ? `You have ${favoriteEvents.length} saved events` : "Loading your favorite events..."}
            </p>
          </div>
          
          {/* Favorite Events */}
          <div className="space-y-4" data-testid="favorites-list">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Skeleton className="w-full sm:w-48 h-32 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-16 w-full" />
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : favoriteEvents && favoriteEvents.length > 0 ? (
              favoriteEvents.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-2">No favorite events yet</p>
                <p className="text-sm text-muted-foreground">
                  Start adding events to your favorites to see them here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}
