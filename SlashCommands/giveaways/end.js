const { Client, CommandInteraction } = require("discord.js");

module.exports = {
  name: "end",
  description: "end a giveaway",
  options: [
    {
      name: "giveaway",
      description: "The giveaway to end (message ID or giveaway prize)",
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
    if (giveawaysObj.ended) {
      interaction.followUp("Giveaway already ended.");
      return;
    }
    client.giveawaysManager.end(giveawaysObj.messageId).then(() => {
      return interaction.followUp("Giveaway ended.");
    });
  },
};
