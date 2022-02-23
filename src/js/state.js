import { updateSoundBtn } from './domUpdate'
import { version } from '../../package.json'

export default class State {
  constructor(soundStatus = true) {
    this._soundStatus = soundStatus
    this._version = version
    this._initShips = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
    this._refs = {
      versionDom: document.querySelector('.version'),
      loader: document.querySelector('.loader'),
      soundBtn: document.querySelector('.sound-btn'),
      restartBtn: document.querySelector('.restart-btn'),
      sides: document.querySelectorAll('[data-table]'),
    }
  }

  $refs() {
    return this._refs
  }

  toggleSoundStatus() {
    this._soundStatus = !this._soundStatus
    updateSoundBtn(this._soundStatus)
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
}
