const mysql = require('mysql');
const date = require("date-and-time");
const fs = require("fs");
const request = require("request");

exports.run = (client, message, args) => {
  client.logger.log(`Saving mp3 for ${message.author.tag}...`, "cmd");
  const con = client.con;
  const url = message.attachments.first().url;
  const userID = message.author.id;
  const path = client.config.downloadPath + message.author.id + '-' +  message.attachments.first().filename;

  //Check if user already exists
  var sql = 'SELECT * FROM greetings WHERE userID = ' + mysql.escape(userID);
  con.query(sql, function (err, result) {
    if (err) throw err;
    //If user exists
    if(result[0] !== undefined) {
      //If user had mp3 before, remove file
      client.logger.log(`Removing old mp3 file for user ${message.author.tag}...`);
      if(result[0].type == 'mp3')
        fs.unlinkSync(result[0].path)

      //Download new file
      client.logger.log(`Downloading file... ${url}`)
      request.get(url)
        .on('error', console.error)
        .pipe(fs.createWriteStream(path));

      //Update database
      var sql = `UPDATE greetings SET path = '${path}', type = 'mp3', date = '${date.format(new Date(), "ddd MM DD | hh:mm:ss A")}' WHERE userID = ${mysql.escape(userID)}`;
      con.query(sql, function (err, result) {
        if (err) throw err;
        client.logger.log(`${result.affectedRows} records(s) updated for user ${message.author.tag}`, "succes");
      })
      //If user does not exist
    } else {
      //Download file
      request.get(url)
        .on('error', console.error)
        .pipe(fs.createWriteStream(path));

      //Save data to database
      var sql = `INSERT INTO greetings (userID, path, type, date) VALUES (${mysql.escape(userID)}, '${path}', 'mp3', '${date.format(new Date(), "ddd MM DD | hh:mm:ss A")}')`;
      con.query(sql, function (err, result) {
        if (err) throw err;
        client.logger.log(`1 record inserted for new user ${message.author.tag}`, "succes");
      })
    }
  });

  //Let user know we're done
  message.reply(`File has been downloaded and the database has been updated!✅`)
};

exports.conf = {
  aliases: []
};

exports.help = {
  name: "mp3",
  category: "",
  description: "",
  usage: "<file>"
};
