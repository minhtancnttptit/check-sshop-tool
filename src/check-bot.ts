import dotenv from 'dotenv';
import fs from 'fs';
import { BrowserManager } from './browser-manager';

dotenv.config({ path: '.env'});

class CheckBot {
  id = 1;
  browsers: Map<string | number, BrowserManager>;

  constructor() {
    this.browsers = new Map();
  }

  addBrowser() {
    try {
      // fs.rmdirSync(`data/${this.id}`, { recursive: true });
      // fs.mkdirSync(`data/${this.id}`)
    } catch (error) {
      console.log(error)
    }
    this.browsers.set(this.id, new BrowserManager(`data/${this.id}`, this.id))
    this.id ++;
  }

  async removeBrowser(id: number) {
    if (!this.browsers.get(id)) throw new Error(`Khong co browser ${id}`)
   await this.browsers.get(id)?.stop();
   this.browsers.delete(id);
  }

  async login(id: number) {
    if (!this.browsers.get(id)) throw new Error(`Khong co browser ${id}`)
    await this.browsers.get(id)?.login();
  }
}

export { CheckBot };
