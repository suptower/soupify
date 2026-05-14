const { SlashCommandBuilder } = require("discord.js");
const { getQueue } = require("../music/queue");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop the player, empty queue and disconnect from channel"),
  async execute(interaction, player) {
    await interaction.deferReply();
    const queue = getQueue(player, interaction.guild);
    if (queue) {
      queue.node.stop();
      queue.delete();
    }
    return interaction.editReply("⏹️   Player stopped.");
  },
};
