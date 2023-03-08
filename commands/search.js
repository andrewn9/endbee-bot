const https = require('https');
const env = require('dotenv').config();

module.exports = {
  execute: async function(interaction) {
    var search = interaction.options.getString('query');
    
    var addition = "";
    var searchLength = search.length-1;

    for(var i = 0; i < searchLength; i++)
    {
      if(i%2==0)
        addition+="_";
      else
        addition+="+";
    }

    if(searchLength<=2)
      addition = "";

    search += addition;
    console.log(`modified word: '${search}'.`);
    
    
    if (!search) {
      await interaction.reply('No search term was specified!');
      return;
    }

    const apiKey = process.env.MERRIAM_KEY;
    const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${search}?key=${apiKey}`;
    search = interaction.options.getString('query');
    console.log(url);

    https.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        const entries = JSON.parse(data);

        const exactMatches = entries.filter(entry => entry.slice(0, search.length) === search);

        let messageContent;
        if (exactMatches.length === 0) {
          messageContent = `No words found that begin exactly with '${search}'.`;
        } else {
          messageContent = `Words that begin exactly with '${search}':\n`;
          messageContent += exactMatches.join('\n');
        }

        interaction.reply(messageContent);
      });
    });
  },
};
