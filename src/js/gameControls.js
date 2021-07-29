import {
  generateShip,
  Field,
} from './positionGenerator'

import {
  Gamer,
} from './gamePlay'

import {
  sound,
} from './sound'

export default function isInternetExplorer() {
  return window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1
}

function initGame() {
  if (isInternetExplorer()) {
    alert('your browser not support')
    window.close()
  }
  generateShip()
  const preloader = document.querySelector('.preloader')
  preloader.remove()
}

window.addEventListener('load', initGame)

// START BTN
const startMessage = document.querySelector('.game__start')
const startBtn = startMessage.querySelector('button')

function playGame(e) {
  e.preventDefault()
  startMessage.classList.add('hide')
  new Gamer('.game__aiSide', 'user')
  sound('music')
}

startBtn.addEventListener('click', playGame)

// RESTART BTN
const restartBtns = document.querySelectorAll('.restart')

const message = document.querySelector('.showMessage')

function restartGame(e) {
  e.preventDefault()
  new Field().clearField()
  generateShip()
  message.classList.add('hide')
  new Gamer('.game__aiSide', 'user')
}

restartBtns.forEach((btn) => {
  btn.addEventListener('click', restartGame)
})
