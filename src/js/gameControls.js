window.addEventListener('load', initGame);

import {
	generateShip
} from './positionGenerator';

export function isInternetExplorer() {
	return window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
}

function initGame() {
	if (isInternetExplorer()) {
		alert('your browser not support');
		window.close();
	}
	generateShip();
	const preloader = document.querySelector('.preloader');
	preloader.remove();
};

//START BTN
const startMessage = document.querySelector('.game__start');
const startBtn = startMessage.querySelector('button');
startBtn.addEventListener('click', playGame);

import {
	Gamer
} from './gamePlay';

import {
	Field
} from './positionGenerator';

import {
	initAudioCtx,
	Sound,
	soundStatus,
} from './sound';

function playGame(e) {
	e.preventDefault();
	initAudioCtx();
	startMessage.classList.add('hide');
	new Gamer('.game__aiSide', 'user');
	if (soundStatus) new Sound('music');
};

//MOBILE MENU BTN
const mobileBtn = document.querySelector('.mobile-btn');
mobileBtn.addEventListener('click', toggleMobileMenu);
const mobileMenu = document.querySelector('.mobile-menu');

function toggleMobileMenu() {
	if (mobileMenu.classList.contains('hide')) mobileMenu.classList.remove('hide');
	else mobileMenu.classList.add('hide');
}
//RESTART BTN
const restartBtns = document.querySelectorAll('.restart');
restartBtns.forEach(btn => {
	btn.addEventListener('click', restartGame);
});
const message = document.querySelector('.showMessage')

function restartGame(e) {
	e.preventDefault();
	new Field().clearField();
	generateShip();
	message.classList.add('hide');
	mobileMenu.classList.add('hide');
	new Gamer('.game__aiSide', 'user');
}