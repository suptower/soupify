const { SlashCommandBuilder } = require("discord.js");
const { getQueue, getQueueTracks } = require("../music/queue");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("jump")
    .setDescription("Jump to a song in queue")
    .addIntegerOption(option => option.setName("position").setDescription("Position to jump to").setRequired(true)),
  async execute(interaction, player) {
    await interaction.deferReply();
    const pos = interaction.options.getInteger("position");
    const queue = getQueue(player, interaction.guild);
    const songs = getQueueTracks(queue);
    if (queue) {
      if (!(pos == null)) {
        if (pos > 0 && pos < songs.length) {
          const track = queue.tracks.at(pos - 1);
          if (!track) {
            return interaction.editReply("Your given position is not in accepted range.");
          }
          queue.node.jump(track);
        } else {
          return interaction.editReply("Your given position is not in accepted range.");
        }
      }
    } else {
      return interaction.editReply("There is no queue.");
    }
    return interaction.editReply("📼   Jumped to position `" + pos + "` in queue.");
  },
};
