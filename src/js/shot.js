import sounds from './sounds'
import Field from './field'
import { randomizer } from './utils'
import {
  hideUserSide,
  showUserSide,
  appendDot,
  markCell,
  removeArmor,
  getCellById,
  getShip,
} from './dom'

export default class Shot {
  constructor(gamer, target) {
    this._timeOut = window.$state.getTimeoutInterval()
    this._enemyTable = null
    this._gamer = gamer
    this._allPosCells = null
    this._target = target
    this._setInitData()
    this._initNextStep()
  }

  _setInitData() {
    const enemyTableClass = this._gamer === 'user' ? 'aiTable' : 'userTable'
    this._enemyTable = window.$state.$refs()[enemyTableClass]
    this._allPosCells = window.$state.getCellByTable(this._enemyTable)
  }

  _initNextStep() {
    if (this._gamer === 'user') {
      this._listenFire()
      return
    }
    if (this._target === undefined) {
      this._getRandPosForFire()
      return
    }
    const fireCell = getCellById(this._enemyTable, this._target)
    this._fire(fireCell)
  }

  _initUser() {
    new Shot('user')
  }

  _initAi() {
    const gameOver = window.$state.isGameOver()
    const isLastHitCellsEmpty = window.$state.getLastHitCells().length === 0
    if (isLastHitCellsEmpty) {
      setTimeout(() => {
        new Shot('ai', undefined)
      }, this._timeOut * 2)
      return
    }
    if (!gameOver) {
      const possibleCoords = this._getCorForFireArr()
      const fireCell = possibleCoords[randomizer(0, possibleCoords.length - 1)]
      setTimeout(() => {
        const target = fireCell.dataset.cellId
        new Shot('ai', target)
      }, this._timeOut * 2)
    }
  }

  _listenFire() {
    this._enemyTable.addEventListener('click', (e) => {
      this._prepareForFire(e)
    })
  }

  _prepareForFire(e) {
    const isHit = !this._isCellNotHit(e.target.dataset.status)
    if (isHit) return
    this._fire(e.target)
    this._enemyTable.removeEventListener('click', this._prepForFire)
  }

  _fire(cell) {
    if (this._isHit(cell)) {
      sounds.hit.play()
      markCell(cell, 'hit')
      const ship = getShip(this._enemyTable, cell)
      removeArmor(ship, cell)
      this._checkSunk(cell)
      if (this._gamer === 'user') {
        this._initUser()
        return
      }
      this._getLastHitCell(cell)
      this._initAi()
      return
    }
    appendDot(cell)
    sounds.miss.play()
    markCell(cell, 'miss')
    if (this._gamer === 'user') {
      this._initAi()
      hideUserSide()
      return
    }
    this._initUser()
    showUserSide()
  }

  _isLose() {
    const ships = this._gamer === 'ai' ? '_userShips' : '_aiShips'
    window.$state.decreaseShip(ships)
  }

  _isReadyForFire(cell) {
    const { status } = cell.dataset
    const isShip = status === 'ship'
    const isDeadZone = status === 'deadZone'
    const isEmpty = status === 'empty'
    return isShip || isDeadZone || isEmpty
  }

  _isHit(cell) {
    return cell.dataset.status === 'ship'
  }

  _checkSunk(cell) {
    const shipCoord = getShip(this._enemyTable, cell)
    const isArmourNull = cell.dataset.class === '0'
    if (isArmourNull) this._setShipSunk(shipCoord, cell)
  }

  _setShipSunk(shipCoord, cell) {
    shipCoord.forEach((el) => {
      markCell(el, 'sunk')
    })
    const deadPos = this._getDeadPosGamePlay(
      shipCoord,
      cell.dataset.direction,
      shipCoord.length
    )
    deadPos.forEach((coord) => {
      const cellForMark = getCellById(this._enemyTable, coord)
      markCell(cellForMark, 'miss')
      if (!cellForMark.firstChild) appendDot(cellForMark)
    })
    if (this._gamer === 'ai') window.$state.resetLastHitCells()
    sounds.sunk.play()
    this._isLose()
  }

  _isCellNotHit(status) {
    const arr = ['empty', 'deadZone', 'ship']
    return arr.some((st) => st === status)
  }

  _getCorForFireArr() {
    const tempArr = []
    const lastHitCells = window.$state.getLastHitCells()
    lastHitCells.forEach((cell) => {
      const x = Number(cell.dataset.cellId.split('-')[0])
      const y = Number(cell.dataset.cellId.split('-')[1])
      if (lastHitCells.length === 1) {
        tempArr.push(`${x - 1}-${y}`)
        tempArr.push(`${x + 1}-${y}`)
        tempArr.push(`${x}-${y - 1}`)
        tempArr.push(`${x}-${y + 1}`)
        return
      }
      const { direction } = lastHitCells[0].dataset
      if (direction === 'v') {
        tempArr.push(`${x - 1}-${y}`)
        tempArr.push(`${x + 1}-${y}`)
        return
      }
      tempArr.push(`${x}-${y - 1}`)
      tempArr.push(`${x}-${y + 1}`)
    })
    // remove unsupported values
    const resultArr = []
    tempArr.forEach((coord) => {
      const table = window.$state.$refs().userTable
      const cell = getCellById(table, coord)
      const isCellNotHit = this._isCellNotHit(cell?.dataset?.status)
      if (cell && isCellNotHit) resultArr.push(cell)
    })
    return resultArr
  }

  _getRandPosForFire() {
    const outputArr = []
    this._allPosCells.forEach((cell) => {
      if (this._isReadyForFire(cell)) outputArr.push(cell)
    })
    const target = outputArr[randomizer(0, outputArr.length - 1)]
    this._fire(target)
  }

  _getLastHitCell(cell) {
    if (Number(cell.dataset.class) === 0) return
    window.$state.pushLastHitCell(cell)
  }

  _getDeadPosGamePlay(shipCoord, direction, type) {
    const coordsArr = this._getCoordsFromCells(shipCoord)
    return new Field(this._enemyTable).getDeadPos(
      coordsArr,
      direction,
      type,
      undefined
    )
  }

  _getCoordsFromCells(shipCoord) {
    const outputArr = []
    shipCoord.forEach((cell) => {
      outputArr.push(cell.dataset.cellId)
    })
    return outputArr
  }
}
