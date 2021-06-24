import {
	isInternetExplorer
} from './gameControls'

import { Howl } from 'howler'

export const music = new Howl({
	src: [`../assets/audio/music.mp3`]
})

window.addEventListener('blur', function () {
	music.pause()
})

export function sound(name) {
	let sound
	if (soundStatus) {
		sound = new Howl({
			src: [`../assets/audio/${name}.mp3`]
		})
		sound.play()
	}
}

const soundBtn = document.querySelector('.game__sound')
soundBtn.addEventListener('click', toggleSound)

const mobileSoundBtn = document.querySelector('.sound-side')
mobileSoundBtn.addEventListener('click', toggleSound)

export let soundStatus = true

function toggleSound() {
	const soundIcon = this.firstElementChild
	if (soundIcon.className === 'bg-soundOn') {
		soundIcon.className = 'bg-soundOff'
		soundStatus = false
		music.pause()
	} else {
		soundIcon.className = 'bg-soundOn'
		soundStatus = true
		music.play()
	};
}