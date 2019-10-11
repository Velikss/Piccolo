exports.run = (client, message, args) => {
    const clean = text => {
        if (typeof (text) === "string")
            return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
        else
            return text;
    };

    if (message.author.id === 294909299287654401) {
        client.logger.warn("Someone untrusted tried evaluating code.");
        message.channel.send(":warning: Sadly I do not recognize you as a trustable user.");
        return;
    }
    try {
        const code = args.join(" ");
        let evaled = eval(code);

        if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);

        message.channel.send(clean(evaled), { code: "xl" });
    } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
};

exports.conf = {
  aliases: ["run"]
};

exports.help = {
  name: "eval",
  category: "System",
  description: "Evaluates JavaScript code, only available for trusted users",
  usage: "eval [code]"
};
