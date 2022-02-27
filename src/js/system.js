import Field from './field'
import Ship from './ship'
import Shot from './shot'
import { clearFields } from './dom'

export function restartGame() {
  clearFields()
  initGame()
}

function fillTable(table) {
  const field = new Field(table)
  const shipArr = window.$state.getInitShipsArr()
  let id = 1
  shipArr.forEach((type) => {
    new Ship(type, field, table, id++)
  })
}

function generateShips() {
  const sides = window.$state.$refs().sides
  sides.forEach((side) => {
    fillTable(side)
  })
}

export function initGame() {
  generateShips()
  new Shot('user')
}
export default null
