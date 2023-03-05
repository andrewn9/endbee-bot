module.exports = {
  name: 'start',
  description: 'Start a game with another user',
  options: [
    {
      name: 'user',
      description: 'The user to start a game with',
      type: 'USER',
      required: true,
    },
  ],
  execute(interaction) {
    const user = interaction.options.getUser('user');
    interaction.reply(`Starting a game with ${user.username}!`);
  },
};
