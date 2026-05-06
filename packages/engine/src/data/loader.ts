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

  public loadArea(areaName: string): { rooms: any[]; npcs: any[]; items: any[]; spawners: any[] } {
    const areaPath = this.getAreaPath(areaName);
    
    if (!fs.existsSync(areaPath)) {
      console.warn(`[DataLoader] Area folder not found: ${areaPath}`);
      return { rooms: [], npcs: [], items: [], spawners: [] };
    }

    return {
      rooms: this.loadYamlFile(path.join(areaPath, 'rooms.yml')),
      npcs: this.loadYamlFile(path.join(areaPath, 'npcs.yml')),
      items: this.loadYamlFile(path.join(areaPath, 'items.yml')),
      spawners: this.loadYamlFile(path.join(areaPath, 'spawners.yml'))
    };
  }

  public loadSystem(): { skills: any[]; classes: any[]; races: any[]; help: Record<string, string> } {
    const systemPath = path.join(this.baseDir, 'system');
    
    if (!fs.existsSync(systemPath)) {
      console.warn(`[DataLoader] System folder not found: ${systemPath}`);
      return { skills: [], classes: [], races: [], help: {} };
    }

    return {
      skills: this.loadYamlFile(path.join(systemPath, 'skills.yml')),
      classes: this.loadYamlFile(path.join(systemPath, 'classes.yml')),
      races: this.loadYamlFile(path.join(systemPath, 'races.yml')),
      help: this.loadYamlObject(path.join(systemPath, 'help.yml'))
    };
  }

  private loadYamlFile(filePath: string): any[] {
    const doc = this.loadYamlObject(filePath);
    return Array.isArray(doc) ? doc : [];
  }

  private loadYamlObject(filePath: string): any {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      return yaml.load(fileContents);
    } catch (e) {
      console.error(`[DataLoader] Failed to load ${filePath}:`, e);
      return null;
    }
  }
}
