import puppeteer, { Browser, Page } from "puppeteer";
import { schedule, ScheduledTask } from 'node-cron';
import fs from 'fs';
import { API_CART_PRODUCTS, CART, PAY_PAGE, WISH_LIST, _ } from './constant';
import { delay } from "./helpers";
import { Context } from "telegraf";

type TItem = {
  code: string,
  name?: string,
  url?: string,
};

const logGroupId = -583961747;

const logFileDir = `log.data`;

const log2File = (data: any) => {
  const content = `
  ${new Date()}:
    items: ${JSON.stringify(data)}
`;
  fs.appendFileSync(logFileDir, content)
}

const log = (ctx: Context, items: any, errItems: any) => {
  const content = `
  ${new Date()}:
    items: ${JSON.stringify(items)}
    errItems: ${JSON.stringify(errItems)}
`;
  ctx.tg.sendMessage(logGroupId, content);
  // fs.appendFileSync(logFileDir, content);
};

const baseURL = 'https://shop.samsung.com/vn/multistore/vnepp';
const replyWIthItems = (ctx: Context, items: TItem[] = [], code: string, val: string) => {
  if (items.length === 0) return;
  const message = items.reduce((preVal, item) => `${preVal}
- [(${item.code})-${item.name}](${baseURL}/${code}${item.url})`, val);
  ctx.reply(message, { parse_mode: 'Markdown'});
};

class BrowserManager  {
  id: number;
  browser?: Browser;
  page0?: Page;
  page1?: Page;
  page2?: Page;
  scheduTask1?: ScheduledTask;
  scheduTask2?: ScheduledTask;
  static mute: string[] = [];
  
  checking: boolean;

  code = 'nhattin';
  headless = false;
  username = 'BrysonLonnie67782@gmail.com';
  password = 'hung1995.';

  constructor(data: string, id: number) {
    this.id = id;
    puppeteer.launch({ headless: this.headless, args: ['--window-size=1200,800'] }).then(async (res) => {
      this.browser = res;
      this.page0 = (await this.browser.pages())[0];
      this.browser.newPage().then(res => this.page1 = res);
      this.browser.newPage().then(res => this.page2 = res);
      this.page1?.setViewport({ width: 1200, height: 800 })
    });
    this.checking = false;
  }

  setCode(code: string) {
    this.code = code.toLowerCase();
  }
  setUsername(val: string) {
    this.username = val;
  }

  setPass(val: string) {
    this.password = val;
  }

  static addMute(val: string[]) {
    BrowserManager.mute = BrowserManager.mute.concat(val);
  }

  async openBrowser() {
    if (!this.browser?.isConnected()) this.browser = await puppeteer.launch({ headless: this.headless });
  }

  // async openPage() {
  //   this.page1 = await this.browser?.newPage();
  // }

  async logout() {

  }

  async login() {
    const page = this.page0;
    if (!page) return;
    try {
      await page.goto(_.URL);
      await page.type(_._verifyInput, this.code);
      await page.click(_._gotoBtn);
      await page.waitForNavigation().catch((e)  => {});
      await page.click(_._gotoLoginBtn);
      await page.waitForNavigation().catch((e)  => {});
      await page.type(_._emailInput, this.username ?? '');
      await page.waitForSelector(_._passInput, { visible: true, timeout: 5000 });
      await page.type(_._passInput, this.password ?? '');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await page.waitForNavigation().catch((e)  => {});
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await page.waitForNavigation().catch((e)  => {});
    } catch (error) {
      console.log(error);
    } finally {
    }
  }

  async addAll() {
    const page = await this.browser?.newPage();
    if (!page) return;
    // await page.setRequestInterception(true);
    try {
      // page.on('request', (request) => {
      //     if (['image', 'font', 'stylesheet'].indexOf(request.resourceType()) !== -1) {
      //         request.abort();
      //     } else {
      //         request.continue();
      //     }
      // });
      await page.goto(WISH_LIST(this.code));
      await page.waitForNavigation({ timeout: 3000 }).catch((e)  => {});
      await page.waitForSelector(_._addAll, { visible: true, timeout: 3000 });
      await page.click(_._addAll);
      await page.waitForTimeout(1000);
    } catch (error) {
    } finally {
      await page.close();
    }
  }

  async removeAllItemInCart() {
    const page = await this.browser?.newPage();
    if (!page) return;
    try {
      // await page.setRequestInterception(true);
      // page.on('request', (request) => {
      //     if (['image', 'stylesheet', 'font'].indexOf(request.resourceType()) !== -1) {
      //         request.abort();
      //     } else {
      //         request.continue();
      //     }
      // });
      await page.goto(CART(this.code));
      while (await page.$(_._removeItem) !== null) {
        await page.click(_._removeItem).catch(console.error);
        await page.waitForNavigation().catch(console.error);
      }
    } catch (error) {
      console.log('loi');
      console.error(error);
    } finally {
      await page.close();
    }
  }

  async checkHang(ctx: Context, page?: Page, changeAddr: boolean = false) {
    try {
      if (changeAddr) await page?.waitForTimeout(4000).catch(() => {});
      let errItems: string[] | undefined = undefined;
      let items: TItem[] | undefined = undefined;
      if (!page) throw new Error('Page da dong.');
      // await page.setRequestInterception(true);
      // page.on('request', async (request) => {
      //     if (['image', 'font', 'stylesheet'].indexOf(request.resourceType()) !== -1) {
      //         await request.abort();
      //     } else {
      //         await request.continue();
      //     }
      // });
      page.on('response', async (res) => {
        if (res.url() === API_CART_PRODUCTS(this.code)) {
          const { deliveryGroups } = await res.json();
          log2File(deliveryGroups);
          items = deliveryGroups.reduce((preVal: any, { orderEntries }: any) => {
            const tmp = orderEntries.map(({ product }: any) => {
              const { name, code ,url } = product;
              return { name, code, url};
            });
            return [...preVal, ...tmp];
          }, []);
        }
        if (/^.*addV2.*/.test(res.url())) {
          page.evaluate(() => {
            window.stop();
          });
          const data = await res.json();
          log2File({
            url: res.url(),
            data,
          });
          const { outOfStockProductData } = data;
          if (outOfStockProductData === undefined) return;
          errItems = outOfStockProductData !== null ? outOfStockProductData.map(({ code }: any) => code) : [];
        };
      });
      await page.goto(PAY_PAGE(this.code));
      await page.waitForNavigation({ timeout: 3000 }).catch(()  => {});
      await page.waitForSelector(_._addr, { visible: true, timeout: 3000 }).catch(() => {});
      await page.click(_._addr);
      if (changeAddr) {
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
      } else {
        await page.keyboard.press('ArrowUp');
        await page.keyboard.press('ArrowUp');
      }
      await page.keyboard.press('Enter');
      await page.waitForSelector(_._checkboxes, { visible: true, timeout: 2000 }).catch(() => {});
      await page.$$eval(_._checkboxes, (elements) => (elements[2] as any)?.click())
      await delay(3000);
      await page.$eval(_._submitCheckOutBtn, (el: any) => (el as any).click());
      await page.waitForNavigation({ timeout: 10000 }).catch(()  => {});
      if (!items || !errItems || !this.checking) throw new Error('Khong nhan dc data');
      log(ctx, items, errItems);
      const avaibleItems = (items as any).filter(({ code }: any) => !(errItems as string[]).concat(BrowserManager.mute).includes(code));
      return avaibleItems;
    } catch (error) {
      console.error({ check: error })
    } finally {
    }
  }

  async check(ctx: Context) {
    // secheduled | undefined
    await this.login();
    if (this.scheduTask1) throw new Error('Bot dang check hang HN roi...');
    this.scheduTask2 = schedule('0 * * * *', () => {
      this.login().catch(console.log);
    })
    while (true) {
      try {
        this.checking = false;
        await this.removeAllItemInCart();
        await this.addAll();
        this.checking = true;
        const [res1, res2] = await Promise.all([
          this.checkHang(ctx, this.page1),
          this.checkHang(ctx, this.page2, true),
        ]);
        if (res1 && res1.length) {
          replyWIthItems(ctx, res1, this.code, `${this.code} - HN:`);
        }
        if (res2 && res2.length) {
          replyWIthItems(ctx, res2, this.code, `${this.code} - HCM:`);
        }
      } catch (error) {
        console.error({ check1: error });
      } finally {
      }
    }
    // this.scheduTask1 = schedule('* * * * *' , async () => {
    //   try {
    //     this.checking = false;
    //     await this.removeAllItemInCart();
    //     await this.addAll();
    //     this.checking = true;
    //     const [res1, res2] = await Promise.all([
    //       this.checkHang(ctx, this.page1),
    //       this.checkHang(ctx, this.page2, true),
    //     ]);
    //     if (res1 && res1.length) {
    //       replyWIthItems(ctx, res1, this.code, `${this.code} - HN:`);
    //     }
    //     if (res2 && res2.length) {
    //       replyWIthItems(ctx, res2, this.code, `${this.code} - HCM:`);
    //     }
    //   } catch (error) {
    //     console.error({ check1: error });
    //   } finally {
    //   }
    // });
  }

  pause1() {
    if (!this.scheduTask1) throw new Error('Chua start check hang HN');
    this.scheduTask1.stop();
  }
  pause2() {
    if (!this.scheduTask2) throw new Error('Chua start check hang HCM');
    this.scheduTask2.stop();
  }

  async auto(_ctx: Context) {
      this.check(_ctx);
  }

  async stop() {
    this.scheduTask1?.destroy();
    this.scheduTask2?.destroy();
    await this.browser?.close();
  }

  async snap1() {
    return await this.page1?.screenshot({ path: 'data/snap1.png', fullPage: true });
  }
  async snap2() {
    return await this.page1?.screenshot({ path: 'data/snap2.png', fullPage: true });
  }
}

export { BrowserManager };
