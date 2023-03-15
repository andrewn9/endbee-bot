/*
    start.js
    responsible for the /start command
    creates new thread and sets up game object
*/

const { ThreadChannel } = require("discord.js");
const Game = require("../classes/Game");
const games = require("../classes/gamemanager");

module.exports = {
  execute: async function(interaction) {
    const user = interaction.options.getUser('user');

    if (!user) {
      await interaction.reply('No user was specified!');
      return;
    }
    
    if (user.id === interaction.user.id) {
      await interaction.reply('You cannot select yourself!');
      return;
    }

    if (user.bot) {
      await interaction.reply('You cannot select a bot!');
      return;
    }

    // create a new thread
    const thread = await interaction.channel.threads.create({
      name: `${user.username} vs ${interaction.user.username}`,
      autoArchiveDuration: 60,
      type: 'GUILD_PUBLIC_THREAD',
    });
    
    // add the user to the thread
    if (thread && user) {
      await thread.members.add(user);
    }

    // create a new game instance
    const game = new Game(thread, [interaction.user, user]);
    games.set(thread.id, game);

    // start the game
    //game.printInfo();
    await interaction.reply({content:`new game created!`,ephemeral: true});
  },
};
