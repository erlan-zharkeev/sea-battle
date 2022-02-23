import { generateShip, Field } from './ship'

import { Gamer } from './gamePlay'

const restartBtns = document.querySelectorAll('.restart-btn')

const message = document.querySelector('.show-message')

restartBtns.forEach((btn) => {
  btn.addEventListener('click', restartGame)
})
