import { resolutionSupportHandler } from './dom'

export function checkIsInternetExplorer() {
  const isInternetExplorer =
    window.navigator.userAgent.indexOf('MSIE ') > -1 ||
    window.navigator.userAgent.indexOf('Trident/') > -1
  if (isInternetExplorer) {
    alert('your browser not support')
    window.close()
  }
}

export function checkOrientationSupport() {
  const orientation =
    screen.orientation.type === 'portrait-primary' ? 'portrait' : 'landscape'
  const width = window.screen.width
  const stub = orientation === 'portrait' && width < 768 ? 'show' : 'hide'
  resolutionSupportHandler(stub)
}

export function randomizer(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

export default null
