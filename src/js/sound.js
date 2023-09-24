import { Howl } from 'howler'
export default class Sound {
  #fileName
  constructor(name) {
    this.sound = null
    this.#fileName = name
    this.#setSound()
  }
  #setSound() {
    this.sound = new Howl({
      src: [`./assets/audio/${this.#fileName}.mp3`],
      loop: name === 'background'
    })
  }
  play() {
    const status = window.$state.getSoundStatus()
    if (status) this.sound?.play()
  }
  stop() {
    this.sound?.stop()
  }
  pause() {
    this.sound?.pause()
  }
}
