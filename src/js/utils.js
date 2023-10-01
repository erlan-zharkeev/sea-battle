import { state } from './state'

export function checkIsInternetExplorer() {
  const isInternetExplorer = window.navigator.userAgent.indexOf('MSIE ') > -1
    || window.navigator.userAgent.indexOf('Trident/') > -1
  if (isInternetExplorer) {
    alert('your browser not support')
    window.close()
  }
}

export function checkOrientationSupport() {
  const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  const { width } = window.screen
  const stubValue = orientation === 'portrait' && width < 768 ? 'show' : 'hide'
  const resolutionError = state.getRefs().resolutionStub
  const action = stubValue === 'hide' ? 'add' : 'remove'
  resolutionError.classList[action]('hide')
}

export function randomizer(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}
