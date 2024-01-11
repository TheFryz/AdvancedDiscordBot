// setprefix.js
const fs = require('fs');
const path = require('path');
const prefixesPath = path.join(__dirname, '..', '..', 'misc', 'prefixes.json');
const { defaultPrefix } = require('../../index');

module.exports = {
  name: 'setprefix',
  description: 'Set the server-specific prefix (requires MANAGE_SERVER permission)',
  usage: '<new prefix>',
  permissions: ['MANAGE_GUILD'],
  execute(message, args) {
    const newPrefix = args[0];
    if (!newPrefix) {
      return message.reply('Please provide a new prefix.');
    }
    if (!message.member.permissions.has('MANAGE_GUILD')) {
      return message.reply('You do not have permission to use this command.');
    }
    const prefixes = JSON.parse(fs.readFileSync(prefixesPath, 'utf-8'));
    prefixes[message.guild.id] = newPrefix;
    fs.writeFileSync(prefixesPath, JSON.stringify(prefixes, null, 2));
    message.reply(`Server prefix set to: ${newPrefix}`);
    
  },
};