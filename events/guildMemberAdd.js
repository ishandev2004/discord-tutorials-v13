const client = require("../index");
const { AntiAltClient } = require("discord-antialts");
const alt = new AntiAltClient(client, {
  debug: true,
  altDays: 5,
});
const altSchema = require("../models/antialts");
const { MessageEmbed } = require("discord.js");
client.on("guildMemberAdd", (member) => {
  altSchema.findOne({ Guild: member.guild.id }, async (err, data) => {
    if (err) return console.log(err);
    if (!data) return;
    alt.init(member, {
      whitelistUsers: data.whitelistedUsers,
    });
  });
});
alt.on("altAction", (member, date, action) => {
  altSchema.findOne({ Guild: member.guild.id }, async (err, data) => {
    if (err) return console.log(err);
    if (!data) return;
    const channel = member.guild.channels.cache.get(data.Channel);
    if (!channel) return data.delete();
    const embed = new MessageEmbed()
      .setTitle("Alt Detected")
      .setDescription(
        `
    Name: ${member.user.tag} 
    ID: ${member.user.id}
    Action Took Place: ${action}
    User Joined At: ${date.joinAt}
    Join Position: ${member.guild.memberCount}
    Age: ${date.createdAt}
    Date: ${date.createdAtDate}
    `
      )
      .setColor("RED");
    channel.send({ embeds: [embed] });
  });
});
