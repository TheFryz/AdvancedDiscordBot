// customStatus.js
const chalk = require('chalk');
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
module.exports = {
  name: 'ready',
  once: true,
//Activites:
// ActivityType.Competing, ActivityType.Custom, ActivityType.Listening, ActivityType.Playing, ActivityType.Streaming, ActivityType.Watching
//Status:
// dnd,idle,online,invisible
  execute(client) {
    client.user.setPresence({
      activities: [{ name: `Test`, type: ActivityType.Competing }],
      status: 'dnd',
    });
  },
};