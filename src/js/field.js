import { state } from './state'

export class Field {
  #field

  constructor(parent) {
    this.#field = state.getChildTable(parent)
  }

  #setDeadPos(arr, field) {
    arr.forEach((coord) => {
      const cell = field.querySelector(`[data-cell-id="${coord}"]`)
      if (cell) cell.setAttribute('data-status', 'dead-zone')
    })
  }

  #coordFilter(allCoords, shipCoord) {
    const interResult = Array.from(new Set(allCoords)).filter((el) => !shipCoord.includes(el))
    // Filter unsupported values
    return interResult.filter((c) => {
      if (c === undefined) return
      const coordArr = c.split('-')
      const y = coordArr[0]
      const x = coordArr[1]
      if (y !== '0' && y !== '11' && x !== '0' && x !== '11') return c
    })
  }

  #injectShip(arr, field, type, id, direction) {
    arr.forEach((coord) => {
      const cell = field.querySelector(`[data-cell-id="${coord}"]`)
      cell.setAttribute('data-status', 'ship')
      cell.setAttribute('data-class', type)
      cell.setAttribute('data-name', id)
      cell.setAttribute('data-direction', direction)
    })
  }

  appendShip(arr, direction, type, id) {
    this.#injectShip(arr, this.#field, type, id, direction)
    this.getDeadPos(arr, direction, type, id)
  }

  getDeadPos(shipCoord, direction, type, id) {
    let posX
    let posY
    const tempCoordArr = []
    const deadZoneArr = []

    // Get ends of dead pos
    shipCoord.forEach((coord) => {
      posX = Number(coord.split('-')[0])
      posY = Number(coord.split('-')[1])
      if (direction === 'v') {
        tempCoordArr.push(`${posX - 1}-${posY}`)
        tempCoordArr.push(`${posX + 1}-${posY}`)
        return
      }
      tempCoordArr.push(`${posX}-${posY - 1}`)
      tempCoordArr.push(`${posX}-${posY + 1}`)
    })
    deadZoneArr.push(tempCoordArr)
    tempCoordArr.forEach((coord) => {
      posX = Number(coord.split('-')[0])
      posY = Number(coord.split('-')[1])
      if (direction === 'v') {
        deadZoneArr.push(`${posX}-${posY - 1}`)
        deadZoneArr.push(`${posX}-${posY + 1}`)
        return
      }
      deadZoneArr.push(`${posX - 1}-${posY}`)
      deadZoneArr.push(`${posX + 1}-${posY}`)
    })

    // Correction for one cell ship
    if (type === 1) {
      deadZoneArr.push(`${posX - 1}-${posY - 1}`)
      if (direction === 'v') deadZoneArr.push(`${posX - 1}-${posY + 1}`)
      else deadZoneArr.push(`${posX + 1}-${posY - 1}`)
    }
    const allCoords = deadZoneArr.join(',').split(',')

    const filteredResult = this.#coordFilter(allCoords, shipCoord)

    if (id === undefined) return filteredResult
    this.#setDeadPos(filteredResult, this.#field)
  }
}
