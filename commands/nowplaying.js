const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('nowplaying')
		.setDescription('Information to the current playing song.'),
	async execute(interaction, distube) {
		await interaction.deferReply();
		const queue = distube.getQueue(interaction.guild);
		if (!queue) {
			return interaction.editReply('There is no queue.');
		}
		const song = queue.songs[0];
		const timeCurrent = queue.currentTime;
		const timeCurrentFormatted = queue.formattedCurrentTime;
		const duration = song.duration;
		const durationFormatted = song.formattedDuration;
		const partial = parseInt(duration / 15);
		const done = parseInt(timeCurrent / partial);
		const undone = 15 - done;
		let infoBuffer = '▶️  ';
		for (let i = 0; i < done; i++) {
			infoBuffer += '▬';
		}
		infoBuffer += '🔘';
		for (let i = 0; i < undone; i++) {
			infoBuffer += '▬';
		}
		const timeDisplay = '[' + timeCurrentFormatted + '/' + durationFormatted + ']';
		const nowplayingEmbed = new MessageEmbed()
			.setColor('#1db954')
			.setTitle('ℹ️   Currently playing')
			.addFields(
				{ name: 'Title', value: `${song.name}` },
				{ name: infoBuffer, value: '\u200B', inline: true },
				{ name: timeDisplay, value: '\u200B', inline: true },
			);
		return interaction.editReply({ embeds:[nowplayingEmbed] });
	},
};