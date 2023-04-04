const qrcode = require("qrcode-terminal");
const axios = require("axios");
const fs = require("fs");
const mime = require("mime-types");
const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");

  const number = "+94702108148";

  // Your message.
  const text = "Hi I'm Alive👀";
  const chatId = number.substring(1) + "@c.us";

  client.sendMessage(chatId, text);
});

client.on("message", (message) => {
  if (message.body === "ping") {
    message.reply("pong");
  }
});
client.on("message", (message) => {
  if (message.body === "Hi") {
    message.reply("Hello");
  }
});
client.on("message", (message) => {
  if (message.body === "Help") {
    message.reply("What are you want ?");
  }
});

client.on("message", (message) => {
  if (message.body === "Sticker")
    if (message.hasMedia) {
      message.downloadMedia().then((media) => {
        if (media) {
          const mediaPath = "./downloaded-media/";
          if (!fs.existsSync(mediaPath)) {
            fs.mkdirSync(mediaPath);
          }

          const extension = mime.extension(media.mimetype);
          const filename = new Date().getTime();
          const fullFilename = mediaPath + filename + "." + extension;
          // Save to file
          try {
            fs.writeFileSync(fullFilename, media.data, {
              encoding: "base64",
            });
            console.log("File downloaded successfully!", fullFilename);
            console.log(fullFilename);
            MessageMedia.fromFilePath((filePath = fullFilename));
            client.sendMessage(
              message.from,
              new MessageMedia(media.mimetype, media.data, filename),
              {
                sendMediaAsSticker: true,
                stickerAuthor: "TRX~MD",
                stickerName: "🇬‌ 🇷‌ 🇴‌ 🇺‌ 🇵‌  ❌",
              }
            );
            fs.unlinkSync(fullFilename);
            console.log(`File Deleted successfully!`);
          } catch (err) {
            console.log("Failed to save the file:", err);
            console.log(`File Deleted successfully!`);
          }
        }
      });
    } else {
      message.reply(`send image with caption *Sticker* `);
    }
});

client.initialize();
