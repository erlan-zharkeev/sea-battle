export function startDomUpdate() {
  setVersion()
  loaderHandler(false)
}

export function resolutionSupportHandler(value) {
  const resolutionError = window.$state.getRefs().resolutionStub
  const action = value === 'hide' ? 'add' : 'remove'
  resolutionError.classList[action]('hide')
}

export function setVersion() {
  const versionDom = window.$state.getRefs().versionDom
  const version = window.$state.getVersion()
  versionDom.textContent = `v.${version}`
}

export function loaderHandler(show) {
  const loader = window.$state.getRefs().loader
  const action = show ? 'remove' : 'add'
  loader.classList[action]('hide')
}

export function hidePlayBtn() {
  const button = window.$state.getRefs().playBtn
  button.classList.add('hide')
}

export function updateSoundBtn(status) {
  const button = window.$state.getRefs().soundBtn
  button.textContent = status ? 'sound off' : 'sound on'
}

export function hideUserSide() {
  const aiLoader = window.$state.getRefs().aiLoader
  aiLoader.classList.remove('hide')
}

export function showUserSide() {
  const aiLoader = window.$state.getRefs().aiLoader
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
  const cells = window.$state.getRefs().cells
  const removeAttributes = [
    'dead-zone',
    'data-class',
    'data-name',
    'data-direction',
  ]

  cells.forEach((cell) => {
    cell.setAttribute('data-status', 'empty')
    removeAttributes.forEach((attr) => {
      cell.removeAttribute(`${attr}`)
    })
    const dot = cell.firstChild
    if (dot) dot.remove()
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
    if (cell) cell.setAttribute('data-status', 'dead-zone')
  })
}

export function showMessage(value) {
  const { messageBlock } = window.$state.getRefs()
  const subject = messageBlock.querySelector('p')
  const message = value === 'userShips' ? 'You Lose(' : 'You Win!'
  subject.textContent = message
  const timeOut = window.$state.getTimeoutInterval()
  setTimeout(() => {
    messageBlock.classList.remove('hide')
    window.$state.resetStore()
  }, timeOut)
}