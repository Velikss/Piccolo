const mysql = require('mysql');
const date = require("date-and-time");

exports.run = (client, message, args) => {
    const con = client.con;
    const url = args[0];
    const userID = message.author.id;

    //Check if user already exists
    var sql = 'SELECT * FROM greetings WHERE userID = ' + mysql.escape(userID);
    con.query(sql, function (err, result) {
      if (err) throw err;
      if(result) {
        //User exists
        var sql = `UPDATE greetings SET path = ${mysql.escape(url)}, date = ${date.format(new Date(), "ddd MM DD | hh:mm:ss A")} WHERE userID = ${mysql.escape(userID)}`;
        con.query(sql, function (err, result) {
          if (err) throw err;
          client.logger.log(result.affectedRows + "records(s) updated");
        })
      } else {
        //User does not exist
        var sql = `INSERT INTO greetings (userID, path, type, date) VALUES (${mysql.escape(userID)}, ${mysql.escape(url)}, 'url', ${date.format(new Date(), "ddd MM DD | hh:mm:ss A")})`;
        con.query(sql, function (err, result) {
          if (err) throw err;
          client.logger.log(`1 record inserted`);
        })
      }
    });
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
