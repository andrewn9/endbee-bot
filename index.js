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

async function updateCommands() {
    const commands = config.commands.map(command => ({
      name: command.name,
      description: command.description,
      options: command.options,
    }));
  
    try {
      await client.application.commands.set([]);
  
      console.log('Commands cleared!');
  
      await client.application.commands.set(commands.map(command => ({
        name: command.name,
        description: command.description,
        options: command.options,
        defaultPermission: true,
        type: 'CHAT_INPUT'
      })));
  
      console.log('Commands updated!');
    } catch (error) {
      console.error(error);
    }
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
    await commandFile.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.login(process.env.TOKEN);