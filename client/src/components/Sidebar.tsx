import { Home, Bot, Folder, BarChart, User } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-card border-l border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-semibold text-foreground flex items-center gap-3">
          <i className="fas fa-robot text-primary"></i>
          إدارة البوتات
        </h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <a 
              href="#" 
              className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary text-primary-foreground"
              data-testid="nav-home"
            >
              <Home className="w-4 h-4" />
              الرئيسية
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              data-testid="nav-bots"
            >
              <Bot className="w-4 h-4" />
              البوتات
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              data-testid="nav-projects"
            >
              <Folder className="w-4 h-4" />
              المشاريع
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              data-testid="nav-stats"
            >
              <BarChart className="w-4 h-4" />
              الإحصائيات
            </a>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 rounded-md bg-secondary">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-secondary-foreground" data-testid="text-user-name">
              أحمد محمد
            </p>
            <p className="text-xs text-muted-foreground" data-testid="text-user-email">
              ahmed@example.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
