import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type EventFilter } from "@shared/schema";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import FiltersSection from "@/components/filters-section";
import EventCard from "@/components/event-card";
import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobile-nav";
import { useLocation } from "@/hooks/use-location";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventsPage() {
  const [filters, setFilters] = useState<EventFilter>({});
  const { location, error: locationError } = useLocation();

  const { data: events, isLoading } = useQuery({
    queryKey: ["/api/events", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });
      
      const response = await fetch(`/api/events?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      return response.json();
    },
  });

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleFilterChange = (newFilters: Partial<EventFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection onSearch={handleSearch} />
      <FiltersSection filters={filters} onFilterChange={handleFilterChange} />
      
      <main className="py-8">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Event List */}
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Upcoming Events</h2>
                <p className="text-muted-foreground" data-testid="text-event-count">
                  {events ? `Found ${events.length} events` : "Loading events..."}
                  {location && ` within your area`}
                </p>
                {locationError && (
                  <p className="text-sm text-destructive mt-1">
                    Location access denied. Showing all events.
                  </p>
                )}
              </div>
              
              {/* Event Cards */}
              <div className="space-y-4" data-testid="events-list">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
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
                ) : events && events.length > 0 ? (
                  events.map((event: any) => (
                    <EventCard key={event.id} event={event} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No events found matching your criteria.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try adjusting your filters or search terms.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Load More Button */}
              {events && events.length > 0 && (
                <div className="mt-8 text-center">
                  <button 
                    className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent transition-colors"
                    data-testid="button-load-more"
                  >
                    Load More Events
                  </button>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <Sidebar events={events || []} />
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}
