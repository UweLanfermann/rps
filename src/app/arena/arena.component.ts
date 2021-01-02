import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.scss']
})
export class ArenaComponent implements OnInit {

  rps: any[] = ['rock', 'paper', 'scissors']
  possibleResults: any[][] = [[0, 3], [1, 1], [3, 0]]
  fighters: any[][] = [['detective-horse', 'Detective Horse', 0], ['hacker-boy', 'Hacker Boy', 0], ['knighty-knight', 'Knighty Knight', 0], ['greg', 'Greg', 0]]
  fightersEnemy!: any[][]
  otherFighters: any[][] = []

  playerFighterCode!: string
  aiFighterCode!: string
  playerFighterDisplay!: string
  aiFighterDisplay!: string
  playerChoice!: string
  aiChoice!: string

  gameStarted: boolean = false
  moveMade: boolean = false
  lastRound: boolean = false
  gameOver: boolean = false
  matchResult!: string
  round: number = 0
  place!: number

  constructor() { }

  ngOnInit() {
  }

  newGame() {
    // set points for all fighters to 0
    for (let i = 0; i < this.fighters.length; i++) {
      this.fighters[i][2] = 0
    }
    
    this.gameStarted = false
    this.lastRound = false
    this.gameOver = false
    this.round = 0

    this.nextMatch()
  }

  nextMatch() {
    this.otherFighters = []
    this.moveMade = false
    this.aiChoice = ""
    this.matchResult = ""

    this.getEnemyData(this.round)
  }

  select(clickedFighter: string) {
    // set flag for ngIf display
    this.gameStarted = true

    // search display name from code name, delete entry for this fighter to create enemy-array
    this.playerFighterCode = clickedFighter

    // clone fighters array and reduce new array to enemies to select from
    this.fightersEnemy = this.fighters.slice(0)
    for (let i = 0; i < this.fightersEnemy.length; i++) {
      if (this.fightersEnemy[i][0] == clickedFighter) {
        this.playerFighterDisplay = this.fightersEnemy[i][1]
        const index = this.fightersEnemy.indexOf(this.fightersEnemy[i], 0);
        if (index > -1) {
          this.fightersEnemy.splice(index, 1);
        }
        break
      }
    }

    // initialize next (first) match
    this.nextMatch()
  }

  getEnemyData(idx: number) {
    //get enemies name and display name
    this.aiFighterCode = this.fightersEnemy[idx][0]
    this.aiFighterDisplay = this.fightersEnemy[idx][1]
  }

  makeMove(choice: string) {
    //make players choice available in HTML
    this.playerChoice = choice

    this.playRPS()
    this.otherFightersRPS()

    //sort array by highest points for league display
    this.fighters.sort(this.sortByPoints)
    //count round up and flag last round
    this.round++
    if (this.round == 3) {
      this.lastRound = true
    }
    this.moveMade = true
  }

  playRPS() {
    // generate random num 0 - 2 and select r|p|s from array
    this.aiChoice = this.rps[Math.floor(Math.random() * 3)]

    // actual r|p|s logic; determine match result, give points for player and for enemy
    if (
      (this.playerChoice == 'rock' && this.aiChoice == 'scissors') ||
      (this.playerChoice == 'paper' && this.aiChoice == 'rock') ||
      (this.playerChoice == 'scissors' && this.aiChoice == 'paper')
    ) {
      this.matchResult = "You Win!"
      for (let i = 0; i < this.fighters.length; i++) {
        if (this.fighters[i][0] == this.playerFighterCode) {
          this.fighters[i][2] += 3
        }
      }
    }
    else if (
      (this.playerChoice == 'rock' && this.aiChoice == 'rock') ||
      (this.playerChoice == 'paper' && this.aiChoice == 'paper') ||
      (this.playerChoice == 'scissors' && this.aiChoice == 'scissors')
    ) {
      this.matchResult = "Draw!"
      for (let i = 0; i < this.fighters.length; i++) {
        if (this.fighters[i][0] == this.playerFighterCode || this.fighters[i][0] == this.aiFighterCode) {
          this.fighters[i][2] += 1
        }
      }
    }
    else if (
      (this.playerChoice == 'rock' && this.aiChoice == 'paper') ||
      (this.playerChoice == 'paper' && this.aiChoice == 'scissors') ||
      (this.playerChoice == 'scissors' && this.aiChoice == 'rock')
    ) {
      this.matchResult = "You Lose!"
      for (let i = 0; i < this.fighters.length; i++) {
        if (this.fighters[i][0] == this.aiFighterCode) {
          this.fighters[i][2] += 3
        }
      }
    }
  }

  otherFightersRPS() {
    //create array of leftover fighters
    for (let i = 0; i < this.fightersEnemy.length; i++) {
      if (this.fightersEnemy[i][0] != this.playerFighterCode && this.fightersEnemy[i][0] != this.aiFighterCode) {
        this.otherFighters.push(this.fightersEnemy[i])
      }
    }
    //assign points from otherResults array to leftover fighters
    let rdm = Math.floor(Math.random() * 3)
    for (let i = 0; i < this.fighters.length; i++) {
      for (let j = 0; j < this.otherFighters.length; j++) {
        if (this.fighters[i][0] == this.otherFighters[j][0]) {
          this.fighters[i][2] += this.possibleResults[rdm][j]
        }
      }
    }
  }

  sortByPoints(points1: any, points2: any) {
    if (points1[2] > points2[2]) {
      return -1
    }
    if (points1[2] < points2[2]) {
      return 1
    }
    return 0
  }

  finishGame() {
    //get players final place from sorted points array
    for (let i = 0; i < this.fighters.length; i++) {
      if (this.fighters[i][0] == this.playerFighterCode) {
        this.place = i + 1
      }
    }
    this.gameOver = true
  }
}
