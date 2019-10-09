exports.run = (client, message) => {
    if(message.author.bot) return;

    const args = message.content.trim().split(/ +/g);

    //Check if I am tagged
    if(args.shift() !== `<@${client.user.id}>`) return;
    client.logger.log(`Message received: ${message.content} from ${message.author.username}`);

    if(args.length == 0) return(message.reply(`Please tell me what to do! :)`));

    //Check if url is given
    if(new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(args[0]) && args.length === 1)
      return(client.commands.get('url').run(client, message, args));

    //No URL found, so it must be a normal command
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command);
    if(!cmd) return(message.reply(`I don't recognize this as a valid command.`));

    client.logger.log(`${message.author.username} ran command "${command}" with args: ${args}`, "cmd");
    cmd.run(client, message, args);
};
