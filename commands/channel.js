const mysql = require('mysql');

exports.run = (client, message, args) => {
  const con = client.con;

  //Check if command is valid
  if(args.length !== 1) return (message.reply('You did not supply the right arguments!'));

  //Check if user has admin rights
  if (!message.member.hasPermission("ADMINISTRATOR")) return (message.reply('Only administrators can set the channel!'));

  //Inserting channel to databa
  const channelID = args[0];
  if(!message.guild.channels.has(channelID)) return (message.reply(`The channel you supplied is invalid!`));
  client.logger.log(`Saving voicechannel ${client.channels.get(channelID).name} for guild: ${message.guild.name}...`);

  var sql = `UPDATE guilds SET channel = ${mysql.escape(channelID)} WHERE id = ${mysql.escape(message.guild.id)}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    client.logger.log(`${result.affectedRows} records(s) updated for guild ${message.guild.name}`, "succes");
  });

  message.reply('Channel has been saved to the database ✅, I will now attempt to join the channel...')

  //Join channel
  message.guild.channels.get(channelID).join().then(connection => {
    client.logger.log(`Connected to voicechannel: ${message.guild.channels.get(channelID).name} in ${message.guild.name}`);
  }).catch(e => {
    client.logger.log(e, "error");
  });
}

exports.conf = {
  aliases: ["channel"]
};

exports.help = {
  name: "channel",
  category: "System",
  description: "Sets piccolo voicechannel",
  usage: "channel [channelID]"
};
