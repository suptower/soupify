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
            return interaction.editReply("There is no queue.");
        }
        const song = queue.songs[0];
        var timeCurrent = queue.currentTime;
        var timeCurrentFormatted = queue.formattedCurrentTime;
        var duration = song.duration;
        var durationFormatted = song.formattedDuration;
        var partial = parseInt(duration/15);
        var done = parseInt(timeCurrent/partial);
        var undone = 15-done;
        var infoBuffer = "▶️  ";
        for (let i = 0; i < done; i++) {
            infoBuffer += "▬";
        }
        infoBuffer += "🔘";
        for (let i = 0; i < undone; i++) {
            infoBuffer += "▬";
        }
        var timeDisplay = "["+timeCurrentFormatted+"/"+durationFormatted+"]";
        const nowplayingEmbed = new MessageEmbed()
		.setColor('#1db954')
		.setTitle("ℹ️   Currently playing")
		.addFields(
			{ name: 'Title', value: `${song.name}`},
            { name: infoBuffer, value: '\u200B', inline: true},
			{ name: timeDisplay, value: '\u200B', inline: true},
		);
        return interaction.editReply({embeds:[nowplayingEmbed]});
	},
};