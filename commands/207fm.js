const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { enqueuePlaylist } = require("../music/playlists");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("207fm")
    .setDescription("APACHE BLEIBT GLEICH.")
    .addBooleanOption(option =>
      option.setName("shuffle").setDescription("Whether to shuffle the playlist").setRequired(false),
    ),
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
    const songString = "https://open.spotify.com/playlist/7x1xrBl5lVg63ppvEaxdrb?si=8e11c61e50134ad8";

    try {
      await enqueuePlaylist({
        player,
        interaction,
        playlistUrl: songString,
        shuffle,
      });
    } catch (error) {
      console.error(error);
      return interaction.editReply("Error: " + error.message);
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
