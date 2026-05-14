const { SlashCommandBuilder } = require("discord.js");
const { QueueRepeatMode } = require("discord-player");
const { getQueue } = require("../music/queue");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Loop the current song/queue or disable the loop.")
    .addStringOption(option =>
      option
        .setName("mode")
        .setDescription("Specify your loop mode")
        .setRequired(true)
        .addChoices({ name: "Queue", value: "1" }, { name: "Song", value: "2" }, { name: "Off", value: "3" }),
    ),
  async execute(interaction, player) {
    await interaction.deferReply();
    const queue = getQueue(player, interaction.guild);
    if (!queue) {
      return interaction.editReply("There is no queue.");
    }
    const str = interaction.options.getString("mode");
    const mode = parseInt(str);
    if (mode === 1) {
      queue.setRepeatMode(QueueRepeatMode.QUEUE);
      return interaction.editReply("🔂   Looping queue now.");
    } else if (mode === 2) {
      queue.setRepeatMode(QueueRepeatMode.TRACK);
      return interaction.editReply("🔂   Looping current song now.");
    } else {
      queue.setRepeatMode(QueueRepeatMode.OFF);
      return interaction.editReply("🔁   Looping disabled.");
    }
  },
};
