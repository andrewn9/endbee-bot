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

    await interaction.reply(`You selected user ${user.username}#${user.discriminator} (${user.id})`);
  }
};
