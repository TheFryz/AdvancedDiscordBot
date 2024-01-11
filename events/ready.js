// ready.js
const chalk = require('chalk');

module.exports = {
  name: 'ready',
  once: true,

  execute(client) {
    console.log(chalk.blue('Bot is ready!'));
  },
};
