export function checkIsInternetExplorer() {
  const isInternetExplorer =
    window.navigator.userAgent.indexOf('MSIE ') > -1 ||
    window.navigator.userAgent.indexOf('Trident/') > -1
  if (isInternetExplorer) {
    alert('your browser not support')
    window.close()
  }
}

export function randomizer(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

export default null
