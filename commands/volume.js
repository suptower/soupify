const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('Set volume of bot (has to be between 0 and 100')
        .addIntegerOption(option => 
            option.setName('percent')
                .setDescription('New volume value.')
                .setRequired(true)),
	async execute(interaction, distube) {
        await interaction.deferReply();
        const queue = distube.getQueue(interaction.guild);
        const newVol = interaction.options.getInteger('percent');
        if (!queue) {
            return interaction.editReply("This does only work if there is a queue.");
        }
        else {
            if (newVol >= 0 && newVol <= 100) {
                distube.setVolume(queue,newVol);
            }
            else {
                return interaction.editReply("Your percentage needs to be a number between 0 and 100.");
            }
        }
        return interaction.editReply("🔊   Volume set to `"+newVol+"` percent.");
	},
};