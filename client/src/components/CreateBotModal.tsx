import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { X, Loader2 } from "lucide-react";
import type { InsertBot } from "@shared/schema";

const createBotSchema = z.object({
  name: z.string().min(1, "اسم البوت مطلوب"),
  type: z.enum(["discord", "telegram", "whatsapp", "slack"], {
    required_error: "نوع البوت مطلوب",
  }),
  description: z.string().optional(),
  token: z.string().min(1, "توكن البوت مطلوب"),
});

type CreateBotForm = z.infer<typeof createBotSchema>;

interface CreateBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateBotModal({ isOpen, onClose, onSuccess }: CreateBotModalProps) {
  const { toast } = useToast();
  
  const form = useForm<CreateBotForm>({
    resolver: zodResolver(createBotSchema),
    defaultValues: {
      name: "",
      type: "discord",
      description: "",
      token: "",
    },
  });

  const createBotMutation = useMutation({
    mutationFn: (data: InsertBot) => apiRequest('/api/bots', {
      method: 'POST',
      body: data,
    }),
    onSuccess: () => {
      toast({
        title: "تم إنشاء البوت بنجاح!",
        description: "تم حفظ البوت في قاعدة البيانات ويمكنك الوصول إليه في أي وقت.",
      });
      form.reset();
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "حدث خطأ في إنشاء البوت",
        description: error.message || "يرجى المحاولة مرة أخرى.",
      });
    },
  });

  const onSubmit = (data: CreateBotForm) => {
    createBotMutation.mutate({
      ...data,
      isActive: false,
      files: {},
    });
  };

  const handleClose = () => {
    if (!createBotMutation.isPending) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-foreground">
              إنشاء بوت جديد
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={createBotMutation.isPending}
              data-testid="button-close-modal"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم البوت</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخل اسم البوت"
                      {...field}
                      data-testid="input-bot-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع البوت</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-bot-type">
                        <SelectValue placeholder="اختر نوع البوت" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="discord">Discord Bot</SelectItem>
                      <SelectItem value="telegram">Telegram Bot</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp Bot</SelectItem>
                      <SelectItem value="slack">Slack Bot</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="وصف مختصر للبوت ووظائفه"
                      className="resize-none"
                      {...field}
                      data-testid="textarea-bot-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>توكن البوت</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="أدخل توكن البوت"
                      {...field}
                      data-testid="input-bot-token"
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">سيتم تشفير التوكن وحفظه بشكل آمن</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                disabled={createBotMutation.isPending}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
                data-testid="button-submit-bot"
              >
                {createBotMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  "إنشاء البوت"
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={createBotMutation.isPending}
                data-testid="button-cancel"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
