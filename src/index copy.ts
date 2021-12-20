import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const { TOKEN } = process.env;

const bot = new Telegraf(TOKEN || '1568311759:AAG411sX-2gOZxCr9njloTaE-2A2T_QuNFc');

bot.use((ctx, next) => {
  ctx.state.name = ctx.from?.first_name;
  ctx.reply('You used the bot.');
  next();
});

bot.mention(['botfather'], (ctx) => {
  const { from } = ctx;
  ctx.reply(`${from?.first_name} have mentioned bot.`);
});

/**
 * Handle phone numbers
 */
bot.phone('0946605851', (ctx) => {
  ctx.reply('Phone 0946605851');
});

/**
 * Handle hashtag
 */
bot.hashtag('#new', (ctx) => {
  ctx.reply('Hashtag new');
});

/**
 * Registers middleware for handling matching text messages.
 */
bot.hears(/c\s*a\s*t\s*/, (ctx) => {
  ctx.reply('Meow');
});

/**
 * Registers middleware for handling provided update types.
 */
bot.on(['text', 'sticker'], (ctx, next) => {
  const { name } = ctx.state;
  ctx.reply(`${name} have entered the text message or sticker.`);
  next();
});



bot.start((ctx) => {
  const { from } = ctx;
  // console.log(ctx);
  // console.log(ctx.from);
  // console.log(ctx.chat);
  // console.log(ctx.message);
  // console.log(ctx.updateType);
  if (ctx.chat?.id) {
    bot.telegram.sendMessage(
      ctx.chat.id,
      '<b>bold</b>',
      {
        parse_mode: 'HTML',
        disable_notification: true,
      });
  }
  ctx.reply(
    `[${from?.first_name}](https://fb.com/newptit.dev) *have entered the start command.*`,
    // `[I'm an inline-style link](https://www.google.com)`,
    {
      parse_mode: 'Markdown',
      disable_notification: true,
    }
  );
});

bot.help((ctx) => {
  ctx.reply('You have entered the help command.');
});

bot.settings((ctx) => {
  ctx.reply('You have entered the settings command.');
});

bot.command(['test', 'Test', 'TEST'], (ctx) => {
  ctx.reply('test');
});


const start = () => {
  bot.launch();
  console.log('NewBot iS running...');
};

start();