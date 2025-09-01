import { type Search, type InsertSearch, type Favorite, type InsertFavorite } from "@shared/schema";
import { randomUUID } from "crypto";

// Academic search application storage interface
export interface IStorage {
  getSearch(id: string): Promise<Search | undefined>;
  createSearch(search: InsertSearch): Promise<Search>;
  getSearchesByDevice(deviceId: string): Promise<Search[]>;
  getFavorite(id: string): Promise<Favorite | undefined>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  getFavoritesByDevice(deviceId: string): Promise<Favorite[]>;
}

export class MemStorage implements IStorage {
  private searches: Map<string, Search>;
  private favorites: Map<string, Favorite>;

  constructor() {
    this.searches = new Map();
    this.favorites = new Map();
  }

  async getSearch(id: string): Promise<Search | undefined> {
    return this.searches.get(id);
  }

  async createSearch(insertSearch: InsertSearch): Promise<Search> {
    const id = randomUUID();
    const search: Search = { 
      ...insertSearch,
      id,
      createdAt: new Date(),
      explanation: insertSearch.explanation || null,
      deviceId: insertSearch.deviceId || null
    };
    this.searches.set(id, search);
    return search;
  }

  async getSearchesByDevice(deviceId: string): Promise<Search[]> {
    return Array.from(this.searches.values()).filter(
      (search) => search.deviceId === deviceId
    );
  }

  async getFavorite(id: string): Promise<Favorite | undefined> {
    return this.favorites.get(id);
  }

  async createFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = randomUUID();
    const favorite: Favorite = { 
      ...insertFavorite,
      id,
      createdAt: new Date(),
      description: insertFavorite.description || null,
      deviceId: insertFavorite.deviceId || null
    };
    this.favorites.set(id, favorite);
    return favorite;
  }

  async getFavoritesByDevice(deviceId: string): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(
      (favorite) => favorite.deviceId === deviceId
    );
  }
}

export const storage = new MemStorage();
