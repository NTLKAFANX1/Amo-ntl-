import { useState } from "react";
import { MapPin, Users, Heart } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type Event } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface EventCardProps {
  event: Event;
}

const categoryColors = {
  networking: "bg-green-100 text-green-800",
  coworking: "bg-purple-100 text-purple-800",
  social: "bg-blue-100 text-blue-800", 
  fitness: "bg-orange-100 text-orange-800",
  cultural: "bg-pink-100 text-pink-800",
};

export default function EventCard({ event }: EventCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userId = "user123"; // In a real app, this would come from authentication

  const { data: favoriteData } = useQuery({
    queryKey: ["/api/favorites", event.id, "check", userId],
    queryFn: async () => {
      const response = await fetch(`/api/favorites/${event.id}/check?userId=${userId}`);
      if (!response.ok) return { isFavorite: false };
      return response.json();
    },
  });

  const isFavorite = favoriteData?.isFavorite || false;

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (isFavorite) {
        const response = await fetch(`/api/favorites/${event.id}?userId=${userId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error('Failed to remove favorite');
        return response.json();
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId: event.id, userId }),
        });
        if (!response.ok) throw new Error('Failed to add favorite');
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: isFavorite 
          ? `${event.title} has been removed from your favorites.`
          : `${event.title} has been added to your favorites.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatDate = (date: string | Date) => {
    const eventDate = new Date(date);
    const now = new Date();
    const isToday = eventDate.toDateString() === now.toDateString();
    const isTomorrow = eventDate.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
    
    if (isToday) {
      return `Today, ${eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else if (isTomorrow) {
      return `Tomorrow, ${eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else {
      return eventDate.toLocaleDateString('en-US', { 
        weekday: 'long',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `$${price}`;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer" data-testid={`card-event-${event.id}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        <img 
          src={event.imageUrl} 
          alt={event.title}
          className="w-full sm:w-48 h-32 object-cover rounded-lg"
          data-testid={`img-event-${event.id}`}
        />
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold mb-1" data-testid={`text-title-${event.id}`}>
                {event.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2" data-testid={`text-date-${event.id}`}>
                {formatDate(event.startTime)} - {new Date(event.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavoriteMutation.mutate();
              }}
              disabled={toggleFavoriteMutation.isPending}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              data-testid={`button-favorite-${event.id}`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "text-red-500 fill-current" : "text-muted-foreground"}`} />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3" data-testid={`text-description-${event.id}`}>
            {event.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span data-testid={`text-location-${event.id}`}>{event.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span data-testid={`text-attendees-${event.id}`}>{event.attendeeCount} attending</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                className={categoryColors[event.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-800"}
                data-testid={`badge-category-${event.id}`}
              >
                {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
              </Badge>
              <span 
                className={`text-lg font-semibold ${event.price === 0 ? "text-green-600" : "text-foreground"}`}
                data-testid={`text-price-${event.id}`}
              >
                {formatPrice(event.price)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
