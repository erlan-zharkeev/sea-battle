import { startDomUpdate, hidePlayBtn } from './dom'
import { checkIsInternetExplorer, checkOrientationSupport } from './utils'
import { initGame, restartGame } from './system'
import { sounds } from './sounds'

window.addEventListener('resize', checkOrientationSupport)
window.addEventListener('focus', sounds.background.play)
window.addEventListener('blur', sounds.background.pause)
window.addEventListener('load', function () {
  checkIsInternetExplorer()
  checkOrientationSupport()
  startDomUpdate()
  this.$state.getRefs().restartBtns.forEach((btn) => {
    btn.addEventListener('click', restartGame)
  })
  this.$state.getRefs().soundBtn.addEventListener('click', () => {
    window.$state.toggleSoundStatus()
  })
  this.$state.getRefs().playBtn.addEventListener('click', function () {
    initGame()
    hidePlayBtn()
    sounds.background.play()
  })
})