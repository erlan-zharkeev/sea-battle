export function domUpdate() {
  setVersion()
  loaderHandler(false)
}

export function setVersion() {
  const versionDom = window.$state.$refs().versionDom
  const version = window.$state.getVersion()
  versionDom.textContent = `v.${version}`
}

export function loaderHandler(show) {
  const loader = window.$state.$refs().loader
  show ? loader.classList.remove('hide') : loader.classList.add('hide')
}

export function updateSoundBtn(status) {
  const button = window.$state.$refs().soundBtn
  button.textContent = status ? 'sound off' : 'sound on'
}

export default null
