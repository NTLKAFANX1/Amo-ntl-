import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "./Sidebar";
import BotCard from "./BotCard";
import CreateBotModal from "./CreateBotModal";
import CreateProjectModal from "./CreateProjectModal";
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Bot } from "@shared/schema";

interface Stats {
  totalBots: number;
  activeBots: number;
  totalProjects: number;
  todayMessages: number;
}

export default function Dashboard() {
  const [isCreateBotOpen, setIsCreateBotOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: bots = [], isLoading: botsLoading, refetch: refetchBots } = useQuery<Bot[]>({
    queryKey: ["/api/bots"],
  });

  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  const filteredBots = bots.filter(bot => {
    const matchesSearch = bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bot.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && bot.isActive) ||
                         (statusFilter === "inactive" && !bot.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleBotCreated = () => {
    refetchBots();
    setIsCreateBotOpen(false);
  };

  const handleBotDeleted = () => {
    refetchBots();
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">لوحة التحكم</h2>
            <p className="text-sm text-muted-foreground">إدارة البوتات والمشاريع</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setIsCreateBotOpen(true)}
              data-testid="button-create-bot"
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              إنشاء بوت جديد
            </Button>
            
            <Button 
              onClick={() => setIsCreateProjectOpen(true)}
              data-testid="button-create-project"
              variant="secondary"
              className="flex items-center gap-2"
            >
              <FolderPlus className="w-4 h-4" />
              إنشاء مشروع
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي البوتات</p>
                    <p className="text-2xl font-semibold text-foreground" data-testid="text-total-bots">
                      {stats.totalBots}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-robot text-primary"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">البوتات النشطة</p>
                    <p className="text-2xl font-semibold text-foreground" data-testid="text-active-bots">
                      {stats.activeBots}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-play text-green-600"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">المشاريع</p>
                    <p className="text-2xl font-semibold text-foreground" data-testid="text-total-projects">
                      {stats.totalProjects}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-folder text-blue-600"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">الرسائل اليوم</p>
                    <p className="text-2xl font-semibold text-foreground" data-testid="text-today-messages">
                      {stats.todayMessages.toLocaleString('ar')}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-envelope text-purple-600"></i>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bots Section */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">البوتات المحفوظة</h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="البحث في البوتات..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10 pl-3"
                      data-testid="input-search-bots"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40" data-testid="select-status-filter">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="inactive">غير نشط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="p-6">
              {botsLoading ? (
                <div className="flex items-center justify-center py-12" data-testid="loading-bots">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full loading-spinner"></div>
                    <p className="text-sm text-muted-foreground">جاري تحميل البوتات...</p>
                  </div>
                </div>
              ) : filteredBots.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12" data-testid="empty-bots">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-robot text-2xl text-muted-foreground"></i>
                  </div>
                  <h4 className="text-lg font-medium text-foreground mb-2">
                    {bots.length === 0 ? "لا توجد بوتات محفوظة" : "لا توجد نتائج"}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                    {bots.length === 0 
                      ? "ابدأ بإنشاء أول بوت لك. سيتم حفظه بشكل دائم ويمكنك الوصول إليه في أي وقت."
                      : "جرب تغيير معايير البحث أو الفلتر."
                    }
                  </p>
                  {bots.length === 0 && (
                    <Button 
                      onClick={() => setIsCreateBotOpen(true)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
                      data-testid="button-create-first-bot"
                    >
                      <Plus className="w-4 h-4" />
                      إنشاء بوت جديد
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="bots-grid">
                  {filteredBots.map((bot) => (
                    <BotCard 
                      key={bot.id} 
                      bot={bot} 
                      onDeleted={handleBotDeleted}
                      onUpdated={refetchBots}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <CreateBotModal 
        isOpen={isCreateBotOpen}
        onClose={() => setIsCreateBotOpen(false)}
        onSuccess={handleBotCreated}
      />

      <CreateProjectModal 
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
      />
    </div>
  );
}
