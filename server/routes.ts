import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertBotSchema, insertProjectSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Bot routes
  app.get("/api/bots", async (req, res) => {
    try {
      const bots = await storage.getBots();
      res.json(bots);
    } catch (error) {
      console.error("Error fetching bots:", error);
      res.status(500).json({ error: "فشل في تحميل البوتات" });
    }
  });

  app.get("/api/bots/:id", async (req, res) => {
    try {
      const bot = await storage.getBot(req.params.id);
      if (!bot) {
        return res.status(404).json({ error: "البوت غير موجود" });
      }
      res.json(bot);
    } catch (error) {
      console.error("Error fetching bot:", error);
      res.status(500).json({ error: "فشل في تحميل البوت" });
    }
  });

  app.post("/api/bots", async (req, res) => {
    try {
      const validatedData = insertBotSchema.parse(req.body);

      // Add default files if not provided
      if (!validatedData.files || Object.keys(validatedData.files).length === 0) {
        validatedData.files = {
          'index.js': `const { Client, GatewayIntentBits, Events } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.once(Events.ClientReady, (readyClient) => {
    console.log(\`✅ البوت جاهز! تم تسجيل الدخول كـ \${readyClient.user.tag}\`);
});

client.on(Events.MessageCreate, (message) => {
    if (message.author.bot) return;

    if (message.content === '!ping') {
        message.reply('🏓 Pong!');
    }

    if (message.content === '!مرحبا') {
        message.reply('مرحباً بك! 👋 كيف يمكنني مساعدتك؟');
    }
});

client.login('YOUR_BOT_TOKEN');`
        };
      }

      const bot = await storage.createBot(validatedData);
      res.status(201).json(bot);
    } catch (error) {
      console.error("Error creating bot:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "بيانات غير صحيحة", details: error.errors });
      }
      res.status(500).json({ error: "فشل في إنشاء البوت" });
    }
  });

  app.put("/api/bots/:id", async (req, res) => {
    try {
      const updates = req.body;
      const bot = await storage.updateBot(req.params.id, updates);
      if (!bot) {
        return res.status(404).json({ error: "البوت غير موجود" });
      }
      res.json(bot);
    } catch (error) {
      console.error("Error updating bot:", error);
      res.status(500).json({ error: "فشل في تحديث البوت" });
    }
  });

  app.delete("/api/bots/:id", async (req, res) => {
    try {
      const success = await storage.deleteBot(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "البوت غير موجود" });
      }
      res.json({ message: "تم حذف البوت بنجاح" });
    } catch (error) {
      console.error("Error deleting bot:", error);
      res.status(500).json({ error: "فشل في حذف البوت" });
    }
  });

  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "فشل في تحميل المشاريع" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "بيانات غير صحيحة", details: error.errors });
      }
      res.status(500).json({ error: "فشل في إنشاء المشروع" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const success = await storage.deleteProject(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "المشروع غير موجود" });
      }
      res.json({ message: "تم حذف المشروع بنجاح" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "فشل في حذف المشروع" });
    }
  });

  // Statistics endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const [allBots, allProjects] = await Promise.all([
        storage.getBots(),
        storage.getProjects()
      ]);

      const activeBots = allBots.filter(bot => bot.isActive).length;

      res.json({
        totalBots: allBots.length,
        activeBots,
        totalProjects: allProjects.length,
        todayMessages: 2847 // This would come from bot analytics in a real app
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "فشل في تحميل الإحصائيات" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}