const Discord = require('discord.js');
const { defaultPrefix, token } = require('./config.json');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const client = new Discord.Client({ intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMembers, ],
});
const resolvePath = (dir) => path.resolve(__dirname, dir);
//Event Loader & Executer
const eventFiles = fs.readdirSync(path.resolve(__dirname, 'events')).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  try {
    const event = require(`./events/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
    console.log(chalk.green(`Event ${chalk.bold(file)} loaded!`));
  } catch (error) {
    console.error(chalk.red(`Error loading event ${chalk.bold(file)}: ${error.message}`));
  }
}
// Command Loader
client.commands = new Map();
const loadCommands = (dir) => {
  const commandFiles = fs.readdirSync(resolvePath(dir)).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(dir, file);
    try {
      const command = require(`./${filePath}`);
      client.commands.set(command.name, command);
      if (command.aliases) {
        command.aliases.forEach(alias => client.commands.set(alias, command));
      }
      console.log(`Command ${chalk.yellow.bold(filePath)} loaded!`);
    } catch (error) {
      console.log((chalk.red(`Error`)) +  `loading command ${chalk.bold(filePath)}: ${error.message}`);
    }
  }
};
loadCommands('commands');
fs.readdirSync(resolvePath('commands')).filter(folder => fs.statSync(path.join(resolvePath('commands'), folder)).isDirectory()).forEach(folder => loadCommands(path.join('commands', folder)));
//Command Executer
const prefixes = require('./misc/prefixes.json');
client.on('messageCreate', (message) => {
  if (message.author.bot) {
    return;
  }
  const serverPrefix = prefixes[message.guild?.id] || defaultPrefix;
  if (!message.content.startsWith(serverPrefix)) {
    return;
  }
  const args = message.content.slice(serverPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.get(client.commands.findKey(cmd => cmd.aliases && cmd.aliases.includes(commandName)));
  if (!command) {
    return;
  }
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(chalk.red(`Error executing command ${chalk.bold(commandName)}: ${error.message}`));
  }
});
client.login(token);