import Field from './field'
import Ship from './ship'

export function restartGame(e) {
  new Field().clearField()
  generateShips()
  new Gamer('.table__ai-side', 'user')
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
}
export default null
