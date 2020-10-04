export class Player {
  constructor(name: string) {
    this.name = name;
    this.health = 2;
    this.infected = false;
    this.savedAction = "none";
  }
  infect() {
    this.infected = true;
  }
  cure() {
    this.infected = false;
  }
  setRole(role: string) {
    this.role = role;
  }
  setId(id: string) {
    this.id = id;
  }
  showRole() {
    return this.role;
  }
  showId() {
    return this.id;
  }
  damage(num: number) {
    const healthRes = num + this.health;
    if (healthRes >= 0 && healthRes <= 2) this.health = healthRes;
  }
}

export interface Player {
  name: string;
  health: number;
  infected: boolean;
  role?: string;
  id?: string;
  savedAction: string;
}
