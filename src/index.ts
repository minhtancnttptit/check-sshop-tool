import { Context, Telegraf } from 'telegraf';
import dotenv from 'dotenv';

import { helpMessage } from './constant';
import { CheckBot } from './check-bot';
import {BrowserManager} from "./browser-manager";



dotenv.config();

const { TOKEN } = process.env;



let checkBot = new CheckBot();

const replyBrowserList = (ctx: Context) => {
  if (Array.from(checkBot.browsers.keys()).length === 0) {
    ctx.reply('Khong co browser nao');
    return;
  }
  const tmp = Array.from(checkBot.browsers.keys()).reduce((preVal, key) => `${preVal}\nBrowser ${key}`, '');
  ctx.reply(`Danh sach browser dang chay: ${tmp}`);
}

const start = () => {
  console.log('start');
  const bot = new Telegraf(TOKEN || '1568311759:AAG411sX-2gOZxCr9njloTaE-2A2T_QuNFc').catch(() => console.log('Error constructor Telegraf'));
  bot.launch().catch(() => {
    console.log('Launch telegram bot error');
  });
  console.log('NewBot iS running...');
  bot.use((ctx, next) => {
    next();
  });

  bot.start(async (ctx) => {
    try {
      ctx.reply('Bot is running...');
      ctx.reply(helpMessage);
      setInterval(() => {
        ctx.reply('[@newptit](tg://user?id=1001954903)', { parse_mode: 'Markdown' });
      }, 10000);
    } catch (error) {
      console.log(error);
    }
  });

  bot.command('help', (ctx) => {
    ctx.reply(helpMessage);
  })

  bot.command('stop', async (ctx) => {
    try {
      const { text } = ctx.message;
      if (!/\/stop\s+\d+/.test(text)) {
        ctx.reply('/stop <number> de tat trinh duyet');
        return;
      }
      const tmp = text.split(/\s+/);
      const id = parseInt(tmp[1]);
      await checkBot.removeBrowser(id);
      ctx.reply(`Browser ${id} is stopped.`)
      replyBrowserList(ctx);
    } catch (error) {
      console.log(error);
      replyBrowserList(ctx);
    }
  });

  bot.command('list', (ctx) => {
    replyBrowserList(ctx);
  })

  bot.command('add', (ctx) => {
    checkBot.addBrowser();
    replyBrowserList(ctx);
  });

  bot.command('log', (ctx) => {
    console.log(ctx);
    console.log(ctx.chat?.id)
    ctx.reply('test');
    ctx.telegram.sendMessage(-583961747, 'test 2')
  })

  bot.command('mute', (ctx) => {
    const { text } = ctx.message;
    // if (!/\/mute\s{1}.+/) {
    //   ctx.reply('/mute <ma_san_phan>: mute bao hang voi san pham ma_san_pham');
    //   return;
    // }
    const tmp = text.split(/\s+/).slice(1);
    BrowserManager.addMute(tmp);
    ctx.reply(`Black list: ${BrowserManager.mute.toString()}`)
  })


  bot.command('set', (ctx) => {
    const { text } = ctx.message;
    if (!/\/set\s{1}\d+\s{1}.+\s{1}.+\s{1}.+/.test(text)) {
      ctx.reply('/set <number> <code> <taikhoan> <matkhau>: set ma xac nhan, tai khoan, mat khau cho browser');
      return;
    }
    const tmp = text.split(/\s+/);
    const id = parseInt(tmp[1]);
    if (!checkBot.browsers.has(id)) {
      ctx.reply(`Browser ${id} chua mo`);
      replyBrowserList(ctx);
      return;
    }
    checkBot.browsers.get(id)?.setCode(tmp[2]);
    checkBot.browsers.get(id)?.setUsername(tmp[3]);
    checkBot.browsers.get(id)?.setPass(tmp[4]);
    ctx.reply(`Thong tin o browser ${id}:
- Ma xac nhan: ${checkBot.browsers.get(id)?.code}
- Tai khoan: ${checkBot.browsers.get(id)?.username}
- Mat khau: ${checkBot.browsers.get(id)?.password}`);
  });

  bot.command('check', async (ctx) => {
    const { text } = ctx.message;
    if (!/\/check\s+\d+/.test(text)) {
      ctx.reply('/check <number> de bat dau auto check o browser');
      return;
    }
    try {
      const tmp = text.split(/\s+/);
      const id = parseInt(tmp[1]);
      await checkBot.browsers.get(id)?.auto(ctx);
    } catch (error) {
      console.log(error);
      // ctx.reply(error);
    }
  })

  bot.command('snap', async (ctx) => {
    await ctx.replyWithChatAction('upload_photo');
    // await checkBot.snap();
    ctx.replyWithPhoto({ source: 'data/snap.png' });
  });

  bot.help((ctx) => {
    ctx.reply(helpMessage);
  });
};

start();