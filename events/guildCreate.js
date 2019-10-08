const date = require("date-and-time");

exports.run = (client, guild) => {
  client.logger.log(`I just got added to another guild! (${guild.id} | ${guild.name} : ${guild.owner.user.tag}, ${guild.members.size} users)`, "event");

  var sql = `INSERT INTO guilds (id, owner, joined) VALUES (${client.mysql.escape(guild.id)}, ${client.mysql.escape(guild.owner.user.id)}, '${date.format(new Date(), "ddd MM DD | hh:mm:ss A")}')`;
  client.con.query(sql, function (err, result) {
    if (err) throw err;
    client.logger.log(`Added new guild to database.`, "event");
  });
};
