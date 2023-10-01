import { version } from '../../package.json'
import { sounds } from './sounds'

const defaultValues = {
  aiShips: 10,
  userShips: 10,
  timeOut: 500,
  gameOver: false,
  lastHitCells: []
}
class State {
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
    this.#aiShips = 10
    this.#userShips = 10
    this.#timeOut = 500
    this.#gameOver = false
    this.#lastHitCells = []
    this.#version = version
    this.#soundStatus = true
    this.#initShips = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
    this.#refs = {
      playBtn: document.querySelector('.play-game'),
      resolutionStub: document.querySelector('.resolution-stub'),
      versionDom: document.querySelector('.version'),
      cells: document.querySelectorAll('.game-cell'),
      soundBtn: document.querySelector('.sound-btn'),
      restartBtns: document.querySelectorAll('.restart-btn'),
      sides: document.querySelectorAll('[data-table]'),
      aiTable: document.querySelector('.sides__ai-side'),
      userTable: document.querySelector('.sides__user-side'),
      messageBlock: document.querySelector('.message'),
      aiLoader: document
        .querySelector('.sides__ai-side')
        .querySelector('.loader')
    }
    this.#setDefaultState()
  }

  #setDefaultState() {
    Object.entries(defaultValues).forEach(([key, value]) => {
      this[`#${key}`] = value
    })
  }

  #resetStore() {
    this.#setDefaultState()
  }

  #setGameOverStatus(value) {
    this.#gameOver = value
  }

  #showMessage(value) {
    const { messageBlock } = state.getRefs()
    const subject = messageBlock.querySelector('p')
    const message = value === 'userShips' ? 'You Lose(' : 'You Win!'
    subject.textContent = message
    const timeOut = state.getTimeoutInterval()
    setTimeout(() => {
      messageBlock.classList.remove('hide')
      this.#resetStore()
    }, timeOut)
  }

  decreaseShip(value) {
    this[`#${value}`] = this[`#${value}`] - 1
    if (this[`#${value}`] === 0) {
      this.#setGameOverStatus(true)
      this.#showMessage(value)
    }
  }

  pushLastHitCell(cell) {
    this.#lastHitCells.push(cell)
  }

  resetLastHitCells() {
    this.#lastHitCells = []
  }

  toggleSoundStatus() {
    this.#soundStatus = !this.#soundStatus
    const { soundBtn } = state.getRefs()
    soundBtn.textContent = this.#soundStatus ? 'sound off' : 'sound on'
    const action = this.#soundStatus ? 'play' : 'pause'
    sounds.background[action](this.#soundStatus)
  }

  getRefs() {
    return this.#refs
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

  getLastHitCells() {
    return this.#lastHitCells
  }

  isGameOver() {
    return this.#gameOver
  }
}

export const state = new State()
