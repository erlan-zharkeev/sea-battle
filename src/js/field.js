export default class Field {
  constructor(parent) {
    this._field = window.$state.getChildTable(parent)
  }

  clearField() {
    const cells = document.querySelectorAll('.cell')
    const dots = document.querySelectorAll('.cell--shelled')
    const removeAttributes = [
      'deadZone',
      'data-deadzone-id',
      'data-class',
      'data-name',
      'data-direction',
    ]
    dots.forEach((dot) => {
      dot.remove()
    })
    cells.forEach((cell) => {
      cell.setAttribute('data-status', 'empty')
      removeAttributes.forEach((attr) => {
        cell.removeAttribute(`${attr}`)
      })
    })
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
      } else if (direction === 'h') {
        tempCoordArr.push(`${posX}-${posY - 1}`)
        tempCoordArr.push(`${posX}-${posY + 1}`)
      }
    })
    // updateDeadArr
    deadZoneArr.push(tempCoordArr)
    // getSideDeadPos
    tempCoordArr.forEach((coord) => {
      posX = Number(coord.split('-')[0])
      posY = Number(coord.split('-')[1])
      if (direction === 'v') {
        deadZoneArr.push(`${posX}-${posY - 1}`)
        deadZoneArr.push(`${posX}-${posY + 1}`)
      } else if (direction === 'h') {
        deadZoneArr.push(`${posX - 1}-${posY}`)
        deadZoneArr.push(`${posX + 1}-${posY}`)
      }
    })
    // correction for one cell ship
    if (type === 1) {
      deadZoneArr.push(`${posX - 1}-${posY - 1}`)
      if (direction === 'v') deadZoneArr.push(`${posX - 1}-${posY + 1}`)
      else deadZoneArr.push(`${posX + 1}-${posY - 1}`)
    }
    const allCoords = deadZoneArr.join(',').split(',')

    const filteredResault = this.arrFilter(allCoords, shipCoord)

    if (id === undefined) return filteredResault
    this._setDeadPos(filteredResault, id)
  }

  arrFilter(allCoords, shipCoord) {
    // remove double && ship coordinates
    const interResault = Array.from(new Set(allCoords)).map((el) => {
      if (!shipCoord.includes(el)) return el
    })
    // filter unsupported values
    return interResault.filter((c) => {
      if (c !== undefined) {
        const coordArr = c.split('-')
        const y = coordArr[0]
        const x = coordArr[1]
        if (y !== '0' && y !== '11' && x !== '0' && x !== '11') return c
      }
    })
  }

  _setDeadPos(arr, id) {
    arr.forEach((coor) => {
      const cell = this._field.querySelector(`[data-cell-id="${coor}"]`)
      if (cell) {
        cell.setAttribute('data-status', 'deadZone')
        cell.setAttribute('data-deadZone-id', id)
      }
    })
  }

  appendShip(arr, direction, type, id) {
    arr.forEach((coor) => {
      const cell = this._field.querySelector(`[data-cell-id="${coor}"]`)
      cell.setAttribute('data-status', 'ship')
      cell.setAttribute('data-class', type)
      cell.setAttribute('data-name', id)
      cell.setAttribute('data-direction', direction)
    })
    this.getDeadPos(arr, direction, type, id)
  }
}
