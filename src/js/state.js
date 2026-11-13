import packageJson from '../../package.json'
import { sounds } from './sounds'

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

  #messageTimeout

  constructor() {
    this.#timeOut = 500
    this.#version = packageJson.version
    this.#soundStatus = true
    this.#initShips = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
    this.#refs = {
      playBtn: document.querySelector('.play-game'),
      // resolutionStub: document.querySelector('.resolution-stub'),
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
    this.reset()
  }

  reset() {
    clearTimeout(this.#messageTimeout)
    this.#aiShips = this.#initShips.length
    this.#userShips = this.#initShips.length
    this.#setGameOverStatus(false)
    this.resetLastHitCells()
    this.#refs.messageBlock.classList.add('hide')
  }

  #setGameOverStatus(value) {
    this.#gameOver = value
    this.#refs.aiLoader.classList.add('hide')
  }

  #showMessage(value) {
    const { messageBlock } = state.getRefs()
    const subject = messageBlock.querySelector('p')
    const message = value === 'userShips' ? 'You Lose(' : 'You Win!'
    subject.textContent = message
    const timeOut = state.getTimeoutInterval()
    this.#messageTimeout = setTimeout(() => {
      messageBlock.classList.remove('hide')
    }, timeOut)
  }

  decreaseShip(value) {
    if (this.#gameOver) return
    if (value === 'userShips') this.#userShips -= 1
    else this.#aiShips -= 1

    const remainingShips = value === 'userShips' ? this.#userShips : this.#aiShips
    if (remainingShips === 0) {
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
