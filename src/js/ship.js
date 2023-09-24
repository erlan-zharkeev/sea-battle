import { randomizer } from './utils'
import { getCellById } from './dom'

export default class Ship {
  #type
  #id
  #field
  #table
  #direction
  #availableCells
  #randStartPosCell
  constructor(type, field, table, id) {
    this.#type = type
    this.#id = id
    this.#field = field
    this.#table = table
    this.#initGetData()
  }

  #initGetData() {
    this.#direction = this.#getDirection()
    this.#availableCells = window.$state.getAvailableCells(this.#table)
    this.#randStartPosCell = this.#getRandStartPosCell()
    this.#getNextPos()
  }

  #getDirection() {
    return randomizer(0, 1) === 0 ? 'v' : 'h'
  }

  #getRandStartPosCell() {
    let index = randomizer(0, this.#availableCells.length - 1)
    return this.#availableCells[index].dataset.cellId
  }

  #getNextPos() {
    const startCoords = this.#randStartPosCell.split('-')
    let posX = startCoords[0]
    let posY = startCoords[1]

    const correctionX = 10 - this.#type >= posX
    const correctionY = 10 - this.#type >= posY

    const resultCoord = []

    for (let i = 0; i < this.#type; i++) {
      const coordinate = []
      const hasNextPos = this.#checkNextPos(`${posX}-${posY}`)
      switch (this.#direction) {
        case 'v':
          if (correctionX && hasNextPos) coordinate.push(posX++, posY)
          else {
            this.#initGetData()
            return
          }
          break
        case 'h':
          if (correctionY && hasNextPos) coordinate.push(posX, posY++)
          else {
            this.#initGetData()
            return
          }
          break
        default:
          break
      }
      resultCoord.push(coordinate.join('-'))
    }
    this.#field.appendShip(resultCoord, this.#direction, this.#type, this.#id)
  }

  #checkNextPos(coord) {
    const cell = getCellById(this.#table, coord)
    return cell.dataset.status === 'empty'
  }
}
