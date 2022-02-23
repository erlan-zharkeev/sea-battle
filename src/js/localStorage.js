export default class LocalStorage {
  saveAll() {
    const data = {
      squares: global.$state.getSquaresMap(),
      score: global.$state.getScore(),
      soundStatus: global.$state.getSoundStatus(),
    }
    this.save(data)
  }

  _stringify(data) {
    return JSON.stringify(data)
  }

  _parse(data) {
    return JSON.parse(data)
  }

  save(data) {
    const currentData = this.getLsData() ? this.getLsData() : {}
    Object.entries(data).forEach(([key, val]) => {
      currentData[key] = val
    })
    const stringifiedData = this._stringify(currentData)
    localStorage.setItem('2048', stringifiedData)
  }

  getLsData() {
    const data = localStorage.getItem('2048')
    return this._parse(data)
  }
}
