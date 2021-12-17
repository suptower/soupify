const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('version')
		.setDescription('Shows bot related information.'),
	async execute(interaction, distube) {
        await interaction.deferReply();
        const InfoEmbed = new MessageEmbed()
        .setColor('#1db954')
        .setTitle("Information")
        .setAuthor('soupify by suptower', 'https://i.imgur.com/eB4PoaU.png')
        .setThumbnail('https://i.imgur.com/8hL40D0.png')
        .setDescription('Discord music bot powered by soupBot, provided by suptower.')
        .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Repository', value: 'https://github.com/suptower/soupify' },
        )
        .setTimestamp()
        .setFooter('Version 1.0.7 | Updated: 17th of December, 2021');
    await interaction.editReply({embeds: [InfoEmbed]});
	},
};