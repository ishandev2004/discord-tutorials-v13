const { Client, CommandInteraction } = require("discord.js");
const schema = require("../../models/antialts");
module.exports = {
  name: "antialts",
  description: "Enable/disable anti-alts.",
  options: [
    {
      name: "enable",
      description: "Enable anti-alts.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "channel",
          description: "Channel to send logs to.",
          type: "CHANNEL",
          required: false,
        },
      ],
    },
    {
      name: "disable",
      description: "Disable anti-alts.",
      type: "SUB_COMMAND",
    },
    {
      name: "whitelist-users",
      description: "Whitelist users.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "User id  to whitelist.",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "unwhitelist-users",
      description: "Unwhitelist users.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "User to unwhitelist.",
          type: "STRING",
          required: true,
        },
      ],
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    if (!interaction.member.permissions.has("MANAGE_GUILD"))
      return interaction.followUp(
        "You don't have permission to use this command."
      );
    switch (interaction.options.getSubcommand()) {
      case "enable": {
        const channel = interaction.options.getChannel("channel");
        schema.findOne({ Guild: interaction.guildId }, async (err, data) => {
          if (err) return interaction.followUp("An error occured.");
          if (data) {
            return interaction.followUp("Anti-alts is already enabled.");
          }
          new schema({
            Guild: interaction.guildId,
            Channel: channel.id ? channel.id : null,
          }).save((err) => {
            if (err) return interaction.followUp("An error occured.");
            return interaction.followUp("Anti-alts enabled.");
          });
        });
        break;
      }
      case "disable": {
        schema.findOne({ Guild: interaction.guildId }, async (err, data) => {
          if (err) return interaction.followUp("An error occured.");
          if (!data) return interaction.followUp("Anti-alts is not enabled.");
          data.delete();
          return interaction.followUp("Anti-alts disabled.");
        });
        break;
      }
      case "whitelist-users": {
        const user = interaction.options.getString("user");

        schema.findOne({ Guild: interaction.guildId }, async (err, data) => {
          if (err) return interaction.followUp("An error occured.");
          if (!data) return interaction.followUp("Anti-alts is not enabled.");
          if (data.whitelistedUsers.includes(user)) {
            return interaction.followUp("User is already whitelisted.");
          }
          data.whitelistedUsers.push(user);
          data.save();
          return interaction.followUp("User whitelisted.");
        });
        break;
      }
      case "unwhitelist-users": {
        const user = interaction.options.getString("user");
        schema.findOne({ Guild: interaction.guildId }, async (err, data) => {
          if (err) return interaction.followUp("An error occured.");
          if (!data) return interaction.followUp("Anti-alts is not enabled.");
          if (!data.whitelistedUsers.includes(user)) {
            return interaction.followUp("User is not whitelisted.");
          }
          data.whitelistedUsers.splice(data.whitelistedUsers.indexOf(user), 1);
          data.save();
          return interaction.followUp("User unwhitelisted.");
        });
        break;
      }
    }
  },
};
