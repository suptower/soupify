const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder().setName("skip").setDescription("Skip the current song"),
  async execute(interaction, distube) {
    await interaction.deferReply();
    const queue = distube.getQueue(interaction);
    if (queue) {
      distube.skip(interaction);
    } else {
      return interaction.editReply("There is no queue.");
    }
    return interaction.editReply("⏭️   Song skipped.");
  },
};
