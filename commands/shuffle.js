const { SlashCommandBuilder } = require("discord.js");
const { getQueue } = require("../music/queue");
module.exports = {
  data: new SlashCommandBuilder().setName("shuffle").setDescription("Shuffle songs in queue."),
  async execute(interaction, player) {
    await interaction.deferReply();
    const queue = getQueue(player, interaction.guild);
    if (!queue) {
      return interaction.editReply("There is no queue.");
    }
    queue.tracks.shuffle();
    return interaction.editReply("🔀   Queue shuffled.");
  },
};
