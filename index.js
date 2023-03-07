/*
    index.js
    bot initialization and setup
*/

const { Client, Intents } = require('discord.js');
const env = require('dotenv').config();
const config = require('./config.json');
const games = require('./classes/gamemanager.js');

// Set bot intents
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

// On startup
client.once('ready', () => {
  console.log('Ready!');
  updateCommands();
});

// Replaces all commands to match ./commands
async function updateCommands() {
    // Configure command
    const commands = config.commands.map(command => ({
      name: command.name,
      description: command.description,
      options: command.options,
    }));
  
    try {
      // Clear commands
      await client.application.commands.set([]);
      console.log('Commands cleared!');
      
      // Configure command
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

// On termination
process.on('SIGINT', () => {
  console.log('Logging out and stopping...');
  client.destroy();
  process.exit(0);
});

// Create interactions for command
client.on('interactionCreate', async (interaction) => {
  // Not a command
  if (!interaction.isCommand()) return;

  // Map command with file
  const command = config.commands.find(c => c.name === interaction.commandName);
  if (!command) return;

  const commandFile = require(`./commands/${command.name}.js`);

  // Initialize interaction execution
  try {
    await commandFile.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.on('messageCreate', async message => {
  if (message.author.bot || message.channel.type !== 'GUILD_PUBLIC_THREAD') {
    return;
  }

  // Get the game instance for the thread
  const game = games.get(message.channel.id);

  // Ignore messages from users not in the game
  if (!game || !game.players.find(p => p.id === message.author.id)) {
    return;
  }

  // Ignore messages with invalid content (i.e. not a single letter)
  const letter = message.content.trim().toUpperCase();
  if (!letter || letter.length !== 1 || !/^[A-Z]$/.test(letter)) {
    console.log("not a letter");
    return;
  }

  // Update the current word and print the updated info
  await game.updateCurrentWord(letter);
  game.printInfo();
});

client.login(process.env.TOKEN);