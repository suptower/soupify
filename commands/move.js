const { SlashCommandBuilder } = require("discord.js");
const { getQueue, getQueueTracks } = require("../music/queue");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("move")
    .setDescription("Move a song from a given position to a new one")
    .addIntegerOption(option => option.setName("old").setDescription("Old position of Song").setRequired(true))
    .addIntegerOption(option => option.setName("new").setDescription("new Position of Song").setRequired(true)),
  async execute(interaction, player) {
    await interaction.deferReply();
    const queue = getQueue(player, interaction.guild);
    const songs = getQueueTracks(queue);
    const oldPos = interaction.options.getInteger("old");
    const newPos = interaction.options.getInteger("new");
    if (!queue) {
      return interaction.editReply("This does only work if there is a queue.");
    } else if (oldPos > 0 && oldPos < songs.length) {
      if (newPos > 0 && newPos < songs.length) {
        const track = queue.tracks.at(oldPos - 1);
        if (!track) {
          return interaction.editReply("The oldPosition value was not in accepted range.");
        }
        queue.node.move(track, newPos - 1);
      } else {
        return interaction.editReply("The newPosition value was not in accepted range.");
      }
    } else {
      return interaction.editReply("The oldPosition value was not in accepted range.");
    }
    return interaction.editReply("🔢   Song moved from `" + oldPos + "` to `" + newPos + "`.");
  },
};
