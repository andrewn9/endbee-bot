const https = require('https');
const env = require('dotenv').config();
const axios = require('axios');

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

    axios.get(url)
      .then(function (response) {
        const entries = response.data;
        console.log(entries);
        
        const words = [];
        entries.forEach(entry => {
          words.push(entry.word);
        });

        let messageContent;
        messageContent = `Words that begin exactly with '${search}':\n`;
        messageContent += words.join('\n');
        
        interaction.reply(messageContent);
      })
      .catch(function (error) {
        console.log(error);
        interaction.reply('an error occured');
      }
    );
  },
};
