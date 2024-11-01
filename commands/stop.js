const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop the player, empty queue and disconnect from channel"),
  async execute(interaction, distube) {
    await interaction.deferReply();
    if (distube.getQueue(interaction.guild)) {
      distube.stop(interaction.guild);
    } 
    distube.voices.get(interaction.guild).leave();
    return interaction.editReply("⏹️   Player stopped.");
  },
};
