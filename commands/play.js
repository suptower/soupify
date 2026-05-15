const { SlashCommandBuilder } = require("discord.js");
const { getQueue, getQueueTracks } = require("../music/queue");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Allows you to stream music from YouTube, Spotify and Soundcloud")
    .addStringOption(option =>
      option.setName("song").setDescription("Song name/URL/playlist to play").setRequired(true),
    )
    .addIntegerOption(option =>
      option
        .setName("position")
        .setDescription("Specify position in queue to insert (will be placed last if not valid)")
        .setRequired(false),
    )
    .addBooleanOption(option =>
      option
        .setName("instant")
        .setDescription("If true, the song will instantly start playing (ignores position)")
        .setRequired(false),
    ),
  async execute(interaction, player) {
    await interaction.deferReply();
    if (!interaction.member.voice.channel) {
      return interaction.editReply("You need to be connected to a voice channel.");
    }
    const vc = interaction.member.voice.channel;
    const songString = interaction.options.getString("song");
    const wishPos = interaction.options.getInteger("position");
    const inst = interaction.options.getBoolean("instant");
    const queue = getQueue(player, interaction.guild);
    const queueSizeBefore = queue ? getQueueTracks(queue).length : 0;
    try {
      const result = await player.play(vc, songString, {
        requestedBy: interaction.member,
        nodeOptions: {
          metadata: { channel: interaction.channel },
          leaveOnEmpty: true,
          leaveOnStop: true,
          leaveOnEnd: true,
        },
      });

      if ((inst || wishPos === 0) && result.track.id !== result.queue.currentTrack?.id) {
        result.queue.node.move(result.track, 0);
        result.queue.node.skip();
      } else if (!(wishPos == null) && wishPos > 0 && wishPos < queueSizeBefore) {
        result.queue.node.move(result.track, wishPos - 1);
      }
    } catch (err) {
      console.log(err);
      return interaction.editReply("Error: " + err);
    }

    await interaction.editReply("Success.");
    return interaction.deleteReply();
  },
};
