// This file contains mock data and utility functions for events
// In a real application, this would be replaced by API calls

export const EVENT_CATEGORIES = [
  { value: "networking", label: "Networking", color: "bg-green-100 text-green-800" },
  { value: "coworking", label: "Co-working", color: "bg-purple-100 text-purple-800" },
  { value: "social", label: "Social", color: "bg-blue-100 text-blue-800" },
  { value: "fitness", label: "Fitness", color: "bg-orange-100 text-orange-800" },
  { value: "cultural", label: "Cultural", color: "bg-pink-100 text-pink-800" },
];

export const BUDGET_RANGES = [
  { value: "", label: "Any Price" },
  { value: "0", label: "Free" },
  { value: "10", label: "Under $10" },
  { value: "25", label: "Under $25" },
  { value: "50", label: "Under $50" },
];

export const DISTANCE_OPTIONS = [
  { value: "5", label: "5 miles" },
  { value: "10", label: "10 miles" },
  { value: "25", label: "25 miles" },
  { value: "50", label: "50 miles" },
];

// Utility function to calculate distance between two coordinates
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Format price for display
export function formatPrice(price: number, currency: string = "USD"): string {
  if (price === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

// Format date for display
export function formatEventDate(startTime: Date, endTime: Date): string {
  const now = new Date();
  const isToday = startTime.toDateString() === now.toDateString();
  const isTomorrow =
    startTime.toDateString() ===
    new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();

  let dateStr = "";
  if (isToday) {
    dateStr = "Today";
  } else if (isTomorrow) {
    dateStr = "Tomorrow";
  } else {
    dateStr = startTime.toLocaleDateString("en-US", { weekday: "long" });
  }

  const startTimeStr = startTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const endTimeStr = endTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${dateStr}, ${startTimeStr} - ${endTimeStr}`;
}
