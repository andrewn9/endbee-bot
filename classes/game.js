/*
    game.js
    game class containing information about game state,
    what thread, players, etc..
*/

const axios = require('axios');
class Game {
  thread;
  players;
  turn;
  currentWord;
  wordMessage;

  constructor(thread, players) {
    this.thread = thread;
    this.players = players;
    this.turn = players[Math.round(Math.random())];

    this.currentWord = "";
    this.thread.send(`word: ${this.currentWord}\nturn: ${this.turn}`).then(message => this.wordMessage = message.id);
  }

  printInfo() {
    console.log(`Thread: ${this.thread}`);
    console.log(`Players: ${this.players.join(', ')}`);
    console.log(`Turn: ${this.turn}`);
    console.log(`Current Word: ${this.currentWord}`);
    console.log(`Current WordId: ${this.wordMessage}`);
  }

  async updateCurrentWord(letter) {
    this.currentWord += letter.toLowerCase();
    if (this.wordMessage) {
      const message = await this.thread.messages.fetch(this.wordMessage);
      message.edit(`word: ${this.currentWord}\nturn: ${this.turn}`);
    }

    const url = `https://api.datamuse.com/words?sp=${this.currentWord}*&max=1&md=psfd`;
    const myThread = this.thread;
    const myWord = this.currentWord;
    axios.get(url)
      .then(function (response) {
        const entries = response.data;
        if
        (
          myWord.length > 3 &&
          entries.length > 0 &&
          entries[0].word == myWord
          && entries[0].defs &&
          entries[0].tags.indexOf("prop") == -1
        ) 
        {
          myThread.send(`word detected: ${entries[0].word}\ndefinitions: ${entries[0].defs[0]}`);
        }
        else if (entries.length == 0 || !entries[0].word.startsWith(myWord)) {
          myThread.send(`no words found starting with: ${myWord}`);
        }
      })
      .catch(function (error) {
        console.log(error);
      }
      );
  }
}

module.exports = Game;
