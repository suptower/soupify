const { SlashCommandBuilder } = require('discord.js');
const { Op } = require('sequelize');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Display command stats'),
	async execute(interaction, Tags) {
		await interaction.deferReply();
		await Tags.findAll({ where: {
			command: {
				[Op.not]: 'stats',
			},
		}	}).then(tagList => {
			let tagString = 'Command name - Usage count\n';
			for (const tag of tagList) {
				let commandName = tag.get('command');
				commandName = commandName.padEnd(12, ' ');
				tagString += `${commandName} - ${tag.get('usage_count')}\n`;
			}
			tagString += '\nTotal commands: ' + tagList.length;
			tagString += '\nTotal usage: ' + tagList.reduce((acc, tag) => acc + tag.get('usage_count'), 0);
			tagString += '\nAverage usage: ' + (tagList.reduce((acc, tag) => acc + tag.get('usage_count'), 0) / tagList.length).toFixed(2);
			tagString += '\nStats counting since: 31st of January, 2023';
			return interaction.editReply('```' + tagString + '```');
		});
	},
};