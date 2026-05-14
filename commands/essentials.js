const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder().setName("essentials").setDescription("Plays Essentials 2010 playlist"),
  async execute(interaction, player) {
    await interaction.deferReply();
    if (!interaction.member.voice.channel) {
      return interaction.editReply("You need to be connected to a voice channel.");
    }
    const InfoEmbed = new EmbedBuilder()
      .setColor("#1db954")
      .setTitle("ESSENTIALS 2010")
      .setThumbnail("https://i.imgur.com/N1mTQpR.png")
      .setDescription("A playlist by suptower, honoring the best of the past decade.")
      .addFields(
        { name: "Author", value: "https://spoti.fi/3yz6Wdg" },
        { name: "Playlist", value: "https://spoti.fi/3GUVTOr" },
      );
    const vc = interaction.member.voice.channel;
    const songString = "https://open.spotify.com/playlist/1FQypuz87kt9ICJi64CjHq?si=2a03feeb2f8c4cd5";
    await player.play(vc, songString, {
      requestedBy: interaction.member,
      nodeOptions: {
        metadata: { channel: interaction.channel },
        leaveOnEmpty: true,
        leaveOnStop: true,
        leaveOnEnd: true,
      },
    });
    interaction.channel.send({ embeds: [InfoEmbed] });
    return await interaction.editReply(
      "<:essentials:921394784915050516>   Successfully added `ESSENTIALS 2010` to the queue.",
    );
  },
};
