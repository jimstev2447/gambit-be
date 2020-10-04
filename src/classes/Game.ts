import { Player } from "./Player";

export class Game {
  constructor(players: Player[]) {
    this.players = players;
    this.playerCount = players.length;
    this.votes = {};
    this.voteCount = 0;
    this.gameOver = false;
  }

  startGame() {
    this.infectPlayer();
    this.setIds();
    this.setRoles();
  }
  checkVotes() {
    const AllVoted = Object.values(this.votes).length === this.playerCount;
    if (AllVoted) {
    }
  }
  castVote(voter: string, votee: string) {
    if (!this.votes[voter]) {
      this.voteCount++;
    }
    this.votes[voter] = votee;
  }
  infectPlayer() {
    const alivePlayers = this.players.filter(({ health }) => health > 0);
    const infectedIndex = Math.floor(Math.random() * alivePlayers.length);
    alivePlayers.forEach((player, index) => {
      index === infectedIndex ? player.infect() : player.cure();
    });
  }
  setRoles() {
    const roles = ["captain"];
    const extras = [
      "stowaway",
      "engineer",
      "security",
      "marine",
      "comms officer",
      "red shirt",
      "scientist",
    ];
    shuffle(extras);
    for (let i = 0; i < this.players.length - 1; i++) {
      roles.push(extras[i]);
    }
    shuffle(roles);
    this.players.forEach((player, index) => {
      player.setRole(roles[index]);
    });
  }
  setIds() {
    const { playerCount, players } = this;
    let ids: string[] = [];
    if (playerCount === 4) ids = ["crew", "crew", "crew", "corp"];
    if (playerCount === 5) ids = ["crew", "crew", "crew", "corp", "corp"];
    if (playerCount === 6)
      ids = ["crew", "crew", "crew", "crew", "corp", "corp"];
    if (playerCount === 7)
      ids = ["crew", "crew", "crew", "crew", "corp", "corp", "corp"];
    if (playerCount === 8)
      ids = ["crew", "crew", "crew", "crew", "crew", "corp", "corp", "corp"];
    shuffle(ids);
    players.forEach((player, index) => player.setId(ids[index]));
  }
}
export interface Game {
  players: Player[];
  playerCount: number;
  votes: { [player_name: string]: string };
  gameOver: boolean;
  voteCount: number;
}

function shuffle(a: string[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
