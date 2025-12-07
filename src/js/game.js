import { checkIsInternetExplorer } from './utils'
import { initGame, restartGame } from './system'
import { sounds } from './sounds'
import { state } from './state'

window.addEventListener('focus', sounds.background.play)
window.addEventListener('blur', sounds.background.pause)
window.addEventListener('load', () => {
  const { versionDom } = state.getRefs()
  const version = state.getVersion()
  versionDom.textContent = `v.${version}`
  checkIsInternetExplorer()
  const { restartBtns, soundBtn, playBtn } = state.getRefs()
  restartBtns.forEach((btn) => {
    btn.addEventListener('click', restartGame)
  })
  soundBtn.addEventListener('click', () => {
    state.toggleSoundStatus()
  })
  playBtn.addEventListener('click', () => {
    initGame()
    playBtn.classList.add('hide')
    sounds.background.play(state.getSoundStatus())
  })
})
