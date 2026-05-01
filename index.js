require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const fetch = require("node-fetch");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

console.log("🤖 Bot is running...");

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userText = msg.text;

  if (!userText) return;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are a professional customer service agent for an online clothing store.

Rules:
- Answer like a real human admin
- Be friendly and persuasive
- Help customers decide to buy
- Keep answers short and clear
            `,
          },
          {
            role: "user",
            content: userText,
          },
        ],
      }),
    });

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "Maaf kak, lagi error 🙏";

    bot.sendMessage(chatId, reply);
  } catch (err) {
    console.log(err);
    bot.sendMessage(chatId, "Server error kak 🙏");
  }
});
