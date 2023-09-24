import { sounds } from './sounds'
import { Field } from './field'
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

export class Shot {
  #timeOut
  #enemyTable
  #gamer
  #allPosCells
  #target
  constructor(gamer, target) {
    this.#timeOut = window.$state.getTimeoutInterval()
    this.#enemyTable = null
    this.#gamer = gamer
    this.#allPosCells = null
    this.#target = target
    this.#setInitData()
    this.#initNextStep()
  }

  #setInitData() {
    const enemyTableClass = this.#gamer === 'user' ? 'aiTable' : 'userTable'
    this.#enemyTable = window.$state.getRefs()[enemyTableClass]
    this.#allPosCells = window.$state.getCellByTable(this.#enemyTable)
  }

  #initNextStep() {
    if (this.#gamer === 'user') {
      this.#listenFire()
      return
    }
    if (this.#target === undefined) {
      this.#getRandPosForFire()
      return
    }
    const fireCell = getCellById(this.#enemyTable, this.#target)
    this.#fire(fireCell)
  }

  #initUser() {
    new Shot('user')
  }

  #initAi() {
    const gameOver = window.$state.isGameOver()
    console.log(gameOver, 'isGame over')
    const isLastHitCellsEmpty = window.$state.getLastHitCells().length === 0
    if (isLastHitCellsEmpty) {
      setTimeout(() => {
        new Shot('ai', undefined)
      }, this.#timeOut * 2)
      return
    }
    if (!gameOver) {
      const possibleCoords = this.#getCorForFireArr()
      const fireCell = possibleCoords[randomizer(0, possibleCoords.length - 1)]
      setTimeout(() => {
        const target = fireCell.dataset.cellId
        new Shot('ai', target)
      }, this.#timeOut * 2)
    }
  }

  #listenFire() {
    this.#enemyTable.addEventListener('click', (e) => {
      this.#prepareForFire(e)
    })
  }

  #prepareForFire(e) {
    const isHit = !this.#isCellNotHit(e.target.dataset.status)
    if (isHit) return
    this.#fire(e.target)
    this.#enemyTable.removeEventListener('click', this.#prepareForFire)
  }

  #fire(cell) {
    if (this.#isHit(cell)) {
      sounds.hit.play()
      markCell(cell, 'hit')
      const ship = getShip(this.#enemyTable, cell)
      removeArmor(ship, cell)
      this.#checkSunk(cell)
      if (this.#gamer === 'user') {
        this.#initUser()
        return
      }
      this.#getLastHitCell(cell)
      console.log('init ai')
      this.#initAi()
      return
    }
    appendDot(cell)
    sounds.miss.play()
    markCell(cell, 'miss')
    if (this.#gamer === 'user') {
      this.#initAi()
      hideUserSide()
      return
    }
    this.#initUser()
    showUserSide()
  }

  #isLose() {
    const ships = this.#gamer === 'ai' ? 'userShips' : 'aiShips'
    window.$state.decreaseShip(ships)
  }

  #isReadyForFire(cell) {
    const { status } = cell.dataset
    const isShip = status === 'ship'
    const isDeadZone = status === 'dead-zone'
    const isEmpty = status === 'empty'
    return isShip || isDeadZone || isEmpty
  }

  #isHit(cell) {
    return cell.dataset.status === 'ship'
  }

  #checkSunk(cell) {
    const shipCoord = getShip(this.#enemyTable, cell)
    const isArmourNull = cell.dataset.class === '0'
    if (isArmourNull) this.#setShipSunk(shipCoord, cell)
  }

  #setShipSunk(shipCoord, cell) {
    console.log('set ship is sunk 1')
    shipCoord.forEach((el) => {
      markCell(el, 'sunk')
    })
    const deadPos = this.#getDeadPosGamePlay(
      shipCoord,
      cell.dataset.direction,
      shipCoord.length
    )
    deadPos.forEach((coord) => {
      const cellForMark = getCellById(this.#enemyTable, coord)
      markCell(cellForMark, 'miss')
      if (!cellForMark.firstChild) appendDot(cellForMark)
    })
    if (this.#gamer === 'ai') window.$state.resetLastHitCells()
    sounds.sunk.play()
    console.log('set ship is sunk 2')
    this.#isLose()
  }

  #isCellNotHit(status) {
    const arr = ['empty', 'dead-zone', 'ship']
    return arr.some((st) => st === status)
  }

  #getCorForFireArr() {
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
    // Remove unsupported values
    const resultArr = []
    tempArr.forEach((coord) => {
      const table = window.$state.getRefs().userTable
      const cell = getCellById(table, coord)
      const isCellNotHit = this.#isCellNotHit(cell?.dataset?.status)
      if (cell && isCellNotHit) resultArr.push(cell)
    })
    return resultArr
  }

  #getRandPosForFire() {
    const outputArr = []
    this.#allPosCells.forEach((cell) => {
      if (this.#isReadyForFire(cell)) outputArr.push(cell)
    })
    const target = outputArr[randomizer(0, outputArr.length - 1)]
    this.#fire(target)
  }

  #getLastHitCell(cell) {
    if (Number(cell.dataset.class)) window.$state.pushLastHitCell(cell)
  }

  #getDeadPosGamePlay(shipCoord, direction, type) {
    const coordsArr = this.#getCoordsFromCells(shipCoord)
    return new Field(this.#enemyTable).getDeadPos(
      coordsArr,
      direction,
      type,
      undefined
    )
  }

  #getCoordsFromCells(shipCoord) {
    const outputArr = []
    shipCoord.forEach((cell) => {
      outputArr.push(cell.dataset.cellId)
    })
    return outputArr
  }
}
