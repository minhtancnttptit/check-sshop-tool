import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import fs from 'fs';

import axios from './axios';
import { COMAND, helpMessage } from './constant';
// import { start, stop } from './telegram';

dotenv.config();

const { TOKEN, VERIFY_CODE } = process.env;

const bot = new Telegraf(TOKEN || '1568311759:AAG411sX-2gOZxCr9njloTaE-2A2T_QuNFc');

const start = () => {
  bot.launch();
  console.log('NewBot iS running...');
};

bot.on('text', (ctx, next) => {
  const { message, from, chat } = ctx;
  const { text } = message;
  if (from) {
    const { first_name } = from;
    ctx.telegram.sendMessage('-583961747', `${first_name} said: ${text}`, { disable_notification: true });
  }
  next();
})

bot.start((ctx, next) => { 
  ctx.reply('Hi I am New Bot'); 
  ctx.reply(helpMessage);
});

bot.help((ctx, next) => {
  ctx.reply(helpMessage);
});

bot.command(COMAND.ECHO, (ctx, next) => {
  const { text } = ctx.message;
  const message = text.slice(COMAND.ECHO.length + 1).trim();
  ctx.reply(message);
});

bot.command(COMAND.IMAGE, (ctx, next) => {
  ctx.replyWithChatAction('upload_photo');
  ctx.replyWithPhoto({ source: fs.createReadStream('static/lan.jpg') }, { reply_to_message_id: ctx.message.message_id });
});

bot.command(COMAND.IMAGES, (ctx) => {
  const allPhotos = ['static/lan.jpg', 'static/lan2.jpg']
  const mediaGroup = allPhotos.map((photo) => ({
    type: 'photo' as 'photo', 
    media: { source: fs.createReadStream(photo) },
  }));
  ctx.replyWithChatAction('upload_photo');
  ctx.replyWithMediaGroup(mediaGroup);
});

bot.command(COMAND.DOC, (ctx) => {
  ctx.replyWithChatAction('upload_document');
  ctx.replyWithDocument(
    { source: fs.createReadStream('static/doc.md') },
    { thumb: { source: fs.createReadStream('static/lan2.jpg') },
  });
});

bot.command(COMAND.HOME, (ctx) => {
  ctx.replyWithLocation(20.9641081, 105.7659578);
});

bot.command(COMAND.CAT, async (ctx) => {
  const { message } = ctx;
  const { text } = message;
  ctx.replyWithChatAction('upload_photo');
  if (text === `/${COMAND.CAT}`) {
    const response = await axios.get<{ file : string }>('https://aws.random.cat/meow');
    const { status, data } = response;
    if (status !== 200) return;
    const { file } = data;
    ctx.replyWithPhoto({ url: file })
  } else {
    ctx.replyWithPhoto(`https://cataas.com/cat/says/${text.slice(COMAND.CAT.length + 1).trim()}`)
  }
});

bot.command(COMAND.PLAY, (ctx) => {
  ctx.reply('Choose one', { reply_markup: {
    inline_keyboard: [
      [{ text: 'Dam', callback_data: 'dam' }],
      [{ text: 'La', callback_data: 'la' }],
      [{ text: 'Keo', callback_data: 'dam' }],
    ],
  }});
});

bot.action('dam', (ctx) => {
  ctx.answerCbQuery('Hello dam');
  ctx.reply('You click dam');
})

bot.on('text', (ctx) => {
  const { message } = ctx;
  const { text } = message;
  if (text.startsWith('/')) {
    
  }
});

start();