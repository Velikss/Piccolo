const mysql = require('mysql');
const date = require("date-and-time");
const fs = require("fs");

exports.run = (client, message, args) => {
  client.logger.log(`Saving url for ${message.author.tag}...`, "cmd");
  const con = client.con;
  const url = args[0];
  const userID = message.author.id;

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

      //Update database
      var sql = `UPDATE greetings SET path = ${mysql.escape(url)}, type = 'url', date = '${date.format(new Date(), "ddd MM DD | hh:mm:ss A")}' WHERE userID = ${mysql.escape(userID)}`;
      con.query(sql, function (err, result) {
        if (err) throw err;
        client.logger.log(`${result.affectedRows} records(s) updated for user ${message.author.tag}`, "succes");
      })
      //If user does not exist
    } else {
      //Save data to database
      var sql = `INSERT INTO greetings (userID, path, type, date) VALUES (${mysql.escape(userID)}, ${mysql.escape(url)}, 'url', '${date.format(new Date(), "ddd MM DD | hh:mm:ss A")}')`;
      con.query(sql, function (err, result) {
        if (err) throw err;
        client.logger.log(`1 record inserted for new user ${message.author.tag}`, "succes");
      })
    }
  });

  //Let user know we're done
  message.reply(`Database has been updated!✅`)
};

exports.conf = {
  aliases: []
};

exports.help = {
  name: "url",
  category: "",
  description: "",
  usage: "<url>"
};
