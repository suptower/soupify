const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('207fm')
		.setDescription('APACHE BLEIBT GLEICH.'),
	async execute(interaction, distube) {
        await interaction.deferReply();
        if (!interaction.member.voice.channel) {
            return interaction.editReply("You need to be connected to a voice channel.");
        }
        const InfoEmbed = new MessageEmbed()
        .setColor('#1db954')
        .setTitle("APACHE 207")
        .setThumbnail('https://i.imgur.com/CrdWQZh.jpg')
        .setDescription('Der Gangster, der ab und an das Tanzbein schwingt.')
        .addFields(
            { name: 'Spotify', value: 'https://spoti.fi/3m9BCgg' },
            { name: 'Playlist', value: 'https://spoti.fi/3e7i3k9' }
        );
        const vc = interaction.member.voice.channel;
        const songString = "https://open.spotify.com/playlist/7x1xrBl5lVg63ppvEaxdrb?si=8e11c61e50134ad8";
        const queue = distube.getQueue(interaction.guild);
        distube.playVoiceChannel(vc,songString,{
            member: interaction.member,
            textChannel: interaction.channel,
        });
        queue.textChannel.send({embeds: [InfoEmbed]});
        return await interaction.editReply("<:apache207:921394699456102410>   Successfully added `APACHE BLEIBT GLEICH` to the queue.");
	},
};