const { SlashCommandBuilder } = require("discord.js");
const { QueueRepeatMode } = require("discord-player");
const { getQueue } = require("../music/queue");
module.exports = {
  data: new SlashCommandBuilder().setName("autoplay").setDescription("Toggle autoplay on/off"),
  async execute(interaction, player) {
    await interaction.deferReply();
    const queue = getQueue(player, interaction.guild);
    if (!queue) {
      return interaction.editReply("There is no queue.");
    }
    const mode = queue.repeatMode !== QueueRepeatMode.AUTOPLAY;
    queue.setRepeatMode(mode ? QueueRepeatMode.AUTOPLAY : QueueRepeatMode.OFF);
    return interaction.editReply("🎶   Set autoplay mode to `" + (mode ? "On" : "Off") + "`");
  },
};
