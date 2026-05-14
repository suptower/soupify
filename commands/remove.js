const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove song from queue")
    .addIntegerOption(option =>
      option
        .setName("position")
        .setDescription("Specify position of song to be removed (if none is given, last element will be removed)")
        .setRequired(false),
    ),
  async execute(interaction, distube) {
    await interaction.deferReply();
    const pos = interaction.options.getInteger("position");
    const queue = distube.getQueue(interaction.guild);
    let removedSong;
    if (queue) {
      if (!(pos == null)) {
        if (pos === 0) {
          if (!queue.songs[0]) {
            return interaction.editReply("There is no song to remove.");
          }
          removedSong = queue.songs[0].name;
          distube.skip(interaction.guild);
        } else if (pos > 0 && pos < queue.songs.length) {
          const removedTrack = distube.remove(interaction.guild, pos);
          if (!removedTrack) {
            return interaction.editReply("Failed to remove this song from queue.");
          }
          removedSong = removedTrack.name;
        } else if (pos >= queue.songs.length) {
          const removedTrack = distube.pop(interaction.guild);
          if (!removedTrack) {
            return interaction.editReply("Failed to remove this song from queue.");
          }
          removedSong = removedTrack.name;
        } else {
          return interaction.editReply("Your given position is not in accepted range.");
        }
      } else {
        const removedTrack = distube.pop(interaction.guild);
        if (!removedTrack) {
          return interaction.editReply("Failed to remove this song from queue.");
        }
        removedSong = removedTrack.name;
      }
    } else {
      return interaction.editReply("There is no queue.");
    }
    return interaction.editReply("⏏️   Song `" + removedSong + "` removed from queue.");
  },
};
