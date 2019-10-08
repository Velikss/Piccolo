exports.run = (client, message) => {
    if(message.author.bot) return;

    const args = message.content.trim().split(/ +/g);

    //Check if I am tagged
    if(args.shift() !== `<@${client.user.id}>`) return;
    client.logger.log(`Message received: ${message.content} from ${message.author.username}`);

    if(args.length == 0) return(message.reply(`Please tell me what to do! :)`));

    //Check if command is valid
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command);
    if(!cmd) return;

    client.logger.log(`${message.author.username} ran command "${command}" with args: ${args}`, "cmd");
    cmd.run(client, message, args);
};
