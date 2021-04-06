import {
	isInternetExplorer
} from './gameControls';

window.addEventListener('blur', function () {
	music.pause();
});
window.addEventListener('focus', function () {
	if (soundStatus && !isInternetExplorer()) music.play();
});

export let audioCtx;

let musicCtx,
	missSnd,
	missSnd2,
	hitSnd,
	hitSnd2,
	sunkSnd;

const music = document.getElementById('music');

export function initAudioCtx() {
	audioCtx = new(window.AudioContext || window.webkitAudioContext)();

	musicCtx = audioCtx.createMediaElementSource(new Audio('./assets/audio/bgSound.mp3'));
	musicCtx.connect(audioCtx.destination);

	missSnd = audioCtx.createMediaElementSource(new Audio('./assets/audio/missSound.mp3'));
	missSnd.connect(audioCtx.destination);

	missSnd2 = audioCtx.createMediaElementSource(new Audio('./assets/audio/missSound2.mp3'));
	missSnd2.connect(audioCtx.destination);

	hitSnd = audioCtx.createMediaElementSource(new Audio('./assets/audio/hitSound.mp3'));
	hitSnd.connect(audioCtx.destination);

	hitSnd2 = audioCtx.createMediaElementSource(new Audio('./assets/audio/hitSound2.mp3'));
	hitSnd2.connect(audioCtx.destination);

	sunkSnd = audioCtx.createMediaElementSource(new Audio('./assets/audio/sunkSound.mp3'));
	sunkSnd.connect(audioCtx.destination);
}

let hitSoundCounter = 0;
let missSoundCounter = 0;

export class Sound {
	constructor(name) {
		if (soundStatus) {
			if (name == 'hit' && hitSoundCounter == 0) {
				this._sound = document.getElementById('hit');
				hitSoundCounter++;
			} else if (name == 'hit' && hitSoundCounter == 1) {
				this._sound = document.getElementById('hit2');
				hitSoundCounter = 0;
			} else if (name == 'miss' && missSoundCounter == 0) {
				this._sound = document.getElementById('miss');
				missSoundCounter++;
			} else if (name == 'miss' && missSoundCounter == 1) {
				this._sound = document.getElementById('miss2');
				missSoundCounter = 0;
			} else this._sound = document.getElementById(name);
			this._play();
		}
	}
	_play() {
		this._sound.play();
	}
}

const soundBtn = document.querySelector('.game__sound');
soundBtn.addEventListener('click', toggleSound);

const mobileSoundBtn = document.querySelector('.sound-side');
mobileSoundBtn.addEventListener('click', toggleSound);

export let soundStatus = true;

function toggleSound() {
	const soundIcon = this.firstElementChild;
	if (soundIcon.className == 'bg-soundOn') {
		soundIcon.className = 'bg-soundOff';
		music.pause();
		soundStatus = false;
	} else {
		soundIcon.className = 'bg-soundOn';
		music.play();
		soundStatus = true;
	};
}