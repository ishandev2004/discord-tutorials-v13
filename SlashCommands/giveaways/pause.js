const { Client, CommandInteraction } = require("discord.js");

module.exports = {
  name: "pause",
  description: "reroll a giveaway",
  options: [
    {
      name: "giveaway",
      description: "The giveaway to reroll (message ID or giveaway prize)",
      type: "STRING",
      required: true,
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const giveaway = interaction.options.getString("giveaway");
    if (!interaction.member.permissions.has("MANAGE_GUILD")) {
      interaction.followUp("You don't have permission to end giveaways.");
      return;
    }
    const giveawaysObj =
      client.giveawaysManager.giveaways.find(
        (g) => g.prize === giveaway && g.guildId === interaction.guild.id
      ) ||
      client.giveawaysManager.giveaways.find(
        (g) => g.messageId === giveaway && g.guildId === interaction.guild.id
      );

    if (!giveawaysObj) {
      interaction.followUp("Giveaway not found.");
      return;
    }
    if (giveawaysObj.pauseOptions.isPaused) {
      interaction.followUp("Giveaway is already paused.");
      return;
    }
    client.giveawaysManager.pause(giveawaysObj.messageId).then(() => {
      return interaction.followUp("Giveaway paused.");
    });
  },
};
