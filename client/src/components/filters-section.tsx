import { type EventFilter } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FiltersSectionProps {
  filters: EventFilter;
  onFilterChange: (filters: Partial<EventFilter>) => void;
}

const categories = [
  { value: "all", label: "All" },
  { value: "networking", label: "Networking" },
  { value: "coworking", label: "Co-working" },
  { value: "social", label: "Social" },
  { value: "fitness", label: "Fitness" },
  { value: "cultural", label: "Cultural" },
];

const budgetOptions = [
  { value: "all", label: "Any Price" },
  { value: "0", label: "Free" },
  { value: "10", label: "Under $10" },
  { value: "25", label: "Under $25" },
  { value: "50", label: "Under $50" },
];

const distanceOptions = [
  { value: "5", label: "5 miles" },
  { value: "10", label: "10 miles" },
  { value: "25", label: "25 miles" },
  { value: "50", label: "50 miles" },
];

export default function FiltersSection({ filters, onFilterChange }: FiltersSectionProps) {
  const selectedCategory = filters.category || "all";

  return (
    <section className="py-6 border-b border-border bg-card">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-2">Categories:</span>
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "secondary"}
                size="sm"
                onClick={() => onFilterChange({ category: category.value === "all" ? undefined : category.value })}
                className="text-xs"
                data-testid={`button-category-${category.value}`}
              >
                {category.label}
              </Button>
            ))}
          </div>
          
          {/* Budget and Distance Filters */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Budget:</span>
              <Select
                value={filters.maxPrice?.toString() || "all"}
                onValueChange={(value) => onFilterChange({ maxPrice: value === "all" ? undefined : Number(value) })}
              >
                <SelectTrigger className="w-32" data-testid="select-budget">
                  <SelectValue placeholder="Any Price" />
                </SelectTrigger>
                <SelectContent>
                  {budgetOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Distance:</span>
              <Select
                value={filters.maxDistance?.toString() || "5"}
                onValueChange={(value) => onFilterChange({ maxDistance: Number(value) })}
              >
                <SelectTrigger className="w-28" data-testid="select-distance">
                  <SelectValue placeholder="5 miles" />
                </SelectTrigger>
                <SelectContent>
                  {distanceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
