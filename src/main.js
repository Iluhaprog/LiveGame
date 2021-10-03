"use strict";

import {
	addClick,
	drawRect,
	getCanvas,
	ButtonTypes,
	Button,
	ButtonText,
} from "./helpers.js";
import {
	parentStyle,
	universeStyle,
	Colors,
	ButtonStyle,
	TextStyle,
} from "./styles.js";
import { FlatIndexDoesNotExistsError } from "./errors.js";
import { defaultRule } from "./rules.js";

class Cell {
	constructor({ x, y, sizes, isAlive = false }) {
		this.x = x;
		this.y = y;
		this.sizes = sizes;
		this.isAlive = isAlive;
	}

	draw(context) {
		drawRect(context, {
			x: this.x,
			y: this.y,
			border: { size: 1, color: Colors.BORDERS },
			bg: this.isAlive ? Colors.MAIN : Colors.UNIVERSE,
			width: this.sizes.width,
			height: this.sizes.height,
		});
	}
}

class Universe {
	constructor({ width, height, cellsNumbers, context, rule = defaultRule }) {
		this.rule = rule;
		this.generation = 0;
		this.generations = [];
		this.context = context;
		this.cellsNumbers = cellsNumbers;
		this.width = width;
		this.height = height;
		this.cells = [];

		this.indexMatrix = [];
		this.calcCellsSizes();
		this.initCells();
	}

	calcCellsSizes() {
		this.cellSizes = {
			width: this.width / this.cellsNumbers.X,
			height: this.height / this.cellsNumbers.Y,
		};
	}

	initCells() {
		let i = 0;
		for (let row = 0; row < this.cellsNumbers.Y; row += 1) {
			this.indexMatrix.push([]);
			for (let col = 0; col < this.cellsNumbers.X; col += 1) {
				this.cells.push(
					new Cell({
						x: col * this.cellSizes.width,
						y: row * this.cellSizes.height,
						sizes: this.cellSizes,
					})
				);
				this.indexMatrix[row].push(i);
				i += 1;
			}
		}
	}

	findCellByCoords({ x, y }) {
		return this.cells.findIndex(
			(cell) =>
				cell.x <= x &&
				cell.y <= y &&
				cell.x + cell.sizes.width >= x &&
				cell.y + cell.sizes.height >= y
		);
	}

	setAliveCell(index) {
		this.cells = this.cells.map((cell, i) => {
			if (index === i) {
				return new Cell({
					...cell,
					isAlive: !cell.isAlive,
				});
			}
			return new Cell({ ...cell });
		});
	}

	convertToMatrixPosition(flatIndex) {
		for (let row = 0; row < this.indexMatrix.length; row += 1) {
			for (let col = 0; col < this.indexMatrix[row].length; col += 1) {
				if (this.indexMatrix[row][col] === flatIndex) return { col, row };
			}
		}
		throw new FlatIndexDoesNotExistsError(flatIndex);
	}

	getIndexFromMatrix(col, row) {
		const cells = row < this.cellsNumbers.X ? this.indexMatrix[row] : null;
		if (!cells) return -1;
		const cell = col < cells.length ? this.indexMatrix[row][col] : null;
		if (!cell) return -1;
		return cell;
	}

	getCellEnv(cellIndex) {
		const { col, row } = this.convertToMatrixPosition(cellIndex);
		const m = this.getIndexFromMatrix.bind(this);
		return [
			m(col - 1, row - 1),
			m(col, row - 1),
			m(col + 1, row - 1),
			m(col - 1, row),

			m(col + 1, row),
			m(col - 1, row + 1),
			m(col, row + 1),
			m(col + 1, row + 1),
		]
			.filter((cellIndex) => {
				return cellIndex >= 0;
			})
			.map((cellIndex) => this.cells[cellIndex]);
	}

	calcNextGen() {
		this.generation += 1;
		if (this.generation < this.generations.length) {
			this.cells = this.generations[this.generation];
		} else {
			this.generations.push(this.cells.map((cell) => new Cell({ ...cell })));
			this.cells = this.cells.map((cell, i) => {
				const cellEnv = this.getCellEnv(i);
				if (this.rule(cell, cellEnv)) {
					return new Cell({ ...cell, isAlive: true });
				}
				return new Cell({ ...cell, isAlive: false });
			});
		}
	}

	calcPrevGen() {
		if (this.generation > 0 && this.generation <= this.generations.length) {
			this.generation -= 1;
			console.log("GEN:", this.generation);
			this.cells = this.generations[this.generation];
		}
	}

	clear() {
		this.cells = this.cells.map(
			(cell) => new Cell({ ...cell, isAlive: false })
		);
		this.generations = [];
		this.generation = 0;
	}

	draw() {
		this.context.clearRect(0, 0, this.width, this.height);
		this.cells.forEach((cell) => {
			cell.draw(this.context);
		});
	}
}

class Game {
	static main({
		parent,
		width,
		height,
		cellsNumbers,
		menu,
		defaultRule,
		delay = 100,
	}) {
		const { canvas, context } = getCanvas({ parent, width, height });
		universeStyle.to(canvas);

		const universe = new Universe({
			width,
			height,
			cellsNumbers,
			context,
			rule: defaultRule,
		});

		universe.draw();

		addClick(({ x, y }) => {
			universe.setAliveCell(universe.findCellByCoords({ x, y }));
			universe.draw();
		}).to(canvas);

		let intervalID;

		menu.buttons[ButtonTypes.RUN].addEventListener("click", () => {
			intervalID = setInterval(() => {
				universe.calcNextGen();
				universe.draw();
			}, delay);
		});
		menu.buttons[ButtonTypes.STOP].addEventListener("click", () => {
			if (intervalID) clearInterval(intervalID);
		});
		menu.buttons[ButtonTypes.NEXT_GEN].addEventListener("click", () => {
			universe.calcNextGen();
			universe.draw();
		});
		menu.buttons[ButtonTypes.PREV_GEN].addEventListener("click", () => {
			universe.calcPrevGen();
			universe.draw();
		});
		menu.buttons[ButtonTypes.CLEAR].addEventListener("click", () => {
			universe.clear();
			console.log("click");
			universe.draw();
		});
	}
}

class Menu {
	static gen(parent) {
		const buttons = {};
		Object.keys(ButtonTypes).forEach((key) => {
			buttons[ButtonTypes[key]] = Button({
				parent,
				inner: ButtonText({ inner: ButtonTypes[key], styles: TextStyle }),
				styles: ButtonStyle,
			});
		});
		return { buttons };
	}
}

const init = () => {
	const canvasWrapper = document.createElement("div");
	const menuWrapper = document.createElement("div");

	document.body.appendChild(canvasWrapper);
	document.body.appendChild(menuWrapper);

	Game.main({
		parent: canvasWrapper,
		width: 500,
		height: 500,
		delay: 200,
		cellsNumbers: { X: 50, Y: 50 },
		menu: Menu.gen(menuWrapper),
		rule: defaultRule,
	});

	parentStyle.to(document.body);
};

init();
