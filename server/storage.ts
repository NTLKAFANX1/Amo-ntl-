import { users, bots, projects, type User, type InsertUser, type Bot, type InsertBot, type Project, type InsertProject } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Bot methods
  getBots(userId?: string): Promise<Bot[]>;
  getBot(id: string): Promise<Bot | undefined>;
  createBot(bot: InsertBot & { userId?: string }): Promise<Bot>;
  updateBot(id: string, updates: Partial<Bot>): Promise<Bot | undefined>;
  deleteBot(id: string): Promise<boolean>;
  
  // Project methods
  getProjects(userId?: string): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject & { userId?: string }): Promise<Project>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Bot methods
  async getBots(userId?: string): Promise<Bot[]> {
    if (userId) {
      return await db.select().from(bots).where(eq(bots.userId, userId));
    }
    return await db.select().from(bots);
  }

  async getBot(id: string): Promise<Bot | undefined> {
    const [bot] = await db.select().from(bots).where(eq(bots.id, id));
    return bot || undefined;
  }

  async createBot(bot: InsertBot & { userId?: string }): Promise<Bot> {
    const [newBot] = await db
      .insert(bots)
      .values({
        ...bot,
        updatedAt: new Date(),
      })
      .returning();
    return newBot;
  }

  async updateBot(id: string, updates: Partial<Bot>): Promise<Bot | undefined> {
    const [updatedBot] = await db
      .update(bots)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(bots.id, id))
      .returning();
    return updatedBot || undefined;
  }

  async deleteBot(id: string): Promise<boolean> {
    const result = await db.delete(bots).where(eq(bots.id, id));
    return result.rowCount > 0;
  }

  // Project methods
  async getProjects(userId?: string): Promise<Project[]> {
    if (userId) {
      return await db.select().from(projects).where(eq(projects.userId, userId));
    }
    return await db.select().from(projects);
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(project: InsertProject & { userId?: string }): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values({
        ...project,
        updatedAt: new Date(),
      })
      .returning();
    return newProject;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject || undefined;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
