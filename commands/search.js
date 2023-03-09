const https = require('https');
const env = require('dotenv').config();

module.exports = {
  execute: async function(interaction) {
    const search = interaction.options.getString('query');
    
    if (!search) {
      await interaction.reply('No search term was specified!');
      return;
    }
    
    //const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${search}?key=${apiKey}`;
    const url = `https://api.datamuse.com/words?sp=${search}*&max=20`;
    console.log(url);

    
    https.get(url, (response) => {
      let data = ''; 

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        console.log(data);
        const entries = JSON.parse(data);
        console.log(entries);

        let messageContent;
        messageContent = `Words that begin exactly with '${search}':\n`;
        messageContent += entries.join('\n');
        
        interaction.reply(messageContent);
      });
    });
  },
};
