const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Allows you to stream music from YouTube, Spotify and Soundcloud')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('Song name/URL/playlist to play')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('position')
                .setDescription('Specify position in queue to insert (will be placed last if not valid)')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('instant')
                .setDescription('If true, the song will instantly start playing (ignores position)')
                .setRequired(false)),
	async execute(interaction, distube) {
        await interaction.deferReply();
        if (!interaction.member.voice.channel) {
            return interaction.editReply("You need to be connected to a voice channel.");
        }
        const vc = interaction.member.voice.channel;
        const songString = interaction.options.getString('song');
        const wishPos = interaction.options.getInteger('position');
        const inst = interaction.options.getBoolean('instant');
        const queue = distube.getQueue(interaction.guild);
        if (queue) {
            if (inst) {
                distube.play(vc,songString,{
                    member: interaction.member,
                    textChannel: interaction.channel,
                    skip: true,
                })
            }
            else {
                if (!(wishPos == null)) {
                    if (wishPos == 0) {
                        distube.play(vc,songString,{
                            member: interaction.member,
                            textChannel: interaction.channel,
                            skip: true,
                        })
                    }
                    else if (wishPos >= queue.songs.length) {
                        distube.play(vc,songString,{
                            member: interaction.member,
                            textChannel: interaction.channel,
                        });
                    }
                    else if (wishPos < queue.songs.length) {
                        await distube.play(vc,songString,{
                            member: interaction.member,
                            textChannel: interaction.channel,
                        });
                        const newQueue = distube.getQueue(interaction.guild);
                        newQueue.songs.splice(wishPos,0,newQueue.songs[newQueue.songs.length-1]);
                        newQueue.songs.splice(newQueue.songs.length-1,1);
                    }
                }
                else {
                    distube.play(vc,songString,{
                        member: interaction.member,
                        textChannel: interaction.channel,
                    });
                }
            }
        }
        else {
            distube.play(vc,songString,{
                member: interaction.member,
                textChannel: interaction.channel,
            });
        }
        await interaction.editReply("Success.");
        return interaction.deleteReply();
	},
};