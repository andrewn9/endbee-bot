const { Client, Intents } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const config = require('./config.json');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

client.once('ready', () => {
  console.log('Ready!');
  updateCommands();
});

function updateCommands() {
  const commands = config.commands.map(command => ({
    name: command.name,
    description: command.description,
    options: command.options,
  }));

  // Remove all existing global commands
  client.application.commands.set([]).then(() => {
    console.log('Commands cleared!');
    // Create new global commands
    client.application.commands
      .set(commands)
      .then(() => console.log('Commands updated!'))
      .catch(console.error);
  });
}

process.on('SIGINT', () => {
  console.log('Logging out and stopping...');
  client.destroy();
  process.exit(0);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = config.commands.find(c => c.name === interaction.commandName);

  if (!command) return;

  const commandFile = require(`./commands/${command.name}.js`);

  try {
    await commandFile.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.login(process.env.TOKEN);
