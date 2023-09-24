import { updateSoundBtn, showMessage } from './dom'
import { version } from '../../package.json'
import { sounds } from './sounds'

const defaultValues = {
  aiShips: 10,
  userShips: 10,
  timeOut: 500,
  gameOver: false,
  lastHitCells: [],
}
export default class State {
  #aiShips
  #userShips
  #timeOut
  #gameOver
  #lastHitCells
  #version
  #soundStatus
  #initShips
  #refs
  constructor() {
    this.#aiShips = 10,
    this.#userShips = 10,
    this.#timeOut = 500,
    this.#gameOver = false,
    this.#lastHitCells = [],
    this.#version = version
    this.#soundStatus = true
    this.#initShips = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
    this.#refs = {
      playBtn: document.querySelector('.play-game'),
      resolutionStub: document.querySelector('.resolution-stub'),
      versionDom: document.querySelector('.version'),
      cells: document.querySelectorAll('.game-cell'),
      loader: document.querySelector('.loader'),
      soundBtn: document.querySelector('.sound-btn'),
      restartBtns: document.querySelectorAll('.restart-btn'),
      sides: document.querySelectorAll('[data-table]'),
      aiTable: document.querySelector('.sides__ai-side'),
      userTable: document.querySelector('.sides__user-side'),
      messageBlock: document.querySelector('.message'),
      aiLoader: document
        .querySelector('.sides__ai-side')
        .querySelector('.loader'),
    }
    this.#setDefaultState()
  }

  #setDefaultState() {
    Object.entries(defaultValues).forEach(([key, value]) => {
      this[`#${key}`] = value
    })
  }

  resetStore() {
    this.#setDefaultState()
  }

  resetLastHitCells() {
    this.#lastHitCells = []
  }

  getRefs() {
    return this.#refs
  }

  #setGameOverStatus(value) {
    this.#gameOver = value
  }

  toggleSoundStatus() {
    this.#soundStatus = !this.#soundStatus
    updateSoundBtn(this.#soundStatus)
    const action = this.#soundStatus ? 'play' : 'pause'
    sounds.background[action]()
  }

  decreaseShip(value) {
    this[`#${value}`] = this[`#${value}`] - 1
    if (this[`#${value}`] === 0) {
      this.#setGameOverStatus(true)
      showMessage(value)
    }
  }

  pushLastHitCell(cell) {
    this.#lastHitCells.push(cell)
  }

  getSoundStatus() {
    return this.#soundStatus
  }

  getVersion() {
    return this.#version
  }

  getInitShipsArr() {
    return this.#initShips
  }

  getChildTable(el) {
    return el.querySelector('.table')
  }

  getCellByTable(table) {
    return table.querySelectorAll('.game-cell')
  }

  getAvailableCells(table) {
    return table.querySelectorAll('.cell[data-status="empty"]')
  }

  getTimeoutInterval() {
    return this.#timeOut
  }

  getAiShipsQuantity() {
    return this.#aiShips
  }

  getUserShipsQuantity() {
    return this.#userShips
  }

  getLastHitCells() {
    return this.#lastHitCells
  }

  isGameOver() {
    return this.#gameOver
  }
}
