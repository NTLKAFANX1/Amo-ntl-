import { Calendar, MapPin, Heart, User } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Calendar, label: "Events", href: "/", isActive: location === "/" },
    { icon: MapPin, label: "Map", href: "#", isActive: false },
    { icon: Heart, label: "Saved", href: "/favorites", isActive: location === "/favorites" },
    { icon: User, label: "Profile", href: "#", isActive: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-50" data-testid="mobile-nav">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center p-2 transition-colors ${
              item.isActive ? "text-primary" : "text-muted-foreground"
            }`}
            data-testid={`link-mobile-${item.label.toLowerCase()}`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
