import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export class DataLoader {
  private baseDir: string;

  constructor(baseDir?: string) {
    // Default to the package root's data directory, or accept a custom path
    this.baseDir = baseDir || path.resolve(__dirname, '../../data');
  }

  public getAreaPath(areaName: string): string {
    return path.join(this.baseDir, 'areas', areaName);
  }

  public getAllAreaNames(): string[] {
    const areasDir = path.join(this.baseDir, 'areas');
    if (!fs.existsSync(areasDir)) return [];
    
    return fs.readdirSync(areasDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  }

  public loadArea(areaName: string): { rooms: any[]; npcs: any[]; items: any[] } {
    const areaPath = this.getAreaPath(areaName);
    
    if (!fs.existsSync(areaPath)) {
      console.warn(`[DataLoader] Area folder not found: ${areaPath}`);
      return { rooms: [], npcs: [], items: [] };
    }

    return {
      rooms: this.loadYamlFile(path.join(areaPath, 'rooms.yml')),
      npcs: this.loadYamlFile(path.join(areaPath, 'npcs.yml')),
      items: this.loadYamlFile(path.join(areaPath, 'items.yml'))
    };
  }

  private loadYamlFile(filePath: string): any[] {
    if (!fs.existsSync(filePath)) {
      return [];
    }

    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const doc = yaml.load(fileContents);
      return Array.isArray(doc) ? doc : [];
    } catch (e) {
      console.error(`[DataLoader] Failed to load ${filePath}:`, e);
      return [];
    }
  }
}
