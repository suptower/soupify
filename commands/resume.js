const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder().setName("resume").setDescription("Continue playing"),
  async execute(interaction, distube) {
    await interaction.deferReply();
    const queue = distube.getQueue(interaction.guild);
    if (queue.playing) {
      return interaction.editReply("The player is already playing.");
    }
    distube.resume(interaction.guild);
    return interaction.editReply("▶️   Player resumed.");
  },
};
