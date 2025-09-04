import { storage } from "../storage";

class BotManager {
  private activeBots: Map<string, Client> = new Map();

  async startBot(botId: string): Promise<boolean> {
    try {
      console.log(`🚀 محاولة تشغيل البوت ${botId}...`);
      
      const bot = await storage.getBot(botId);
      if (!bot) {
        console.error(`❌ البوت ${botId} غير موجود`);
        throw new Error("Bot not found");
      }

      console.log(`📋 تم العثور على البوت: ${bot.name}`);

      if (this.activeBots.has(botId)) {
        console.log(`🔄 البوت ${botId} يعمل بالفعل، جاري إعادة التشغيل...`);
        await this.stopBot(botId);
      }

      const client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
        ],
      });

      // Get all files
      const files = typeof bot.files === 'string' 
        ? JSON.parse(bot.files) as Record<string, string>
        : bot.files as Record<string, string>;
        
      console.log(`📁 تم تحميل ${Object.keys(files).length} ملف: ${Object.keys(files).join(', ')}`);
      
      // Create a comprehensive module environment with file loading support
      const moduleCache = new Map();
      
      const moduleEnv = {
        require: (modulePath: string) => {
          console.log(`📦 تحميل المكتبة/الملف: ${modulePath}`);
          
          // Check cache first
          if (moduleCache.has(modulePath)) {
            return moduleCache.get(modulePath);
          }
          
          // Handle discord.js
          if (modulePath === 'discord.js') {
            const discordModule = { Client, GatewayIntentBits, Events: require('events') };
            moduleCache.set(modulePath, discordModule);
            return discordModule;
          }
          
          // Handle path and fs modules
          if (modulePath === 'path') return require('path');
          if (modulePath === 'fs') return require('fs');
          if (modulePath === 'events') return require('events');
          
          // Handle local files - look for them in the files object
          const possibleFiles = [
            modulePath,
            modulePath + '.js',
            `./${modulePath}`,
            `./${modulePath}.js`
          ];
          
          for (const fileName of possibleFiles) {
            if (files[fileName]) {
              console.log(`📄 تم العثور على الملف المحلي: ${fileName}`);
              // Execute the file and return its exports
              const fileCode = files[fileName]
                .replace(/YOUR_BOT_TOKEN_HERE|YOUR_BOT_TOKEN/g, `'${bot.token}'`)
                .replace(/process\.env\.BOT_TOKEN/g, `'${bot.token}'`);
              
              const fileModule = { exports: {} };
              const fileFunction = new Function('module', 'exports', 'require', 'console', 'process', fileCode);
              fileFunction(fileModule, fileModule.exports, moduleEnv.require, moduleEnv.console, process);
              
              moduleCache.set(modulePath, fileModule.exports);
              return fileModule.exports;
            }
          }
          
          throw new Error(`Module/File ${modulePath} not found. Available files: ${Object.keys(files).join(', ')}`);
        },
        console: {
          log: (...args: any[]) => console.log(`[البوت ${bot.name}]:`, ...args),
          error: (...args: any[]) => console.error(`[البوت ${bot.name} - خطأ]:`, ...args),
          warn: (...args: any[]) => console.warn(`[البوت ${bot.name} - تحذير]:`, ...args),
          info: (...args: any[]) => console.info(`[البوت ${bot.name} - معلومات]:`, ...args)
        },
        module: { exports: {} },
        exports: {},
        global: globalThis,
        process: process,
        __dirname: process.cwd(),
        __filename: 'index.js'
      };
      
      // Get the main file (index.js or first file)
      let mainFile = files["index.js"] || files[Object.keys(files)[0]] || "";
      
      // Replace token placeholder with actual token
      mainFile = mainFile.replace(/YOUR_BOT_TOKEN_HERE|YOUR_BOT_TOKEN/g, `'${bot.token}'`);

      console.log(`⚡ تنفيذ كود البوت الرئيسي...`);

      // Create the Discord client
      const { Client, GatewayIntentBits } = await import('discord.js');
      const discordClient = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
        ],
      });
      
      // Create a context where the bot code will run
      const botContext = {
        ...moduleEnv,
        client: discordClient,
        Client: Client,
        GatewayIntentBits: GatewayIntentBits
      };

      // Execute the bot code with proper module context
      const botFunction = new Function(...Object.keys(botContext), `
        try {
          console.log('🔥 بدء تنفيذ كود البوت...');
          ${mainFile}
          console.log('✅ تم تنفيذ كود البوت بنجاح');
          return { client: typeof client !== 'undefined' ? client : null };
        } catch (error) {
          console.error('💥 خطأ في تنفيذ كود البوت:', error);
          throw error;
        }
      `);

      const result = botFunction(...Object.values(botContext));
      const botClient = result?.client || discordClient;

      console.log(`🔐 محاولة تسجيل الدخول إلى ديسكورد...`);

      // Make sure to login the bot with the token
      await botClient.login(bot.token);

      console.log(`✅ تم تسجيل الدخول بنجاح للبوت ${bot.name}`);

      this.activeBots.set(botId, botClient);

      await storage.updateBot(botId, { isActive: true });
      
      console.log(`🎉 تم تشغيل البوت ${bot.name} بنجاح!`);
      return true;
    } catch (error) {
      console.error(`❌ فشل في تشغيل البوت ${botId}:`, error);
      return false;
    }
  }

  async stopBot(botId: string): Promise<boolean> {
    try {
      console.log(`🛑 محاولة إيقاف البوت ${botId}...`);
      
      const client = this.activeBots.get(botId);
      if (client) {
        console.log(`🔌 إنهاء اتصال البوت...`);
        await client.destroy();
        this.activeBots.delete(botId);
        console.log(`✅ تم إنهاء اتصال البوت بنجاح`);
      } else {
        console.log(`⚠️ البوت ${botId} غير نشط أصلاً`);
      }

      await storage.updateBot(botId, { isActive: false });
      console.log(`💾 تم تحديث حالة البوت في قاعدة البيانات`);
      
      return true;
    } catch (error) {
      console.error(`❌ فشل في إيقاف البوت ${botId}:`, error);
      return false;
    }
  }

  async restartBot(botId: string): Promise<boolean> {
    await this.stopBot(botId);
    return await this.startBot(botId);
  }

  getBotStatus(botId: string): boolean {
    return this.activeBots.has(botId);
  }

  async stopAllBots(): Promise<void> {
    const promises = Array.from(this.activeBots.keys()).map(botId => this.stopBot(botId));
    await Promise.all(promises);
  }
}

export const botManager = new BotManager();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down bots...');
  await botManager.stopAllBots();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down bots...');
  await botManager.stopAllBots();
  process.exit(0);
});