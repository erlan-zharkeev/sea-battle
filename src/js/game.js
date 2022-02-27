import { startDomUpdate, hidePlayBtn } from './dom'
import { checkIsInternetExplorer, checkOrientationSupport } from './utils'
import { initGame, restartGame } from './system'
import sounds from './sounds'

window.addEventListener('load', function () {
  checkIsInternetExplorer()
  checkOrientationSupport()
  startDomUpdate()

  this.$state.$refs().restartBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      restartGame()
    })
  })

  this.$state.$refs().soundBtn.addEventListener('click', () => {
    window.$state.toggleSoundStatus()
  })

  this.$state.$refs().playBtn.addEventListener('click', () => {
    initGame()
    hidePlayBtn()
    sounds.background.play()
  })
})
window.addEventListener('resize', function () {
  checkOrientationSupport()
})

window.addEventListener('focus', () => {
  sounds.background.play()
})

window.addEventListener('blur', () => {
  sounds.background.pause()
})
