exports.run = (client) => {
    client.user.setActivity(`you`, { type: "WATCHING" });
    client.logger.log(`Bot is online | Connected as: ${client.user.username} | Guilds: ${client.guilds.size}`,"succes");
};
