import { startDomUpdate, hidePlayBtn } from './dom'
import { checkIsInternetExplorer, checkOrientationSupport } from './utils'
import { initGame, restartGame } from './system'
import { sounds } from './sounds'
import { state } from './state'

window.addEventListener('resize', checkOrientationSupport)
window.addEventListener('focus', sounds.background.play)
window.addEventListener('blur', sounds.background.pause)
window.addEventListener('load', function () {
  checkIsInternetExplorer()
  checkOrientationSupport()
  startDomUpdate()
  state.getRefs().restartBtns.forEach((btn) => {
    btn.addEventListener('click', restartGame)
  })
  state.getRefs().soundBtn.addEventListener('click', () => {
    state.toggleSoundStatus()
  })
  state.getRefs().playBtn.addEventListener('click', function () {
    initGame()
    hidePlayBtn()
    sounds.background.play()
  })
})