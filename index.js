import { Bot, Api } from "node-telegram-bot-api";
import { again_markup, reply_markup } from "./markups.js";
import http from "http";
import "dotenv/config";

const token = process.env.BOT_TOKEN;;

const bot = new Bot(token);
const api = new Api(token);

await api.setMyCommands({
  commands: [
    {
      command: "start",
      description: "Початкове вітання",
    },
    {
      command: "info",
      description: "Отримати інформацію про користувача!",
    },
    {
      command: "game",
      description: "Гра відгадай число",
    },
  ],
});

const chats = {};

const startGame = async (chat_id) => {
  await api.sendMessage({
    chat_id,
    text: "Зараз я загадаю цифру від 0 до 9 , а ти маєш відгадати!",
  });
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chat_id] = randomNumber;
  return api.sendMessage({
    chat_id,
    text: "Відгадуй число!",
    reply_markup,
  });
};

const start = async () => {
  bot.on("message", async (msg) => {
    const text = msg.update.message.text;
    const chatId = msg.update.message.chat.id;

    if (text === "/start") {
      await api.sendSticker({
        chat_id: chatId,
        sticker:
          "CAACAgIAAxkBAAMfapdC0HAnnSd9H3kiw_ctiqx8IWcAAowVAAKOG-BLIE1BCoaHw3E9BA",
      });
      return api.sendMessage({ chat_id: chatId, text: "Ласкаво просимо!" });
    }

    if (text === "/info") {
      return api.sendMessage({
        chat_id: chatId,
        text: `Тебе звати ${msg.message.from.first_name ?? ""} ${msg.message.from.last_name ?? ""}`,
      });
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    return api.sendMessage({ chat_id: chatId, text: "Невідома команда!" });
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.update.callback_query.data;
    const chat_id = msg.update.callback_query.message.chat.id;

    if (data === "/again") {
      return startGame(chat_id);
    }

    if (+data === +chats[chat_id]) {
      return await api.sendMessage({
        chat_id,
        text: `Вітаю ви вгадали число ${data}`,
        reply_markup: again_markup,
      });
    } else {
      return api.sendMessage({
        chat_id,
        text: `Нажаль ви не вгадали , загадане число ${chats[chat_id]}`,
        reply_markup: again_markup,
      });
    }
  });

  await bot.startPolling();
};

const PORT = process.env.PORT || 3000;

http
  .createServer((req, res) => {
    res.writeHead(200);
    res.end("Telegram bot is running");
  })
  .listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });

start();
