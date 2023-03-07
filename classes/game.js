class Game {
  thread;
  players;
  turn;
  currentWord;

  constructor(thread, players) {
    this.thread = thread;
    this.players = players;
    this.turn = 0;
    this.currentWord = "";
  }

  printInfo() {
    console.log(`Thread: ${this.thread}`);
    console.log(`Players: ${this.players.join(', ')}`);
    console.log(`Turn: ${this.turn}`);
    console.log(`Current Word: ${this.currentWord}`);
  }
  
  async updateCurrentWord(letter) {
    this.currentWord += letter.toLowerCase();
    await this.thread.send(`word: ${this.currentWord}`);
  }
}

module.exports = Game;
