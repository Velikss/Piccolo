exports.run = (client, guild) => {
  client.logger.log(`I just got removed from guild(${guild.id} | ${guild.name} : ${guild.owner.user.tag}, ${guild.members.size} users)`, "event");

  var sql = `DELETE FROM guilds WHERE id = ${client.mysql.escape(guild.id)}`;
  client.con.query(sql, function (err, result) {
    if (err) throw err;
    client.logger.log(`Removed guild from database.`, "event");
  });
};
