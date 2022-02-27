import { injectShip, setDeadPos } from './dom'
export default class Field {
  constructor(parent) {
    this._field = window.$state.getChildTable(parent)
  }

  getDeadPos(shipCoord, direction, type, id) {
    let posX
    let posY
    const tempCoordArr = []
    const deadZoneArr = []

    // getEndsDeadPos
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

    // correction for one cell ship
    if (type === 1) {
      deadZoneArr.push(`${posX - 1}-${posY - 1}`)
      if (direction === 'v') deadZoneArr.push(`${posX - 1}-${posY + 1}`)
      else deadZoneArr.push(`${posX + 1}-${posY - 1}`)
    }
    const allCoords = deadZoneArr.join(',').split(',')

    const filteredResult = this.arrFilter(allCoords, shipCoord)

    if (id === undefined) return filteredResult
    setDeadPos(filteredResult, id, this._field)
  }

  arrFilter(allCoords, shipCoord) {
    const interResult = Array.from(new Set(allCoords)).map((el) => {
      if (!shipCoord.includes(el)) return el
    })
    // filter unsupported values
    return interResult.filter((c) => {
      if (c === undefined) return
      const coordArr = c.split('-')
      const y = coordArr[0]
      const x = coordArr[1]
      if (y !== '0' && y !== '11' && x !== '0' && x !== '11') return c
    })
  }

  appendShip(arr, direction, type, id) {
    injectShip(arr, this._field, type, id, direction)
    this.getDeadPos(arr, direction, type, id)
  }
}
