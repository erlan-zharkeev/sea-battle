export function generateShip() {
	fillTable('.game__userSide');
	fillTable('.game__aiSide');
}

export class Field {
	constructor(parent) {
		if (parent != null) {
			this._parent = parent;
			this._field = document.querySelector(this._parent).querySelector('.game__table');
		}
	}
	clearField() {
		const cells = document.querySelectorAll('.game__cell');
		const dots = document.querySelectorAll('.dot');
		dots.forEach(dot => {
			dot.remove();
		});
		cells.forEach(cell => {
			cell.setAttribute('data-status', "empty");
			cell.removeAttribute('deadZone');
			cell.removeAttribute('data-deadzone-id');
			cell.removeAttribute('data-class');
			cell.removeAttribute('data-name');
			cell.removeAttribute('data-direction');
		});
	}
	getDeadPos(shipCoord, direction, type, id) {
		let posX;
		let posY;

		let tempCoordArr = [];
		let deadZoneArr = [];
		//getEndsDeadPos
		shipCoord.forEach(coord => {
			posX = Number(coord.split('-')[0]);
			posY = Number(coord.split('-')[1]);
			if (direction == 'v') {
				tempCoordArr.push(`${posX - 1}-${posY}`);
				tempCoordArr.push(`${posX + 1}-${posY}`);
			} else if (direction == 'h') {
				tempCoordArr.push(`${posX}-${posY-1}`);
				tempCoordArr.push(`${posX}-${posY+1}`);
			}
		});
		//updateDeadArr
		deadZoneArr.push(tempCoordArr);
		//getSideDeadPos
		tempCoordArr.forEach(coord => {
			posX = Number(coord.split('-')[0]);
			posY = Number(coord.split('-')[1]);
			if (direction == 'v') {
				deadZoneArr.push(`${posX}-${posY-1}`);
				deadZoneArr.push(`${posX}-${posY+1}`);
			} else if (direction == 'h') {
				deadZoneArr.push(`${posX - 1}-${posY}`);
				deadZoneArr.push(`${posX + 1}-${posY}`);
			}
		});
		//correction for 1cell ship
		if (type == 1) {
			deadZoneArr.push(`${posX - 1}-${posY - 1}`);
			if (direction == 'v') deadZoneArr.push(`${posX - 1}-${posY + 1}`);
			else deadZoneArr.push(`${posX + 1}-${posY - 1}`);
		}
		const allCoords = deadZoneArr.join(',').split(',');

		const filteredResault = this.arrFilter(allCoords, shipCoord);

		if (id === undefined) return filteredResault;
		else this._setDeadPos(filteredResault, id);
	}
	arrFilter(allCoords, shipCoord) {
		//remove double && ship coordinates
		const interResault = Array.from(new Set(allCoords)).map(el => {
			if (!shipCoord.includes(el)) return el
		});
		//filter unsupported values
		return interResault.filter(c => {
			if (c != undefined) {
				const coordArr = c.split('-');
				const y = coordArr[0];
				const x = coordArr[1];
				if (y != '0' && y != '11' && x != '0' && x != '11') return c
			}
		})
	};
	_setDeadPos(arr, id) {
		arr.forEach(coor => {
			let cell = this._field.querySelector(`[data-cell-id=\"${coor}\"]`);
			if (cell) {
				cell.setAttribute('data-status', 'deadZone');
				cell.setAttribute('data-deadZone-id', id);
			};
		});
	}
	appendShip(arr, direction, type, id) {
		arr.forEach(coor => {
			let cell = this._field.querySelector(`[data-cell-id=\"${coor}\"]`);
			cell.setAttribute('data-status', 'ship');
			cell.setAttribute('data-class', type);
			cell.setAttribute('data-name', id);
			cell.setAttribute('data-direction', direction);
		});
		this.getDeadPos(arr, direction, type, id);
	}
}

class Ship {
	constructor(type, field, table, id) {
		this._type = type;
		this._id = id;
		this._field = field;
		this._table = table;
		this._initGetData();
	}

	_initGetData() {
		this._direction = this._getDirection();
		this._availableCells = this._getAvailableCells();
		this._randStartPosCell = this._getRandStartPosCell();
		this._getNextPos();
	}
	_getDirection() {
		if (randomizer(0, 1) == 0) return 'v'
		else return 'h';
	}
	_getAvailableCells() {
		let field = document.querySelector(this._table);
		let cells = field.querySelectorAll('.game__cell[data-status="empty"]');
		return cells
	};
	_getRandStartPosCell() {
		let index = randomizer(0, this._availableCells.length);
		while (this._availableCells[index] == undefined) {
			index = randomizer(0, this._availableCells.length);
		}
		return this._availableCells[index].dataset.cellId;
	};
	_getNextPos() {
		const startCoords = this._randStartPosCell.split('-');

		let posX = startCoords[0];
		let posY = startCoords[1];

		const correctionX = (10 - this._type) >= posX;
		const correctionY = (10 - this._type) >= posY;

		let resaultCoord = [];

		for (let i = 0; i < this._type; i++) {
			let currCoorArr = [];
			//check vertical pos
			if (this._direction == 'v') {
				if (correctionX && this._checkNextPos(`${posX}-${posY}`)) {
					currCoorArr.push(posX++, posY);
				} else {
					this._initGetData();
					return
				};
				//check horizontal pos
			} else if (this._direction == 'h') {
				if (correctionY && this._checkNextPos(`${posX}-${posY}`)) {
					currCoorArr.push(posX, posY++);
				} else {
					this._initGetData();
					return
				};
			};
			resaultCoord.push(currCoorArr.join('-'));
		};
		this._field.appendShip(resaultCoord, this._direction, this._type, this._id);
	}
	_checkNextPos(coord) {
		const field = document.querySelector(this._table);
		const cell = field.querySelector(`.game__cell[data-cell-id=\"${coord}\"]`);
		if (cell.dataset.status == 'empty') return true
		else return false;
	}
}

export function randomizer(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

function fillTable(table) {
	const field = new Field(table);
	let shipArr = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
	let id = 1;
	shipArr.forEach(type => {
		new Ship(type, field, table, id++);
	});
}