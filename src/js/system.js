import { Field } from './field'
import Ship from './ship'
import { Shot } from './shot'
import { clearFields } from './dom'
import { state } from './state'

export function restartGame() {
  clearFields()
  initGame()
  state.getRefs().messageBlock.classList.add('hide')
}

function fillTable(table) {
  const field = new Field(table)
  const shipArr = state.getInitShipsArr()
  let id = 1
  shipArr.forEach((type) => {
    new Ship(type, field, table, id++)
  })
}

function generateShips() {
  const sides = state.getRefs().sides
  sides.forEach((side) => {
    fillTable(side)
  })
}

export function initGame() {
  generateShips()
  new Shot('user')
}
