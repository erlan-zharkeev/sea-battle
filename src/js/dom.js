export function startDomUpdate() {
  setVersion()
  loaderHandler(false)
}

export function resolutionSupportHandler(value) {
  const resolutonError = window.$state.$refs().resolutionStub
  if (value === 'hide') {
    resolutonError.classList.add('hide')
    return
  }
  resolutonError.classList.remove('hide')
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

export function hidePlayBtn() {
  const button = window.$state.$refs().playBtn
  button.classList.add('hide')
}

export function updateSoundBtn(status) {
  const button = window.$state.$refs().soundBtn
  button.textContent = status ? 'sound off' : 'sound on'
}

export function hideUserSide() {
  const aiLoader = window.$state.$refs().aiLoader
  aiLoader.classList.remove('hide')
}

export function showUserSide() {
  const aiLoader = window.$state.$refs().aiLoader
  aiLoader.classList.add('hide')
}

export function appendDot(cell) {
  const dot = document.createElement('div')
  dot.classList.add('dot')
  cell.append(dot)
}

export function markCell(cell, mark) {
  cell.dataset.status = mark
}

export function removeArmor(ship) {
  ship.forEach((el) => {
    el.dataset.class = Number(el.dataset.class) - 1
  })
}

export function getCellById(table, id) {
  return table.querySelector(`.cell[data-cell-id="${id}"]`)
}

export function getShip(table, cell) {
  return table.querySelectorAll(`.cell[data-name="${cell.dataset.name}"]`)
}

export function clearFields() {
  const cells = window.$state.$refs().cells
  const dots = window.$state.getShelledCells()
  const removeAttributes = [
    'deadZone',
    'data-deadzone-id',
    'data-class',
    'data-name',
    'data-direction',
  ]
  dots.forEach((dot) => {
    dot.remove()
  })
  cells.forEach((cell) => {
    cell.setAttribute('data-status', 'empty')
    removeAttributes.forEach((attr) => {
      cell.removeAttribute(`${attr}`)
    })
  })
}

export function injectShip(arr, field, type, id, direction) {
  arr.forEach((coord) => {
    const cell = field.querySelector(`[data-cell-id="${coord}"]`)
    cell.setAttribute('data-status', 'ship')
    cell.setAttribute('data-class', type)
    cell.setAttribute('data-name', id)
    cell.setAttribute('data-direction', direction)
  })
}

export function setDeadPos(arr, id, field) {
  arr.forEach((coord) => {
    const cell = field.querySelector(`[data-cell-id="${coord}"]`)
    if (cell) {
      cell.setAttribute('data-status', 'deadZone')
      cell.setAttribute('data-deadZone-id', id)
    }
  })
}

export function showMessage(value) {
  const messageBlock = document.querySelector('.message')
  const subject = messageBlock.querySelector('p')
  const message = value === 'userShips' ? 'you lose' : 'you win'
  subject.textContent = message
  const timeOut = window.$state.getTimeoutInterval()
  setTimeout(() => {
    messageBlock.classList.remove('hide')
    window.$state.resetStore()
  }, timeOut)
}

export default null
