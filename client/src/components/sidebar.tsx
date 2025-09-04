import { type Event } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface SidebarProps {
  events: Event[];
}

export default function Sidebar({ events }: SidebarProps) {
  const categoryStats = events.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryLabels = {
    networking: "Networking Events",
    coworking: "Co-working Sessions", 
    fitness: "Fitness Activities",
    cultural: "Cultural Events",
    social: "Social Events",
  };

  const sortedCategories = Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 4);

  return (
    <aside className="w-full lg:w-80 space-y-6">
      {/* Map Preview */}
      <Card data-testid="card-map">
        <CardHeader>
          <CardTitle className="text-lg">Events Near You</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
            <div className="text-center text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Interactive Map</p>
              <p className="text-xs" data-testid="text-map-count">{events.length} events nearby</p>
            </div>
          </div>
          <Button className="w-full" data-testid="button-view-map">
            View Full Map
          </Button>
        </CardContent>
      </Card>
      
      {/* Popular Categories */}
      <Card data-testid="card-categories">
        <CardHeader>
          <CardTitle className="text-lg">Popular This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedCategories.length > 0 ? (
              sortedCategories.map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm" data-testid={`text-category-${category}`}>
                    {categoryLabels[category as keyof typeof categoryLabels] || category}
                  </span>
                  <span className="text-sm text-muted-foreground" data-testid={`text-count-${category}`}>
                    {count} event{count !== 1 ? 's' : ''}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No events to display</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Remote Worker Community */}
      <Card data-testid="card-community">
        <CardHeader>
          <CardTitle className="text-lg">Remote Worker Community</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex -space-x-2 mb-3">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
              alt="Community member" 
              className="w-8 h-8 rounded-full border-2 border-background" 
            />
            <img 
              src="https://images.unsplash.com/photo-1494790108755-2616b612b494?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
              alt="Community member" 
              className="w-8 h-8 rounded-full border-2 border-background" 
            />
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
              alt="Community member" 
              className="w-8 h-8 rounded-full border-2 border-background" 
            />
            <div className="w-8 h-8 bg-muted rounded-full border-2 border-background flex items-center justify-center">
              <span className="text-xs font-medium">+47</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Join 200+ remote workers discovering local events</p>
          <Button variant="secondary" className="w-full" data-testid="button-join-community">
            Join Community
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
