const { SlashCommandBuilder } = require("discord.js");
const { getQueue } = require("../music/queue");
module.exports = {
  data: new SlashCommandBuilder().setName("skip").setDescription("Skip the current song"),
  async execute(interaction, player) {
    await interaction.deferReply();
    const queue = getQueue(player, interaction.guild);
    if (!queue || !queue.currentTrack) {
      return interaction.editReply("There is no queue.");
    }
    queue.node.skip();
    return interaction.editReply("⏭️   Song skipped.");
  },
};
