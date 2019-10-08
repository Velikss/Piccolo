const Discord = require(`discord.js`);
const Enmap = require("enmap");

const client = new Discord.Client();

client.mysql = require('mysql');
client.config = require("./config.json");
client.logger = require("./functions/logger");
client.ytdl = require('ytdl-core');
client.fs = require("fs");

client.con = client.mysql.createConnection({
host     : client.config.host,
user     : client.config.user,
password : client.config.password,
database : client.config.database
});

client.con.connect(error => {
  if(error) throw error;
    client.logger.log(`Connection to SQL: ${client.config.host} successful!`,'succes');
});

client.fs.readdir(`./events/`,
    (err, files) => {
        client.logger.log("Loading " + files.length + " events...");
        if (err) return client.logger.error(err);
        files.forEach(file => {
            const event = require(`./events/${file}`);
            const eventName = file.split(".")[0];
            client.on(eventName, (...args) => event.run(client, ...args));
        });
    });

client.commands = new Enmap();

client.fs.readdir("./commands/",
    (err, files) => {
      client.logger.log("Loading " + files.length + " commands...")
      if (err) return console.error(err);
      files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        client.logger.log(`Attempting to load command ${commandName}`);
        client.commands.set(commandName, props);
      });
    });

client.login(client.config.token);

client.on("disconnect", () => client.logger.log("Bot is disconnecting...", "warning"))
    .on("reconnect", () => client.logger.log("Bot reconnecting...", "warning"))
    .on("error", e => client.logger.error(e))
    .on("warn", info => client.logger.warn(info));
