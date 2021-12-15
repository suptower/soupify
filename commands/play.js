const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Allows you to stream music from YouTube, Spotify and Soundcloud')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('Song name/URL to play')
                .setRequired(true)),
	async execute(interaction, distube) {
        await interaction.deferReply();
        if (!interaction.member.voice.channel) {
            return interaction.editReply("You need to be connected to a voice channel.");
        }
        const vc = interaction.member.voice.channel;
        const songString = interaction.options.getString('song');
        const queue = distube.getQueue(interaction.guild);
        distube.playVoiceChannel(vc,songString,{
            member: interaction.member,
            textChannel: interaction.channel,
        });
        await interaction.editReply("Success.");
        return interaction.deleteReply();
	},
};