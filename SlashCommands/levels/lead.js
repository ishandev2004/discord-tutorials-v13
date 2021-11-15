const { Client, CommandInteraction } = require("discord.js");
const Levels = require("discord-xp");
module.exports = {
  name: "leaderboard",
  description: "gET",
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const lead = await Levels.fetchLeaderboard(interaction.guild.id, 5);
    if (lead.length < 1) return interaction.reply("No leaderboard found");
    const led = await Levels.computeLeaderboard(client, lead, true);
    const lb = led.map(
      (e) =>
        `${e.position}. ${e.username}#${e.discriminator}\nLevel: ${
          e.level
        }\nXP: ${e.xp.toLocaleString()}`
    );
    interaction.followUp(`${lb.join("\n")}`);
  },
};
