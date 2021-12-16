const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Allows you to stream music from YouTube, Spotify and Soundcloud')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('Song name/URL to play')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('insertPosition')
                .setDescription('Specify position in queue to insert (will be placed last if empty or greater than last queue element)')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('instant')
                .setDescription('If true, the song will instantly start playing (ignores insertPosition)')
                .setRequired(false)),
	async execute(interaction, distube) {
        await interaction.deferReply();
        if (!interaction.member.voice.channel) {
            return interaction.editReply("You need to be connected to a voice channel.");
        }
        const vc = interaction.member.voice.channel;
        const songString = interaction.options.getString('song');
        const wishPos = interaction.options.getInteger('insertPosition');
        const inst = interaction.options.getBoolean('instant');
        const queue = distube.getQueue(interaction.guild);
        if (queue) {
            if (inst) {
                distube.playVoiceChannel(vc,songString,{
                    member: interaction.member,
                    textChannel: interaction.channel,
                    skip: true,
                })
            }
            else {
                if (!(insertPosition == null)) {
                    if (insertPosition == 0) {
                        distube.playVoiceChannel(vc,songString,{
                            member: interaction.member,
                            textChannel: interaction.channel,
                            skip: true,
                        })
                    }
                    else if (insertPosition >= queue.songs.length) {
                        distube.playVoiceChannel(vc,songString,{
                            member: interaction.member,
                            textChannel: interaction.channel,
                        });
                    }
                    else if (insertPosition < queue.songs.length) {
                        distube.search(songString).then(searchRes => {
                            const songToAdd = new distube.song(searchRes,interaction.member,searchRes.url);
                            queue.addToQueue(songToAdd,insertPosition,true);
                        })
                    }
                }
            }
        }
        else {
            distube.playVoiceChannel(vc,songString,{
                member: interaction.member,
                textChannel: interaction.channel,
            });
        }
        await interaction.editReply("Success.");
        return interaction.deleteReply();
	},
};