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
import type { InsertProject } from "@shared/schema";

const createProjectSchema = z.object({
  name: z.string().min(1, "اسم المشروع مطلوب"),
  description: z.string().min(1, "وصف المشروع مطلوب"),
  category: z.enum(["utility", "moderation", "music", "game", "other"], {
    required_error: "فئة المشروع مطلوبة",
  }),
  author: z.string().min(1, "اسم المؤلف مطلوب"),
});

type CreateProjectForm = z.infer<typeof createProjectSchema>;

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const { toast } = useToast();
  
  const form = useForm<CreateProjectForm>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "utility",
      author: "",
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: (data: InsertProject) => apiRequest('/api/projects', {
      method: 'POST',
      body: data,
    }),
    onSuccess: () => {
      toast({
        title: "تم إنشاء المشروع بنجاح!",
        description: "تم حفظ المشروع في قاعدة البيانات.",
      });
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "حدث خطأ في إنشاء المشروع",
        description: error.message || "يرجى المحاولة مرة أخرى.",
      });
    },
  });

  const onSubmit = (data: CreateProjectForm) => {
    createProjectMutation.mutate({
      ...data,
      tags: [],
      files: {},
      verified: false,
      downloads: 0,
      rating: 0,
      ratingCount: 0,
    });
  };

  const handleClose = () => {
    if (!createProjectMutation.isPending) {
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
              إنشاء مشروع جديد
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={createProjectMutation.isPending}
              data-testid="button-close-project-modal"
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
                  <FormLabel>اسم المشروع</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخل اسم المشروع"
                      {...field}
                      data-testid="input-project-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>فئة المشروع</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-project-category">
                        <SelectValue placeholder="اختر فئة المشروع" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="utility">أدوات مساعدة</SelectItem>
                      <SelectItem value="moderation">إدارة</SelectItem>
                      <SelectItem value="music">موسيقى</SelectItem>
                      <SelectItem value="game">ألعاب</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
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
                  <FormLabel>وصف المشروع</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="وصف مفصل للمشروع ووظائفه"
                      className="resize-none"
                      {...field}
                      data-testid="textarea-project-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم المؤلف</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخل اسم المؤلف"
                      {...field}
                      data-testid="input-project-author"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                disabled={createProjectMutation.isPending}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
                data-testid="button-submit-project"
              >
                {createProjectMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  "إنشاء المشروع"
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={createProjectMutation.isPending}
                data-testid="button-cancel-project"
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
