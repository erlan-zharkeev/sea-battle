import { Howl } from 'howler'

let soundStatus = true
let music

window.addEventListener('focus', () => {
  if (soundStatus && music) music.play()
})

window.addEventListener('blur', () => {
  if (music)music.stop()
})

export function sound(name) {
  let snd
  if (soundStatus) {
    snd = new Howl({
      src: [`./assets/audio/${name}.mp3`],
      loop: name === 'music',
    })
    snd.play()
    if (name === 'music') music = snd
  }
}

const soundBtn = document.querySelector('.game__sound')

function toggleSound() {
  const soundButton = this.firstElementChild
  if (soundButton.innerHTML === 'sound off') {
    soundButton.innerHTML = 'sound on'
    soundStatus = false
    music.stop()
  } else {
    soundButton.innerHTML = 'sound off'
    soundStatus = true
    music.play()
  }
}
soundBtn.addEventListener('click', toggleSound)
