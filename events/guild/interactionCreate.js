const { Permissions } = require("discord.js");
const chalk = require('chalk');

module.exports = async(client, interaction) => {
    if (interaction.isCommand() || interaction.isContextMenu()) {
        if (!client.slash.has(interaction.commandName)) return;
        if (!interaction.guild) return;

        const command = client.slash.get(interaction.commandName);
        if(!command) return;

        /// Try to create new database went this member not have!
        await client.CreateAndUpdate(interaction.user.id) /// Can find this module in Handlers/loadCreate.js

        if (!client.dev.includes(interaction.user.id) && client.dev.length > 0) { 
            interaction.reply(`You are not allowed to use this command.`); 
            return;
        }

        console.log(chalk.magenta(`[COMMAND] ${command.name} used by ${interaction.user.tag} from ${interaction.guild.name} (${interaction.guild.id})`));

        if(!interaction.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) return interaction.user.dmChannel.send(`I don't have the permission to send messages in ${interaction.guild.name}`);
        if(!interaction.guild.me.permissions.has(Permissions.FLAGS.VIEW_CHANNEL)) return;
        if(!interaction.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS)) return interaction.reply(`I don't have the permission to send embeds in ${interaction.guild.name}`);

        try {
            command.run(client, interaction);
        } catch (error) {
            console.log(error)
            await interaction.reply({ content: `Something went wrong, try again later.`, ephmeral: true });
        }
    }
}