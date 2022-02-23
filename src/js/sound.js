import { Howl } from 'howler'
export default class Sound {
  constructor(name) {
    this._sound = null
    this._fileName = name
    this._setSound()
  }
  _setSound() {
    this._sound = new Howl({
      src: [`./assets/audio/${this._fileName}.mp3`],
      loop: name === 'background',
    })
  }
  play() {
    const status = window.$state.getSoundStatus()
    if (!status) return
    this._sound.play()
  }
  stop() {
    this._sound.stop()
  }
}
