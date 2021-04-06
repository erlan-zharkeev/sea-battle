import {
	Field,
	randomizer
} from "./positionGenerator";

import {
	Sound
} from "./sound";

const timeOut = 500;
export let lastHittedCells = [];
let gameOver = false;
let aiShips = 10;
let userShips = 10;

export class Gamer {
	constructor(table, gamer, target) {
		this._table = document.querySelector(table);
		this._gamer = gamer;
		this._allPosCells = this._table.querySelectorAll('.game__cell');
		this._target = target;
		this._initNextStep();
	}
	//init
	_initNextStep() {
		//user fire
		if (this._gamer === 'user') this._listenFire();
		//random ai fire
		else if (this._target === undefined) {
			this._getRandPosForFire()
			//target ai fire
		} else {
			const fireCell = this._getCellFromCoord(this._target);
			this._fire(fireCell);
		}
	}
	_initUser() {
		new Gamer('.game__aiSide', 'user');
	}
	_initAi() {
		if (lastHittedCells.length == 0) {
			setTimeout(() => {
				new Gamer('.game__userSide', 'ai', undefined);
			}, timeOut * 2);
		} else if (!gameOver) {
			const possibleCoords = this._getCorForFireArr();
			const fireCell = possibleCoords[randomizer(0, possibleCoords.length - 1)];
			setTimeout(() => {
				new Gamer('.game__userSide', 'ai', fireCell.dataset.cellId);
			}, timeOut * 2);
		}
	}
	_listenFire() {
		this._target;
		let self = this;
		this._table.addEventListener('click', prepForFire);

		function prepForFire(e) {
			if (self._isNotHitten(e.target.dataset.status)) {
				self._fire(e.target);
				self._table.removeEventListener('click', prepForFire);
			};
		}
	}
	//SETTERS
	_fire(cell) {
		//HIT
		if (this._isHit(cell)) {
			new Sound('hit');
			this._markCell(cell, 'hit');
			this._removeArmor(cell);
			this._isSunk(cell);
			if (this._gamer === 'ai') {
				this._getLastHittedCell(cell);
				this._initAi();
			} else if (this._gamer === 'user') this._initUser();
			//MISS
		} else {
			new Sound('miss');
			this._markCell(cell, 'miss');
			if (this._gamer === 'ai') {
				this._initUser();
				this._showUserSide();
			} else if (this._gamer === 'user') {
				this._initAi();
				this._hideUserSide();
			};
		};
	}
	_showUserSide() {
		const aiTable = document.querySelector('.game__aiSide');
		aiTable.classList.remove('hideSide');
	}
	_hideUserSide() {
		const aiTable = document.querySelector('.game__aiSide');
		aiTable.classList.add('hideSide');
	}
	_markCell(cell, mark) {
		cell.dataset.status = mark;
	}
	_createDot() {
		const dot = document.createElement('div');
		dot.classList.add('dot');
		return dot
	}
	_removeArmor(cell) {
		this._getShip(cell).forEach(el => {
			el.dataset.class = Number(el.dataset.class) - 1;
		})
	}
	_gameOver(message) {
		gameOver = true;
		const messagePage = document.querySelector('.showMessage');
		const subject = messagePage.querySelector('p');
		subject.textContent = message;
		setTimeout(() => {
			messagePage.classList.remove('hide');
			this._refreshGlobalVars();
		}, timeOut);
	}
	_refreshGlobalVars() {
		aiShips = 10;
		userShips = 10;
		gameOver = false;
	}
	//CHECKS
	_isLose() {
		if (this._gamer == 'ai') {
			userShips--;
			if (userShips == 0) this._gameOver('you lose');
		} else if (this._gamer == 'user') {
			aiShips--;
			if (aiShips == 0) this._gameOver('you win');
		}
	}
	_isReadyForFire(cell) {
		const status = cell.dataset.status;
		if (status == 'ship' || status == 'deadZone' || status == 'empty') return true;
		else return false;
	}
	_isHit(cell) {
		if (cell.dataset.status === 'ship') {
			return true;
		} else {
			cell.append(this._createDot());
			return false;
		}
	}
	_isSunk(cell) {
		const shipCoord = this._getShip(cell)
		if (cell.dataset.class == 0) {
			shipCoord.forEach(el => {
				this._markCell(el, 'sunk');
			})
			const deadPos = this._getDeadPosGamePlay(shipCoord, cell.dataset.direction, shipCoord.length)
			deadPos.forEach(dp => {
				const cellForMark = this._getCellFromCoord(dp)
				this._markCell(cellForMark, 'miss');
				if (!cellForMark.firstChild) cellForMark.append(this._createDot());
			})
			if (this._gamer == 'ai') lastHittedCells = [];
			new Sound('sunk');
			this._isLose();
		}
	}
	_isNotHitten(status) {
		const arr = ['empty', 'deadZone', 'ship'];
		return arr.some(st => {
			return st === status;
		})
	}
	//GETTERS
	_getCorForFireArr() {
		let tempArr = [];
		lastHittedCells.forEach(cell => {
			let x = Number(cell.dataset.cellId.split('-')[0]);
			let y = Number(cell.dataset.cellId.split('-')[1]);
			if (lastHittedCells.length == 1) {
				tempArr.push(`${x-1}-${y}`);
				tempArr.push(`${x+1}-${y}`);
				tempArr.push(`${x}-${y-1}`);
				tempArr.push(`${x}-${y+1}`);
			} else {
				const direction = lastHittedCells[0].dataset.direction;
				if (direction == 'v') {
					tempArr.push(`${x-1}-${y}`);
					tempArr.push(`${x+1}-${y}`);
				} else if (direction == 'h') {
					tempArr.push(`${x}-${y-1}`);
					tempArr.push(`${x}-${y+1}`);
				}
			}
		})
		//remove unsupported value
		let tempArr2 = [];
		tempArr.forEach(coord => {
			const table = document.querySelector('.game__userSide');
			const cell = table.querySelector(`.game__cell[data-cell-id=\"${coord}\"]`);
			if (cell != null && this._isNotHitten(cell.dataset.status)) tempArr2.push(cell);
		})
		return tempArr2;
	}
	_getRandPosForFire() {
		let outputArr = [];
		this._allPosCells.forEach(cell => {
			if (this._isReadyForFire(cell)) outputArr.push(cell);
		})
		const target = outputArr[randomizer(0, outputArr.length - 1)];
		this._fire(target);
	}
	_getLastHittedCell(cell) {
		if (cell.dataset.class != 0) lastHittedCells.push(cell);
	}
	_getShip(cell) {
		return this._table.querySelectorAll(`.game__cell[data-name=\"${cell.dataset.name}\"]`)
	}
	_getDeadPosGamePlay(shipCoord, direction, type) {
		const coordsArr = this._getCoordsFromCells(shipCoord);
		return new Field(`.${this._table.className}`).getDeadPos(coordsArr, direction, type, undefined);
	}
	_getCoordsFromCells(shipCoord) {
		let outputArr = [];
		shipCoord.forEach(cell => {
			outputArr.push(cell.dataset.cellId)
		})
		return outputArr;
	}
	_getCellFromCoord(coord) {
		return this._table.querySelector(`.game__cell[data-cell-id=\"${coord}\"]`);
	}
}