const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder().setName("207fm").setDescription("APACHE BLEIBT GLEICH.").addBooleanOption(option => option.setName("shuffle").setDescription("Whether to shuffle the playlist").setRequired(false)),
  async execute(interaction, player) {
    await interaction.deferReply();
    if (!interaction.member.voice.channel) {
      return interaction.editReply("You need to be connected to a voice channel.");
    }
    const shuffle = interaction.options.getBoolean("shuffle") ?? false;
    const InfoEmbed = new EmbedBuilder()
      .setColor("#1db954")
      .setTitle("APACHE 207")
      .setThumbnail("https://i.imgur.com/CrdWQZh.jpg")
      .setDescription("Der Gangster, der ab und an das Tanzbein schwingt.")
      .addFields(
        { name: "Spotify", value: "https://spoti.fi/3m9BCgg" },
        { name: "Playlist", value: "https://spoti.fi/3e7i3k9" },
      );
    const vc = interaction.member.voice.channel;
    const songString = "https://open.spotify.com/playlist/7x1xrBl5lVg63ppvEaxdrb?si=8e11c61e50134ad8";

    // Shuffle the playlist if the option is enabled^
    if (shuffle) {
      const playlist = await player.playlist(songString, {
        requestedBy: interaction.user,
      });
      playlist.tracks.shuffle();
      await player.play(vc, playlist, {
        requestedBy: interaction.user,
        nodeOptions: {
          metadata: { channel: interaction.channel },
          leaveOnEmpty: true,
          leaveOnStop: true,
          leaveOnEnd: true,
        },
      });
    } else {
      await player.play(vc, songString, {
        requestedBy: interaction.member,
        nodeOptions: {
          metadata: { channel: interaction.channel },
          leaveOnEmpty: true,
          leaveOnStop: true,
          leaveOnEnd: true,
        },
      });
    }
    interaction.channel.send({ embeds: [InfoEmbed] });
    if (shuffle) {
      return await interaction.editReply(
        "<:apache207:921394699456102410>   Successfully added `APACHE BLEIBT GLEICH` to the queue and shuffled the playlist.",
      );
    }
    return await interaction.editReply(
      "<:apache207:921394699456102410>   Successfully added `APACHE BLEIBT GLEICH` to the queue.",
    );
  },
};
