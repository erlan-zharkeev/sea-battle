import { updateSoundBtn, showMessage } from './dom'
import { version } from '../../package.json'
import sounds from './sounds'

const defaultValues = {
  _aiShips: 10,
  _userShips: 10,
  _timeOut: 500,
  _gameOver: false,
  _lastHitCells: [],
}
export default class State {
  constructor() {
    this._version = version
    this._soundStatus = true
    this._initShips = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
    this._refs = {
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
      aiLoader: document
        .querySelector('.sides__ai-side')
        .querySelector('.loader'),
    }
    this._setDefaultState()
  }

  _setDefaultState() {
    Object.entries(defaultValues).forEach(([key, value]) => {
      this[key] = value
    })
  }

  resetStore() {
    this._setDefaultState()
  }

  resetLastHitCells() {
    this._lastHitCells = []
  }

  $refs() {
    return this._refs
  }

  _setGameOverStatus(value) {
    this._gameOver = value
  }

  toggleSoundStatus() {
    this._soundStatus = !this._soundStatus
    updateSoundBtn(this._soundStatus)
    if (this._soundStatus) sounds.background.play()
    else sounds.background.pause()
  }

  decreaseShip(value) {
    this[value] = this[value] - 1
    if (this[value] === 0) {
      this._setGameOverStatus(true)
      showMessage(value)
    }
  }

  pushLastHitCell(cell) {
    this._lastHitCells.push(cell)
  }

  getSoundStatus() {
    return this._soundStatus
  }

  getVersion() {
    return this._version
  }

  getInitShipsArr() {
    return this._initShips
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
    return this._timeOut
  }

  getAiShipsQuantity() {
    return this._aiShips
  }

  getUserShipsQuantity() {
    return this._userShips
  }

  getLastHitCells() {
    return this._lastHitCells
  }

  isGameOver() {
    return this._gameOver
  }
}
