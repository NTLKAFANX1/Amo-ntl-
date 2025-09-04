import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { Edit, Eye, Trash2 } from "lucide-react";
import type { Bot } from "@shared/schema";

interface BotCardProps {
  bot: Bot;
  onDeleted: () => void;
  onUpdated: () => void;
}

export default function BotCard({ bot, onDeleted, onUpdated }: BotCardProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteBotMutation = useMutation({
    mutationFn: () => apiRequest(`/api/bots/${bot.id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      toast({
        title: "تم حذف البوت بنجاح",
        description: "تم حذف البوت من قاعدة البيانات.",
      });
      onDeleted();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "فشل في حذف البوت",
        description: error.message || "يرجى المحاولة مرة أخرى.",
      });
    },
    onSettled: () => {
      setIsDeleting(false);
    },
  });

  const handleDelete = () => {
    setIsDeleting(true);
    deleteBotMutation.mutate();
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    toast({
      title: "قريباً",
      description: "سيتم إضافة وظيفة التعديل قريباً.",
    });
  };

  const handleView = () => {
    // TODO: Implement view functionality
    toast({
      title: "قريباً",
      description: "سيتم إضافة وظيفة العرض قريباً.",
    });
  };

  const getBotTypeIcon = (type: string) => {
    switch (type) {
      case 'discord':
        return 'fab fa-discord';
      case 'telegram':
        return 'fab fa-telegram';
      case 'whatsapp':
        return 'fab fa-whatsapp';
      case 'slack':
        return 'fab fa-slack';
      default:
        return 'fas fa-robot';
    }
  };

  const getBotTypeColor = (type: string) => {
    switch (type) {
      case 'discord':
        return 'bg-indigo-500';
      case 'telegram':
        return 'bg-blue-500';
      case 'whatsapp':
        return 'bg-green-500';
      case 'slack':
        return 'bg-purple-500';
      default:
        return 'bg-primary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "الآن";
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    if (diffInMinutes < 1440) return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`;
    return `منذ ${Math.floor(diffInMinutes / 1440)} يوم`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow fade-in" data-testid={`card-bot-${bot.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${getBotTypeColor(bot.type)} rounded-lg flex items-center justify-center`}>
              <i className={`${getBotTypeIcon(bot.type)} text-white`}></i>
            </div>
            <div>
              <h4 className="font-medium text-foreground" data-testid={`text-bot-name-${bot.id}`}>
                {bot.name}
              </h4>
              <p className="text-xs text-muted-foreground capitalize">
                {bot.type} Bot
              </p>
            </div>
          </div>
          <Badge 
            variant={bot.isActive ? "default" : "secondary"}
            className={bot.isActive ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
            data-testid={`status-bot-${bot.id}`}
          >
            {bot.isActive ? "نشط" : "متوقف"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {bot.description && (
          <p className="text-sm text-muted-foreground mb-4" data-testid={`text-bot-description-${bot.id}`}>
            {bot.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <span data-testid={`text-bot-created-${bot.id}`}>
            تم الإنشاء: {formatDate(bot.createdAt)}
          </span>
          <span data-testid={`text-bot-updated-${bot.id}`}>
            آخر تحديث: {getRelativeTime(bot.updatedAt)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            size="sm"
            onClick={handleEdit}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid={`button-edit-bot-${bot.id}`}
          >
            <Edit className="w-3 h-3 ml-1" />
            تعديل
          </Button>
          <Button 
            size="sm"
            variant="secondary"
            onClick={handleView}
            className="flex-1"
            data-testid={`button-view-bot-${bot.id}`}
          >
            <Eye className="w-3 h-3 ml-1" />
            عرض
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                size="sm"
                variant="ghost"
                className="text-destructive hover:bg-destructive/10"
                data-testid={`button-delete-bot-${bot.id}`}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent dir="rtl">
              <AlertDialogHeader>
                <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                <AlertDialogDescription>
                  هل أنت متأكد من حذف البوت "{bot.name}"؟ لا يمكن التراجع عن هذا الإجراء.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "جاري الحذف..." : "حذف"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
