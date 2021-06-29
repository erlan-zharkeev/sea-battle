import { Howl } from 'howler'

let soundStatus = true
let music

window.addEventListener('focus', function () {
	if (soundStatus && music) music.play()
})

window.addEventListener('blur', function () {
	music.stop()
})

export function sound(name) {
	let sound
	if (soundStatus) {
		sound = new Howl({
			src: [`./assets/audio/${name}.mp3`],
			loop: name === 'music'
		})
		sound.play()
		if (name === 'music') music = sound
	}
}

const soundBtn = document.querySelector('.game__sound')
soundBtn.addEventListener('click', toggleSound)

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
	};
}