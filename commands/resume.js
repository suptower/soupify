const { SlashCommandBuilder } = require("discord.js");
const { getQueue } = require("../music/queue");
module.exports = {
  data: new SlashCommandBuilder().setName("resume").setDescription("Continue playing"),
  async execute(interaction, player) {
    await interaction.deferReply();
    const queue = getQueue(player, interaction.guild);
    if (!queue || !queue.currentTrack) {
      return interaction.editReply("This does only work if there is a queue.");
    }
    if (!queue.node.isPaused()) {
      return interaction.editReply("The player is already playing.");
    }
    queue.node.resume();
    return interaction.editReply("▶️   Player resumed.");
  },
};
