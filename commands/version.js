const fs = require('fs');
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const json = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const Version = json.version;
module.exports = {
	data: new SlashCommandBuilder()
		.setName('version')
		.setDescription('Shows bot related information.'),
	async execute(interaction) {
		await interaction.deferReply();
		const InfoEmbed = new EmbedBuilder()
			.setColor('#1db954')
			.setTitle('Information')
			.setAuthor({ name: 'soupify by suptower', iconURL: 'https://i.imgur.com/eB4PoaU.png' })
			.setThumbnail('https://i.imgur.com/8hL40D0.png')
			.setDescription('Discord music bot powered by soupBot, provided by suptower.')
			.addFields(
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Repository', value: 'https://github.com/suptower/soupify' },
			)
			.setTimestamp()
			.setFooter({ text: 'Version ' + Version + ' | Updated: 3rd of November, 2022' });
		await interaction.editReply({ embeds: [InfoEmbed] });
	},
};