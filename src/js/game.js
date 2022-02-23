import { domUpdate } from './domUpdate'
import { checkIsInternetExplorer } from './utils'
import { initGame, restartGame } from './system'

window.onload = () => {
  checkIsInternetExplorer()
  domUpdate()
  initGame()
  window.addEventListener('focus', () => {})
  window.addEventListener('blur', () => {})
  window.$state.$refs().restartBtn.addEventListener('click', () => {
    restartGame()
  })
  window.$state.$refs().soundBtn.addEventListener('click', () => {
    window.$state.toggleSoundStatus()
  })
}
