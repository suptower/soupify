const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { getQueue } = require("../music/queue");
module.exports = {
  data: new SlashCommandBuilder().setName("nowplaying").setDescription("Information to the current playing song."),
  async execute(interaction, player) {
    await interaction.deferReply();
    const queue = getQueue(player, interaction.guild);
    if (!queue || !queue.currentTrack) {
      return interaction.editReply("There is no queue.");
    }
    const song = queue.currentTrack;
    const timestamp = queue.node.getTimestamp();
    const timeCurrent = parseInt((timestamp?.current?.value ?? 0) / 1000);
    const timeCurrentFormatted = timestamp?.current?.label ?? "0:00";
    const duration = parseInt(song.durationMS / 1000);
    const durationFormatted = song.duration;
    const partial = Math.max(parseInt(duration / 15), 1);
    const done = Math.min(15, parseInt(timeCurrent / partial));
    const undone = 15 - done;
    let infoBuffer = "▶️  ";
    for (let i = 0; i < done; i++) {
      infoBuffer += "▬";
    }
    infoBuffer += "🔘";
    for (let i = 0; i < undone; i++) {
      infoBuffer += "▬";
    }
    const timeDisplay = "[" + timeCurrentFormatted + "/" + durationFormatted + "]";
    const nowplayingEmbed = new EmbedBuilder()
      .setColor("#1db954")
      .setTitle("ℹ️   Currently playing")
      .addFields(
        { name: "Title", value: `${song.title}` },
        { name: infoBuffer, value: "\u200B", inline: true },
        { name: timeDisplay, value: "\u200B", inline: true },
        { name: "Source", value: `${song.url}` },
      );
    return interaction.editReply({ embeds: [nowplayingEmbed] });
  },
};
