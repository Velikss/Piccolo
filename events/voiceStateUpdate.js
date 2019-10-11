const mysql = require('mysql');
const ytdl = require('ytdl-core');

exports.run = (client, oldMember, newMember) => {
  const con = client.con;
  const guildID = newMember.guild.id;

  //Check if member is bot
  if (newMember.user.bot) return;

  //Make sure there was an actual switch in channels
  if (oldMember.voiceChannel == newMember.voiceChannel || newMember.voiceChannel === undefined) return;

  //If member joined my channel
  if (client.voiceConnections.get(guildID).channel.id === newMember.voiceChannel.id) {
    var voiceConnection = client.voiceConnections.get(guildID);
    var channelID = newMember.voiceChannel.id;

    var sql = 'SELECT * FROM greetings WHERE userID = ' + mysql.escape(newMember.user.id);
    con.query(sql, function(err, result) {
      if(err) throw err;
      //If user exists
      if(result[0] !== undefined) {
        //If type = url
        if(result[0].type === 'url') {
          client.logger.log(`User detected! Starting URL audio stream on ${client.channels.get(channelID).name} (${channelID})...`, "sound");
          const stream = ytdl(result[0].path, { filter : 'audioonly'});
          const streamOptions= { seek: 0, volume: 1 };
          const dispatcher= client.voiceConnections.get(guildID).playStream(stream, streamOptions);
        }

        //If type = mp3
        if(result[0].type === 'mp3') {
          client.logger.log(`User detected! Starting MP3 audio stream on ${client.channels.get(channelID).name} (${channelID})...`, "sound");
          const streamOptions= { seek: 0, volume: 1 };
          const dispatcher = client.voiceConnections.get(guildID).playFile(result[0].path);
        }
      }
    })
  }
};
