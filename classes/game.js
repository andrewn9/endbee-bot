/*
    game.js
    game class containing information about game state,
    what thread, players, etc..
*/

class Game {
  thread;
  players;
  turn;
  currentWord;
  wordMessage;

  constructor(thread, players) {
    this.thread = thread;
    this.players = players;
    this.turn = 0;

    this.currentWord = "";
    this.thread.send(`word: ${this.currentWord}`).then(message => this.wordMessage = message.id);
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
      message.edit(`word: ${this.currentWord}`);
    }
  }
}

module.exports = Game;
