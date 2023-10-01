import { Field } from './field'
import Ship from './ship'
import { Shot } from './shot'
import { state } from './state'

function clearFields() {
  const { cells } = state.getRefs()
  const removeAttributes = [
    'dead-zone',
    'data-class',
    'data-name',
    'data-direction'
  ]

  cells.forEach((cell) => {
    cell.setAttribute('data-status', 'empty')
    removeAttributes.forEach((attr) => {
      cell.removeAttribute(`${attr}`)
    })
    const dot = cell.firstChild
    if (dot) dot.remove()
  })
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
  const { sides } = state.getRefs()
  sides.forEach((side) => {
    fillTable(side)
  })
}

export function initGame() {
  generateShips()
  new Shot('user')
}

export function restartGame() {
  clearFields()
  initGame()
  state.getRefs().messageBlock.classList.add('hide')
}
