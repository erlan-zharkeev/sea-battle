import { sounds } from './sounds'
import { Field } from './field'
import { randomizer } from './utils'
import { state } from './state'

export class Shot {
  static #aiTimeout

  static #fireHandler

  static reset() {
    clearTimeout(Shot.#aiTimeout)
    const { aiTable, aiLoader } = state.getRefs()
    aiTable.removeEventListener('click', Shot.#fireHandler)
    Shot.#fireHandler = null
    aiLoader.classList.add('hide')
  }

  #timeOut

  #enemyTable

  #gamer

  #allPosCells

  #target

  constructor(gamer, target) {
    this.#timeOut = state.getTimeoutInterval()
    this.#enemyTable = null
    this.#gamer = gamer
    this.#allPosCells = null
    this.#target = target
    this.#setInitData()
    this.#initNextStep()
  }

  #setInitData() {
    const enemyTableClass = this.#gamer === 'user' ? 'aiTable' : 'userTable'
    this.#enemyTable = state.getRefs()[enemyTableClass]
    this.#allPosCells = state.getCellByTable(this.#enemyTable)
  }

  #markCell(cell, mark) {
    cell.dataset.status = mark
  }

  #getCellById(table, id) {
    return table.querySelector(`.cell[data-cell-id="${id}"]`)
  }

  #getShip(table, cell) {
    return table.querySelectorAll(`.cell[data-name="${cell.dataset.name}"]`)
  }

  #removeArmor(ship) {
    ship.forEach((el) => {
      el.dataset.class = Number(el.dataset.class) - 1
    })
  }

  #initNextStep() {
    if (state.isGameOver()) return
    if (this.#gamer === 'user') {
      this.#listenFire()
      return
    }
    if (this.#target === undefined) {
      this.#getRandPosForFire()
      return
    }
    const fireCell = this.#getCellById(this.#enemyTable, this.#target)
    this.#fire(fireCell)
  }

  #initUser() {
    new Shot('user')
  }

  #initAi() {
    if (state.isGameOver()) return

    const possibleCoords = this.#getCorForFireArr()
    const target = possibleCoords.length
      ? possibleCoords[randomizer(0, possibleCoords.length - 1)].dataset.cellId
      : undefined
    clearTimeout(Shot.#aiTimeout)
    Shot.#aiTimeout = setTimeout(() => {
      new Shot('ai', target)
    }, this.#timeOut * 2)
  }

  #listenFire() {
    Shot.reset()
    Shot.#fireHandler = (e) => this.#prepareForFire(e)
    this.#enemyTable.addEventListener('click', Shot.#fireHandler)
  }

  #prepareForFire(e) {
    const cell = e.target.closest('.game-cell')
    if (state.isGameOver() || !cell || !this.#isReadyForFire(cell)) return

    Shot.reset()
    this.#fire(cell)
  }

  #fire(cell) {
    if (this.#isHit(cell)) {
      sounds.hit.play(state.getSoundStatus())
      this.#markCell(cell, 'hit')
      const ship = this.#getShip(this.#enemyTable, cell)
      this.#removeArmor(ship, cell)
      this.#checkSunk(cell)
      if (this.#gamer === 'user') {
        this.#initUser()
        return
      }
      this.#getLastHitCell(cell)
      this.#initAi()
      return
    }
    this.#appendDot(cell)
    sounds.miss.play(state.getSoundStatus())
    this.#markCell(cell, 'miss')
    if (this.#gamer === 'user') {
      this.#initAi()
      const { aiLoader } = state.getRefs()
      aiLoader.classList.remove('hide')
      return
    }
    this.#initUser()
    const { aiLoader } = state.getRefs()
    aiLoader.classList.add('hide')
  }

  #isLose() {
    const ships = this.#gamer === 'ai' ? 'userShips' : 'aiShips'
    state.decreaseShip(ships)
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
    const shipCoord = this.#getShip(this.#enemyTable, cell)
    const isArmourNull = cell.dataset.class === '0'
    if (isArmourNull) this.#setShipSunk(shipCoord, cell)
  }

  #appendDot(cell) {
    const dot = document.createElement('div')
    dot.classList.add('dot')
    cell.append(dot)
  }

  #setShipSunk(shipCoord, cell) {
    shipCoord.forEach((el) => {
      this.#markCell(el, 'sunk')
    })
    const deadPos = this.#getDeadPosGamePlay(
      shipCoord,
      cell.dataset.direction,
      shipCoord.length
    )
    deadPos.forEach((coord) => {
      const cellForMark = this.#getCellById(this.#enemyTable, coord)
      this.#markCell(cellForMark, 'miss')
      if (!cellForMark.firstChild) this.#appendDot(cellForMark)
    })
    if (this.#gamer === 'ai') state.resetLastHitCells()
    sounds.sunk.play(state.getSoundStatus())
    this.#isLose()
  }

  #getCorForFireArr() {
    const tempArr = []
    const lastHitCells = state.getLastHitCells()
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
      const table = state.getRefs().userTable
      const cell = this.#getCellById(table, coord)
      if (cell && this.#isReadyForFire(cell)) resultArr.push(cell)
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
    if (Number(cell.dataset.class)) state.pushLastHitCell(cell)
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
