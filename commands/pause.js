const { SlashCommandBuilder } = require("discord.js");
const { getQueue } = require("../music/queue");
module.exports = {
  data: new SlashCommandBuilder().setName("pause").setDescription("Pause the player"),
  async execute(interaction, player) {
    await interaction.deferReply();
    const queue = getQueue(player, interaction.guild);
    if (!queue || !queue.currentTrack) {
      return interaction.editReply("This does only work if there is a queue.");
    }
    if (queue.node.isPaused()) {
      return interaction.editReply("The player is already paused.");
    }
    queue.node.pause();
    return interaction.editReply("⏸️   Player paused.");
  },
};
