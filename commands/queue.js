const { SlashCommandBuilder, ButtonStyle } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Show the queue'),
	async execute(interaction, distube) {
		await interaction.deferReply();
		const queue = distube.getQueue(interaction.guild);
		if (!queue) {
			return interaction.editReply('There is no queue.');
		}
		else {
			const row0 = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('prev')
						.setLabel('Previous')
						.setStyle(ButtonStyle.Primary)
						.setEmoji('⬅️')
						.setDisabled(true),
				)
				.addComponents(
					new ButtonBuilder()
						.setCustomId('next')
						.setLabel('Next')
						.setStyle(ButtonStyle.Success)
						.setEmoji('➡️'),
				);
			const row1 = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('prev')
						.setLabel('Previous')
						.setStyle(ButtonStyle.Danger)
						.setEmoji('⬅️')
						.setDisabled(false),
				)
				.addComponents(
					new ButtonBuilder()
						.setCustomId('next')
						.setLabel('Next')
						.setStyle(ButtonStyle.Success)
						.setEmoji('➡️'),
				);
			const row2 = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('prev')
						.setLabel('Previous')
						.setStyle(ButtonStyle.Danger)
						.setEmoji('⬅️'),
				)
				.addComponents(
					new ButtonBuilder()
						.setCustomId('next')
						.setLabel('Next')
						.setStyle(ButtonStyle.Success)
						.setEmoji('➡️')
						.setDisabled(true),
				);
			const row3 = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('prev')
						.setLabel('Previous')
						.setStyle(ButtonStyle.Danger)
						.setEmoji('⬅️')
						.setDisabled(true),
				)
				.addComponents(
					new ButtonBuilder()
						.setCustomId('next')
						.setLabel('Next')
						.setStyle(ButtonStyle.Success)
						.setEmoji('➡️')
						.setDisabled(true),
				);
			let infoBuffer = '';
			let offset = 0;
			let msgId = 0;
			for (let i = 0; (i < 10 && i < queue.songs.length); i++) {
				infoBuffer += (i + offset) + ' - [' + queue.songs[i].formattedDuration + '] - ' + queue.songs[i].name + '\n';
			}
			if (queue.songs.length > 10) {
				await interaction.channel.send({ content: '```------------------------------ 📻   CURRENT QUEUE ------------------------------\n\n' + infoBuffer + '\n------------------------------ 📻   PAGE (' + ((offset / 10) + 1) + '/' + parseInt((((queue.songs.length - 1) / 10) + 1)) + ')   ------------------------------```', components: [row0] }).then(message => {
					msgId = message.id;
				});
			}
			else {
				await interaction.channel.send({ content: '```------------------------------ 📻   CURRENT QUEUE ------------------------------\n\n' + infoBuffer + '\n------------------------------ 📻   PAGE (' + ((offset / 10) + 1) + '/' + parseInt((((queue.songs.length - 1) / 10) + 1)) + ')   ------------------------------```', components: [row3] }).then(message => {
					msgId = message.id;
				});
			}
			const collector = interaction.channel.createMessageComponentCollector({
				time: 30000,
			});
			collector.on('collect', async i => {
				if (i.customId === 'next' && i.message.id == msgId) {
					collector.resetTimer();
					offset += 10;
					infoBuffer = '';
					for (let x = 0; x < 10; x++) {
						if (x + offset < queue.songs.length && x + offset >= 0) {
							infoBuffer += (x + offset) + ' - [' + queue.songs[x + offset].formattedDuration + '] - ' + queue.songs[x + offset].name + '\n';
						}
					}
					if (offset + 10 >= queue.songs.length) {
						await i.update({ content: '```------------------------------ 📻   CURRENT QUEUE ------------------------------\n\n' + infoBuffer + '\n------------------------------ 📻   PAGE (' + ((offset / 10) + 1) + '/' + parseInt((((queue.songs.length - 1) / 10) + 1)) + ')   ------------------------------```', components: [row2] });
					}
					else {
						await i.update({ content: '```------------------------------ 📻   CURRENT QUEUE ------------------------------\n\n' + infoBuffer + '\n------------------------------ 📻   PAGE (' + ((offset / 10) + 1) + '/' + parseInt((((queue.songs.length - 1) / 10) + 1)) + ')   ------------------------------```', components: [row1] });
					}
				}
				else if (i.customId === 'prev' && i.message.id == msgId) {
					collector.resetTimer();
					offset -= 10;
					infoBuffer = '';
					for (let x = 0; x < 10; x++) {
						if (x + offset < queue.songs.length && x + offset >= 0) {
							infoBuffer += (x + offset) + ' - [' + queue.songs[x + offset].formattedDuration + '] - ' + queue.songs[x + offset].name + '\n';
						}
					}
					if (offset == 0) {
						await i.update({ content: '```------------------------------ 📻   CURRENT QUEUE ------------------------------\n\n' + infoBuffer + '\n------------------------------ 📻   PAGE (' + ((offset / 10) + 1) + '/' + parseInt((((queue.songs.length - 1) / 10) + 1)) + ')   ------------------------------```', components: [row0] });
					}
					else {
						await i.update({ content: '```------------------------------ 📻   CURRENT QUEUE ------------------------------\n\n' + infoBuffer + '\n------------------------------ 📻   PAGE (' + ((offset / 10) + 1) + '/' + parseInt((((queue.songs.length - 1) / 10) + 1)) + ')   ------------------------------```', components: [row1] });
					}
				}
			});
			collector.on('end', () => {
				interaction.channel.messages.fetch(msgId).then(message => message.delete());
			});
			return interaction.deleteReply();
		}
	},
};