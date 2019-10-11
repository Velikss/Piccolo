const mysql = require('mysql');

exports.run = (client) => {
  const con = client.con;

  client.user.setActivity(`you`, { type: "WATCHING" });
  client.logger.log(`Bot is online | Connected as: ${client.user.username} | Guilds: ${client.guilds.size}`,"succes");

  client.guilds.forEach(function(guild, guildId) {
    var sql = 'SELECT channel FROM guilds WHERE id = ' + mysql.escape(guild.id);
    con.query(sql, function (err, result) {
      if (err) throw err;
      if(result[0].channel !== null) {
        const channelID = result[0].channel;

        //Join voice channel
        const channel = client.channels.get(channelID);

        if (!channel) return client.logger.log("I tried connecting to a channel that doesn't exist.", "error");
        channel.join().then(connection => {
          client.logger.log(`Connected to voicechannel: ${guild.name}: #${channel.name}`);
        }).catch(e => {
          client.logger.log(e, "error");
        });
      }
    });
  });
};
