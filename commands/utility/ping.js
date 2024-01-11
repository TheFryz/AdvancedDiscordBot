// ping.js
module.exports = {
    name: 'ping',
    description: 'Ping!',
    usage: '',
    execute(message) {
      message.channel.send('Pong!');
    },
  };