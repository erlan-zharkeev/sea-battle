import { randomizer } from './utils'

export default class Ship {
  constructor(type, field, table, id) {
    this._type = type
    this._id = id
    this._field = field
    this._table = table
    this._initGetData()
  }

  _initGetData() {
    this._direction = this._getDirection()
    this._availableCells = this._getAvailableCells()
    this._randStartPosCell = this._getRandStartPosCell()
    this._getNextPos()
  }

  _getDirection() {
    return randomizer(0, 1) === 0 ? 'v' : 'h'
  }

  _getAvailableCells() {
    const cells = this._table.querySelectorAll('.cell[data-status="empty"]')
    return cells
  }

  _getRandStartPosCell() {
    let index = randomizer(0, this._availableCells.length)
    while (this._availableCells[index] === undefined) {
      index = randomizer(0, this._availableCells.length)
    }
    return this._availableCells[index].dataset.cellId
  }

  _getNextPos() {
    const startCoords = this._randStartPosCell.split('-')
    let posX = startCoords[0]
    let posY = startCoords[1]

    const correctionX = 10 - this._type >= posX
    const correctionY = 10 - this._type >= posY

    const resultCoord = []

    for (let i = 0; i < this._type; i++) {
      const coordinate = []
      const hasNextPos = this._checkNextPos(`${posX}-${posY}`)
      switch (this._direction) {
        case 'v':
          if (correctionX && hasNextPos) coordinate.push(posX++, posY)
          else {
            this._initGetData()
            return
          }
          break
        case 'h':
          if (correctionY && hasNextPos) coordinate.push(posX, posY++)
          else {
            this._initGetData()
            return
          }
          break
        default:
          break
      }
      resultCoord.push(coordinate.join('-'))
    }
    this._field.appendShip(resultCoord, this._direction, this._type, this._id)
  }

  _checkNextPos(coord) {
    const cell = this._table.querySelector(`.cell[data-cell-id="${coord}"]`)
    return cell.dataset.status === 'empty'
  }
}
